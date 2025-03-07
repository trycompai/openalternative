import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

export type EmailProps = EmailWrapperProps & {
  tool: Tool | Jsonify<Tool>
}

const EmailSubmissionExpedited = ({ tool, ...props }: EmailProps) => {
  return (
    <EmailWrapper signature {...props}>
      <Text>Hey {tool.submitterName}!</Text>

      <Text>
        Thanks for submitting {tool.name}, it will now be reviewed and added to our directory{" "}
        <strong>within 24 hours</strong>. If you want your tool published on a specific date, please
        let us know. We'll do our best to meet your request.
      </Text>

    </EmailWrapper>
  )
}

export default EmailSubmissionExpedited
