import Link from "next/link";

import { TempleLine } from "@/components/public/temple-line";
import { notFoundCopy } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ivory px-6 text-center text-ink">
      <div className="max-w-md">
        <TempleLine
          variant="ruin"
          animate="draw"
          className="mx-auto h-[72px] w-36 text-gold"
        />
        <h1 className="mt-8 text-balance text-5xl text-ink">
          {notFoundCopy.title}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-pretty leading-relaxed text-ink-soft">
          {notFoundCopy.description}
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          {notFoundCopy.home}
        </Link>
      </div>
    </main>
  );
}
