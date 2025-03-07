import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

export type EmailProps = EmailWrapperProps & {
  tool: Tool | Jsonify<Tool>
}

const EmailToolPublished = ({ tool, ...props }: EmailProps) => {
  return (
    <EmailWrapper signature {...props}>
      <Text>Hey {tool.submitterName}!</Text>

      <Text>
        Great news! Your submitted tool,{" "}
        <strong>
          {tool.name}, is now live on {config.site.name}
        </strong>
        . Thank you for sharing this awesome resource with our community!
      </Text>

      <Text>
        We'd love it if you could spread the word. A quick post on your favorite social platform or
        dev community about {tool.name} would mean a lot to us. It helps other developers discover
        cool tools like yours!
      </Text>

      <EmailButton href={`${config.site.url}/${tool.slug}`}>
        Check out {tool.name} on {config.site.name}
      </EmailButton>

    </EmailWrapper>
  )
}

export default EmailToolPublished
