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
    process.env.NEXT_PUBLIC_SITE_URL || "https://apollonia.events"
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
  } catch {
    document.documentElement.dataset.tone = "day";
  }
})();
`;

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
        {children}
      </body>
    </html>
  );
}
