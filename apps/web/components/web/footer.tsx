"use client"

import { AtSignIcon, HeartIcon, RssIcon } from "lucide-react"
import type { ComponentProps } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { H6 } from "~/components/common/heading"
import { BrandLinkedInIcon } from "~/components/common/icons/brand-linkedin"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Stack } from "~/components/common/stack"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { NavLink } from "~/components/web/ui/nav-link"
import { config } from "~/config"
import { cx } from "~/utils/cva"

type FooterProps = ComponentProps<"div"> & {
  hideNewsletter?: boolean
}

export const Footer = ({ children, className, hideNewsletter, ...props }: FooterProps) => {
  return (
    <footer
      className="flex flex-col gap-y-8 mt-auto pt-8 border-t border-foreground/10 md:pt-10 lg:pt-12"
      {...props}
    >
      <div
        className={cx(
          "grid grid-cols-3 gap-y-8 gap-x-4 md:gap-x-6 md:grid-cols-[repeat(16,minmax(0,1fr))]",
          className,
        )}
        {...props}
      >
        <Stack
          direction="column"
          className="flex flex-col items-start gap-4 col-span-full md:col-span-6"
        >
          <Stack className="text-sm/normal">
            <TooltipProvider delayDuration={500}>
              <DropdownMenu modal={false}>
                <Tooltip tooltip="RSS Feeds">
                  <DropdownMenuTrigger aria-label="RSS Feeds">
                    <RssIcon className="size-[1.44em] text-muted-foreground hover:text-foreground" />
                  </DropdownMenuTrigger>
                </Tooltip>

                <DropdownMenuContent align="start" side="top">
                  {config.links.feeds.map(({ url, title }) => (
                    <DropdownMenuItem key={url} asChild>
                      <NavLink href={url} target="_blank" rel="nofollow noreferrer">
                        RSS &raquo; {title}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip tooltip="Contact">
                <NavLink
                  href="mailto:hello@trycomp.ai"
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label="Contact us"
                >
                  <AtSignIcon className="size-[1.44em]" />
                </NavLink>
              </Tooltip>

              <Tooltip tooltip="Follow us on X/Twitter">
                <NavLink href={config.links.twitter} target="_blank" rel="nofollow noreferrer">
                  <BrandXIcon className="size-[1.44em]" />
                </NavLink>
              </Tooltip>

              <Tooltip tooltip="Follow us on LinkedIn">
                <NavLink href={config.links.linkedin} target="_blank" rel="nofollow noreferrer">
                  <BrandLinkedInIcon className="size-[1.44em]" />
                </NavLink>
              </Tooltip>

            </TooltipProvider>
          </Stack>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3 md:col-start-8">
          <H6 as="strong">Find:</H6>

          <NavLink href="/alternatives">Alternatives</NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <NavLink href="/self-hosted">Self-hosted</NavLink>
          <NavLink href="/topics">Topics</NavLink>
          <NavLink href="/licenses">Licenses</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavLink href="/submit">Submit a free & open source alternative</NavLink>
        </Stack>
      </div>

      <div className="flex flex-row flex-wrap items-end justify-between gap-x-4 gap-y-2 w-full text-sm text-muted-foreground">
        <p className="flex flex-row items-center gap-x-1">
          Hosted with{" "}
          <span className="text-foreground font-medium">
            <HeartIcon className="size-4" />
          </span>{" "}
          by{" "}
          <ExternalLink
            href={config.links.author}
            className="font-medium text-foreground hover:text-secondary-foreground"
            doFollow
          >
            Comp AI
          </ExternalLink>
        </p>
      </div>

      {children}
    </footer>
  )
}
