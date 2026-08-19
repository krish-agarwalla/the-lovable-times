// lib/site-config.ts

/**
 * Central SEO/site configuration.
 *
 * IMPORTANT: The domain is not purchased yet. Until then, this falls
 * back to the current Vercel deployment URL so sitemap/robots/metadata
 * don't break. Once you buy the domain:
 *
 *   1. Add an environment variable in Vercel:
 *        NEXT_PUBLIC_SITE_URL = https://thelovabletimes.in
 *   2. Redeploy.
 *
 * That's the ONLY change needed — every file below reads from here.
 */
export const siteConfig = {
  name: "Lovable Times",
  legalName: "Lovable Times Photography",
  owner: "Sangram AJ",

  title:
    "Luxury Wedding Photographer & Cinematic Filmmaker in India | Lovable Times",
  titleTemplate: "%s | Lovable Times",

  description:
    "Lovable Times is a luxury wedding photography and cinematic filmmaking studio based in Rairangpur, Odisha, crafting timeless, story-driven wedding films and photographs for couples across India since 2017.",

  tagline: "Based on a True Story. #lovabletimes",

  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://the-lovable-times-rust.vercel.app", // TODO: replace via NEXT_PUBLIC_SITE_URL once domain is live

  ogImage: "/og-image.jpg", // TODO: add a real 1200x630 branded image at public/og-image.jpg

  location: {
    city: "Rairangpur",
    district: "Mayurbhanj",
    region: "Odisha",
    country: "IN",
    countryName: "India",
  },

  serviceArea: "Pan India",
  foundedYear: 2017,

  // Topic themes for the homepage's natural-language SEO copy —
  // used for content guidance, never injected verbatim/stuffed.
  services: [
    "Luxury Wedding Photography",
    "Candid Wedding Photography",
    "Cinematic Wedding Films",
    "Wedding Videography",
    "Pre-Wedding Photography & Films",
    "Engagement Photography",
    "Destination Wedding Photography",
  ],
} as const;
