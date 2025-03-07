import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { SelfHostedCategories } from "~/app/(web)/self-hosted/categories"
import { SelfHostedToolListing } from "~/app/(web)/self-hosted/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Self-Hosted Alternatives to Paid Software",
  description:
    "Below is a list of free & open source projects, services and web applications that can be hosted on your own infrastructure.",
  openGraph: { ...metadataConfig.openGraph, url: "/self-hosted" },
  alternates: { ...metadataConfig.alternates, canonical: "/self-hosted" },
}

export default async function SelfHostedPage(props: PageProps) {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/self-hosted",
            name: "Self-Hosted Tools",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <SelfHostedToolListing searchParams={props.searchParams} />
      </Suspense>

      <Suspense>
        <SelfHostedCategories />
      </Suspense>
    </>
  )
}
