import { headers } from "next/headers";

import { db } from "@/lib/db";

export type RateLimitResult =
  { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * Best-effort client address. Vercel sets x-forwarded-for; the first entry is
 * the client, the rest are proxies. Falls back to a constant so a missing
 * header degrades to a shared bucket rather than handing every request its own
 * unlimited quota.
 */
export async function getClientIp() {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");

  return (
    forwarded?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/**
 * Sliding-window limiter backed by Postgres.
 *
 * Postgres rather than memory because serverless instances share none: a
 * per-process counter is defeated by concurrent requests landing on different
 * instances, which is exactly the traffic shape an abuser produces.
 *
 * Fails OPEN. If the database is unreachable — and Neon's free tier scales to
 * zero, so that happens — a closed failure would turn a brief outage into
 * "nobody can book and the owner cannot log in". Losing rate limiting for the
 * length of an outage is the cheaper failure.
 */
export async function consumeRateLimit({
  bucket,
  limit,
  windowSeconds,
}: {
  bucket: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000;
  const since = new Date(Date.now() - windowMs);

  try {
    const hits = await db.rateLimitHit.findMany({
      where: { bucket, createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    if (hits.length >= limit) {
      // The window frees up when the oldest hit inside it expires.
      const oldest = hits[0]!.createdAt.getTime();
      return {
        ok: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((oldest + windowMs - Date.now()) / 1000),
        ),
      };
    }

    await db.rateLimitHit.create({ data: { bucket } });

    return { ok: true };
  } catch (error) {
    console.error("Rate limit check failed (allowing request):", error);
    return { ok: true };
  }
}

/** Deletes spent rows. Called from the daily cron so no request pays for it. */
export async function pruneRateLimitHits(olderThanHours = 48) {
  try {
    const { count } = await db.rateLimitHit.deleteMany({
      where: {
        createdAt: { lt: new Date(Date.now() - olderThanHours * 3600 * 1000) },
      },
    });

    return count;
  } catch (error) {
    console.error("Failed to prune rate limit hits:", error);
    return 0;
  }
}
