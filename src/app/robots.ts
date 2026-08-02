import type { MetadataRoute } from "next";

import { SITE_URL } from "@/app/layout";

/**
 * /robots.txt was a 404, which leaves crawlers to guess — and to crawl the
 * admin panel and auth endpoints they have no business indexing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing here is secret — the admin is behind auth — but keeping it out
      // of the index avoids a login page ranking for the venue's own name.
      disallow: ["/admin", "/api/", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
