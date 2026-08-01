import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The venue's own emblem: the gold wordmark and Ionic column struck on a dark
 * disc. Below ~64px its lettering stops resolving, so it is always paired with
 * the typographic <Logo /> and carries no alt text — the wordmark beside it
 * already names the brand, and repeating it would only double up for screen
 * readers.
 *
 * Served `unoptimized` from pre-sized files: the mark only ever renders at two
 * fixed sizes, so the image optimizer would spend Vercel quota re-deriving what
 * we can ship correct. `logo-badge-96` covers the 40px header at 2x,
 * `logo-badge-192` the 72px footer.
 */
export function LogoBadge({
  className,
  variant = "header",
  priority = false,
}: {
  className?: string;
  variant?: "header" | "footer";
  priority?: boolean;
}) {
  const px = variant === "header" ? 96 : 192;

  return (
    <Image
      src={`/logo-badge-${px}.png`}
      alt=""
      aria-hidden="true"
      width={px}
      height={px}
      priority={priority}
      unoptimized
      className={cn("select-none rounded-full", className)}
    />
  );
}
