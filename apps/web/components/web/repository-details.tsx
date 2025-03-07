import { formatDate, formatNumber, isTruthy } from "@curiousleaf/utils"
import { formatDistanceToNowStrict, formatISO } from "date-fns"
import {
  CopyrightIcon,
  GitForkIcon,
  HistoryIcon,
  ServerIcon,
  StarIcon,
  TimerIcon,
} from "lucide-react"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { H5 } from "~/components/common/heading"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { Insights } from "~/components/web/ui/insights"
import type { ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type RepositoryDetailsProps = ComponentProps<"div"> & {
  tool: ToolOne
}

export const RepositoryDetails = ({ className, tool, ...props }: RepositoryDetailsProps) => {
  const insights = [
    { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: <StarIcon /> },
    { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: <GitForkIcon /> },
    tool.lastCommitDate
      ? {
          label: "Last commit",
          value: formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true }),
          title: formatDate(tool.lastCommitDate),
          icon: <TimerIcon />,
        }
      : undefined,
    tool.firstCommitDate
      ? {
          label: "Repository age",
          value: formatDistanceToNowStrict(tool.firstCommitDate),
          title: formatDate(tool.firstCommitDate),
          icon: <HistoryIcon />,
        }
      : undefined,
    tool.license
      ? {
          label: "License",
          value: tool.license.name,
          link: `/licenses/${tool.license.slug}`,
          icon: <CopyrightIcon />,
        }
      : undefined,
    tool.isSelfHosted
      ? {
          label: "Self-hosted",
          value: "Yes",
          link: "/self-hosted",
          icon: <ServerIcon />,
        }
      : undefined,
  ]

  return (
    <Card
      hover={false}
      focus={false}
      className={cx("items-stretch bg-transparent", className)}
      {...props}
    >
      <Stack direction="column">
        <Stack size="sm" className="w-full justify-between">
          <H5 as="strong">Details:</H5>

          <ToolBadges tool={tool} />
        </Stack>

        <Insights insights={insights.filter(isTruthy)} className="text-sm" />
      </Stack>

      {tool.repositoryUrl && (
        <Button
          size="md"
          variant="secondary"
          prefix={<BrandGitHubIcon />}
          className="mt-1 self-start"
          asChild
        >
          <ExternalLink
            href={tool.repositoryUrl}
            eventName="click_repository"
            eventProps={{ url: tool.repositoryUrl }}
          >
            Go to GitHub Repository
          </ExternalLink>
        </Button>
      )}

      <p className="text-muted-foreground/75 text-[11px]">
        We fetched this data automatically from GitHub{" "}
        <time dateTime={formatISO(tool.updatedAt)} className="font-medium text-muted-foreground">
          {formatDistanceToNowStrict(tool.updatedAt, { addSuffix: true })}
        </time>
        .
      </p>
    </Card>
  )
}
