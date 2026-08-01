"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Last-resort boundary, reached only when the root layout itself fails — which
 * is why it renders its own <html>. The wizard's default showed Next's English
 * error screen inside `lang="en"`: wrong language for this site and nothing
 * like its design. Styles are inlined because a root layout that failed may
 * never have loaded the stylesheet.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="sq">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "1.5rem",
          textAlign: "center",
          background: "#f6f2e9",
          color: "#1e2a30",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "2.5rem", lineHeight: 1.1, margin: 0 }}>
            Diçka nuk shkoi siç duhej.
          </h1>
          <p
            style={{
              marginTop: "1rem",
              lineHeight: 1.6,
              color: "#475158",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Na ndjeni. Provoni edhe një herë — ose kthehuni në fillim.
          </p>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                border: 0,
                borderRadius: "9999px",
                padding: "0.85rem 2rem",
                background: "#2c5c6b",
                color: "#f6f2e9",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Provoni përsëri
            </button>
            {/* Deliberately a plain anchor, not next/link: the root layout has
                failed, so a client-side transition would re-enter the broken
                tree instead of escaping it. A full document load is the point. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                borderRadius: "9999px",
                padding: "0.85rem 2rem",
                border: "1px solid #ddd5c4",
                color: "#1e2a30",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Kthehu në fillim
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
