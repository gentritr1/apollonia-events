import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { publicMetadata } from "@/lib/content";

import "./globals.css";

// Elegant serif for display headings.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Quiet humanist sans for body and UI.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://apollonia.events",
  ),
  title: publicMetadata.root.title,
  description: publicMetadata.root.description,
};

const toneScript = `
(() => {
  try {
    const hour = new Date().getHours();
    document.documentElement.dataset.tone =
      hour >= 19 || hour < 6 ? "dusk" : "day";
    document.documentElement.dataset.daypart =
      hour >= 6 && hour < 10
        ? "dawn"
        : hour >= 10 && hour < 17
          ? "day"
          : hour >= 17 && hour < 20
            ? "golden"
            : "night";
  } catch {
    document.documentElement.dataset.tone = "day";
    document.documentElement.dataset.daypart = "day";
  }
})();
`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apollonia.events";

const organizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": ["EventVenue", "LocalBusiness"],
  name: "Apollonia Events",
  url: siteUrl,
  description: publicMetadata.root.description,
  image: `${siteUrl}/opengraph-image`,
  telephone: "+38344376237",
  sameAs: ["https://www.instagram.com/apollonia.events"],
  maximumAttendeeCapacity: 60,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rr. Demush Shabani",
    addressLocality: "Gjilan",
    postalCode: "60000",
    addressCountry: "XK",
  },
}).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: toneScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        {children}
      </body>
    </html>
  );
}
