import type { MetadataRoute } from "next";

import { SITE_URL } from "@/app/layout";

/**
 * /sitemap.xml was a 404. Only the five public pages belong here — /admin and
 * /login are disallowed in robots.ts, and listing them would contradict it.
 *
 * Priorities reflect what the business needs found: /reserve is the page that
 * turns a visitor into a booking, so it ranks alongside the homepage.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, priority: 1, changeFrequency: "monthly", lastModified },
    {
      url: `${SITE_URL}/reserve`,
      priority: 0.9,
      changeFrequency: "weekly",
      lastModified,
    },
    {
      url: `${SITE_URL}/venue`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified,
    },
    {
      url: `${SITE_URL}/events`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified,
    },
    {
      url: `${SITE_URL}/gallery`,
      priority: 0.7,
      changeFrequency: "weekly",
      lastModified,
    },
  ];
}
