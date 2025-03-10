"use server"

import { slugify } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { generateContent } from "~/lib/generate-content"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"
import { analyzeRepositoryStack } from "~/lib/stack-analysis"
import { toolSchema } from "~/server/admin/tools/schemas"
import { githubClient } from "~/services/github"
import { inngest } from "~/services/inngest"

export const createTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { alternatives, categories, ...input } }) => {
    const tool = await db.tool.create({
      data: {
        ...input,
        slug: input.slug || slugify(input.name),
        alternatives: { connect: alternatives?.map(id => ({ id })) },
        categories: { connect: categories?.map(id => ({ id })) },
      },
    })

    if (tool.publishedAt) {
      await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } })
    }

    return tool
  })

export const updateTool = adminProcedure
  .createServerAction()
  .input(toolSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, alternatives, categories, ...input } }) => {
    const tool = await db.tool.update({
      where: { id },
      data: {
        ...input,
        alternatives: { set: alternatives?.map(id => ({ id })) },
        categories: { set: categories?.map(id => ({ id })) },
      },
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)

    return tool
  })

export const deleteTools = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await db.tool.deleteMany({
      where: { id: { in: ids } },
    })

    revalidateTag("tools")

    // Send an event to the Inngest pipeline
    for (const tool of tools) {
      await inngest.send({ name: "tool.deleted", data: { slug: tool.slug } })
    }

    return true
  })

export const scheduleTool = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string(), publishedAt: z.coerce.date() }))
  .handler(async ({ input: { id, publishedAt } }) => {
    const tool = await db.tool.update({
      where: { id },
      data: { status: ToolStatus.Scheduled, publishedAt },
    })

    revalidateTag("schedule")
    revalidateTag(`tool-${tool.slug}`)

    await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } })

    return true
  })

export const reuploadToolAssets = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })

    const [faviconUrl, screenshotUrl] = await Promise.all([
      uploadFavicon(tool.websiteUrl, `tools/${tool.slug}/favicon`),
      uploadScreenshot(tool.websiteUrl, `tools/${tool.slug}/screenshot`),
    ])

    await db.tool.update({
      where: { id: tool.id },
      data: { faviconUrl, screenshotUrl },
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)

    return true
  })

export const regenerateToolContent = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })
    const data = await generateContent(tool.websiteUrl)

    await db.tool.update({
      where: { id: tool.id },
      data,
    })

    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)

    return true
  })

export const analyzeToolStack = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })

    // Get analysis and cache it
    const repo = await githubClient.queryRepository(tool.repositoryUrl)
    const screenshotUrl = await uploadScreenshot(tool.websiteUrl, `tools/${tool.slug}/screenshot`)
    const faviconUrl = await uploadFavicon(tool.websiteUrl, `tools/${tool.slug}/favicon`)

    if (!repo) {
      throw new Error("Repository not found")
    }

    await db.tool.update({
      where: { id: tool.id },
      data: {
        screenshotUrl,
        faviconUrl,
        stars: repo.stars,
        forks: repo.forks,
        score: repo.score,
        firstCommitDate: repo.createdAt,
        lastCommitDate: repo.pushedAt,
        license: repo.license
          ? {
              connectOrCreate: {
                where: { name: repo.license },
                create: { name: repo.license, slug: slugify(repo.license).replace(/-0$/, "") },
              },
            }
          : undefined,
      },
    })
  })
