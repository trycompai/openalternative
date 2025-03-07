import { ToolStatus } from "@openalternative/db/client"
import { revalidateTag } from "next/cache"
import { getToolRepositoryData } from "~/lib/repositories"
import { inngest } from "~/services/inngest"

export const fetchTools = inngest.createFunction(
  { id: "fetch-tools", retries: 1 },
  { cron: "TZ=Europe/Warsaw 0 0 * * *" }, // Every day at midnight

  async ({ step, db, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return await db.tool.findMany({
        where: { status: { in: [ToolStatus.Published, ToolStatus.Scheduled] } },
      })
    })

    await step.run("fetch-repository-data", async () => {
      return await Promise.all(
        tools.map(async tool => {
          const updatedTool = await getToolRepositoryData(tool.repositoryUrl)
          logger.info(`Updated tool data for ${tool.name}`, { updatedTool })

          if (!updatedTool) {
            return null
          }

          return db.tool.update({
            where: { id: tool.id },
            data: updatedTool,
          })
        }),
      )
    })

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("tools")
      revalidateTag("tool")
    })
  },
)
