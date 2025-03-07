import { differenceInDays } from "date-fns"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import EmailToolExpediteReminder from "~/emails/tool-expedite-reminder"
import EmailToolScheduled from "~/emails/tool-scheduled"
import { sendEmails } from "~/lib/email"
import { generateContentWithRelations } from "~/lib/generate-content"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { getToolRepositoryData } from "~/lib/repositories"
import { analyzeRepositoryStack } from "~/lib/stack-analysis"
import { inngest } from "~/services/inngest"
import { ensureFreeSubmissions } from "~/utils/functions"

export const toolScheduled = inngest.createFunction(
  { id: "tool.scheduled", concurrency: { limit: 2 } },
  { event: "tool.scheduled" },

  async ({ event, step, db, logger }) => {
    const tool = await step.run("find-tool", async () => {
      return db.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // Run steps in parallel
    await Promise.all([
      step.run("generate-content", async () => {
        const { categories, alternatives, ...content } = await generateContentWithRelations(
          tool.websiteUrl,
        )

        return await db.tool.update({
          where: { id: tool.id },
          data: {
            ...content,
            categories: { connect: categories.map(({ id }) => ({ id })) },
            alternatives: { connect: alternatives.map(({ id }) => ({ id })) },
          },
        })
      }),

      step.run("fetch-repository-data", async () => {
        const data = await getToolRepositoryData(tool.repositoryUrl)

        if (!data) return

        return await db.tool.update({
          where: { id: tool.id },
          data,
        })
      }),

      step.run("upload-favicon", async () => {
        const { id, slug, websiteUrl } = tool
        const faviconUrl = await uploadFavicon(websiteUrl, `tools/${slug}/favicon`)

        return await db.tool.update({
          where: { id },
          data: { faviconUrl },
        })
      }),

      step.run("upload-screenshot", async () => {
        const { id, slug, websiteUrl } = tool
        const screenshotUrl = await uploadScreenshot(websiteUrl, `tools/${slug}/screenshot`)

        return await db.tool.update({
          where: { id },
          data: { screenshotUrl },
        })
      }),
    ])

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("schedule")
      revalidateTag(`tool-${tool.slug}`)
    })

    // If no submitter email, return early
    if (!tool.submitterEmail) {
      return
    }

    const to = tool.submitterEmail

    // Send initial email
    await step.run("send-email", async () => {
      const subject = `Great news! ${tool.name} is scheduled for publication on ${config.site.name} 🎉`

      return await sendEmails({
        to,
        subject,
        react: EmailToolScheduled({ to, subject, tool }),
      })
    })
  },
)
