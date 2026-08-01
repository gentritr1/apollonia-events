"use client";

import { useEffect } from "react";
import Link from "next/link";

import { TempleLine } from "@/components/public/temple-line";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-ivory px-6 text-center text-ink">
      <div className="max-w-md">
        <TempleLine
          variant="ruin"
          animate="draw"
          className="mx-auto h-[72px] w-36 text-gold"
        />
        <h1 className="mt-8 text-balance text-5xl text-ink">
          Diçka nuk shkoi siç duhej.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-pretty leading-relaxed text-ink-soft">
          Na ndjeni. Provoni edhe një herë — ose kthehuni në fillim.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-primary"
          >
            Provoni përsëri
          </button>
          <Link href="/" className="btn btn-quiet">
            Kthehu në fillim
          </Link>
        </div>
      </div>
    </main>
  );
}
