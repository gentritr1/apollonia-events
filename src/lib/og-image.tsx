import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_CONTENT_TYPE = "image/png";

async function loadCormorantFont() {
  try {
    const font = await readFile(
      join(process.cwd(), "public/fonts/cormorant-garamond-og.ttf")
    );

    return font.buffer.slice(
      font.byteOffset,
      font.byteOffset + font.byteLength
    ) as ArrayBuffer;
  } catch (error) {
    console.error("Failed to load OG Cormorant font:", error);
    return null;
  }
}

function ColumnGlyph() {
  return (
    <div
      style={{
        position: "relative",
        width: 56,
        height: 74,
        display: "flex",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 13,
          width: 30,
          height: 14,
          border: "3px solid #a8854e",
          borderBottom: "0",
          borderRadius: "18px 18px 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 10,
          width: 36,
          height: 6,
          background: "#a8854e",
          borderRadius: 999,
        }}
      />
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: 28,
            left: 13 + index * 11,
            width: 5,
            height: 32,
            background: "#1c3d47",
            borderRadius: 999,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 7,
          bottom: 6,
          width: 42,
          height: 7,
          background: "#a8854e",
          borderRadius: 999,
        }}
      />
    </div>
  );
}

function MeanderUnit() {
  return (
    <div
      style={{
        position: "relative",
        width: 40,
        height: 18,
        display: "flex",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderTop: "3px solid #a8854e",
          borderLeft: "3px solid #a8854e",
          borderBottom: "3px solid #a8854e",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 7,
          left: 12,
          width: 20,
          borderTop: "3px solid #a8854e",
        }}
      />
    </div>
  );
}

function MeanderRule() {
  return (
    <div style={{ display: "flex", gap: 7 }}>
      {[0, 1, 2, 3, 4].map((unit) => (
        <MeanderUnit key={unit} />
      ))}
    </div>
  );
}

function OgCard({ title }: { title: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 50% 0%, rgba(196,168,114,0.24), transparent 36%), #f6f2e9",
        color: "#1e2a30",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 42,
          border: "1px solid rgba(168,133,78,0.32)",
          display: "flex",
        }}
      />
      <div
        style={{
          width: 880,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <ColumnGlyph />
          <div
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: 92,
              lineHeight: 0.9,
              letterSpacing: -1,
              color: "#1c3d47",
            }}
          >
            apollonia
          </div>
        </div>
        <div
          style={{
            marginTop: 38,
            display: "flex",
          }}
        >
          <MeanderRule />
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 54,
            lineHeight: 1.05,
            color: "#1e2a30",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 18,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#8a6b3c",
          }}
        >
          Një vend · një ngjarje
        </div>
      </div>
    </div>
  );
}

export async function createApolloniaOgImage(title: string) {
  const cormorant = await loadCormorantFont();
  const fonts = cormorant
    ? [
        {
          name: "Cormorant Garamond",
          data: cormorant,
          weight: 500 as const,
          style: "normal" as const,
        },
      ]
    : [];

  try {
    return new ImageResponse(<OgCard title={title} />, {
      ...OG_IMAGE_SIZE,
      fonts,
    });
  } catch (error) {
    console.error("Failed to render OG image with custom font:", error);
    return new ImageResponse(<OgCard title={title} />, OG_IMAGE_SIZE);
  }
}
