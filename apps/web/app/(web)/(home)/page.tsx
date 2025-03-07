import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { CountBadge, CountBadgeSkeleton } from "~/app/(web)/(home)/count-badge"
import { HomeToolListing } from "~/app/(web)/(home)/listing"
import {
  AlternativePreview,
  AlternativePreviewSkeleton,
} from "~/components/web/alternatives/alternative-preview"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default function Home({ searchParams }: PageProps) {
  return (
    <>
      <section className="flex flex-col gap-y-6 w-full mb-[2vh]">
        <Intro alignment="center">
          <IntroTitle className="max-w-[45rem] lg:text-5xl/[1.1]!">
            Discover {config.site.tagline}
          </IntroTitle>

          <IntroDescription className="lg:mt-2">{config.site.description}</IntroDescription>

          <Suspense fallback={<CountBadgeSkeleton />}>
            <CountBadge />
          </Suspense>
        </Intro>
      </section>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <HomeToolListing searchParams={searchParams} />
      </Suspense>

      <Suspense fallback={<AlternativePreviewSkeleton />}>
        <AlternativePreview />
      </Suspense>
    </>
  )
}
