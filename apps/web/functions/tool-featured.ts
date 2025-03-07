import { config } from "~/config"
import EmailAdminNewSubmission from "~/emails/admin/new-submission"
import { type EmailParams, sendEmails } from "~/lib/email"
import { inngest } from "~/services/inngest"

export const toolFeatured = inngest.createFunction(
  { id: "tool.featured" },
  { event: "tool.featured" },
  async ({ event, step, db }) => {
    const tool = await step.run("fetch-tool", async () => {
      return await db.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    await step.run("send-featured-emails", async () => {
      const adminTo = config.site.email
      const adminSubject = "New Featured Listing Request"

      const emails: EmailParams[] = [
        {
          to: adminTo,
          subject: adminSubject,
          react: EmailAdminNewSubmission({ tool, to: adminTo, subject: adminSubject }),
        },
      ]

      return await sendEmails(emails)
    })
  },
)
