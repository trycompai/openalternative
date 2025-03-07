import type { Metadata } from "next"
import { SubmitForm } from "~/app/(web)/submit/form"
import { Card } from "~/components/common/card"
import { Link } from "~/components/common/link"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Prose } from "~/components/web/ui/prose"
import { Section } from "~/components/web/ui/section"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Submit Free & Open Source Software",
  description: `Grow our list of free & open source alternatives. Contribute to ${config.site.name} by submitting a new free & open source alternative.`,
  openGraph: { ...metadataConfig.openGraph, url: "/submit" },
  alternates: { ...metadataConfig.alternates, canonical: "/submit" },
}

export default async function SubmitPage() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Section>
        <Section.Content>
          <SubmitForm />
        </Section.Content>

        <Section.Sidebar>
          <Card hover={false}>
            <Prose className="text-sm/normal">
              <p>
                <strong>Note:</strong> Please make sure that the software you're submitting is:
              </p>

              <ul className="[&_li]:p-0 list-inside p-0">
                <li>Free & Open source</li>
                <li>Actively maintained</li>
                <li>Hosted on GitHub</li>
                <li>
                  An <Link href="/alternatives">alternative to popular software</Link>
                </li>
              </ul>
            </Prose>
          </Card>
        </Section.Sidebar>
      </Section>
    </>
  )
}
