import { env } from "~/env"

export const siteConfig = {
  name: "FOSS Alternative",
  tagline: "Free & Open Source Alternatives of Popular Software",
  description:
    "The #1 collection of the best free & open source alternatives of popular software. Find the best hand-picked free & open source software.",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,

  alphabet: "abcdefghijklmnopqrstuvwxyz",

  affiliateUrl: "https://go.trycomp.ai",
}
