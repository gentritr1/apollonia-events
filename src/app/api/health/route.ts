import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness and readiness for uptime monitors.
 *
 * Public response is deliberately thin — status, database reachability and
 * latency — because an unauthenticated endpoint that enumerates which
 * integrations are unconfigured is a map for anyone probing the site. Pass the
 * cron secret (`?token=` or `Authorization: Bearer`) to also get the
 * configuration breakdown, which is what makes this useful for answering "is
 * production actually wired up".
 *
 * Returns 503 when the database is unreachable so a monitor alerts instead of
 * seeing a cheerful 200.
 */
export async function GET(request: Request) {
  const startedAt = Date.now();

  let databaseOk = false;
  let databaseLatencyMs: number | null = null;

  try {
    const t0 = Date.now();
    await db.$queryRaw`SELECT 1`;
    databaseLatencyMs = Date.now() - t0;
    databaseOk = true;
  } catch (error) {
    console.error("Health check: database unreachable:", error);
  }

  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET;
  const presented =
    url.searchParams.get("token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const detailed = Boolean(secret) && presented === secret;

  const body: Record<string, unknown> = {
    status: databaseOk ? "ok" : "degraded",
    database: databaseOk ? "ok" : "unreachable",
    databaseLatencyMs,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? null,
    checkedInMs: Date.now() - startedAt,
  };

  if (detailed) {
    body.config = {
      auth: Boolean(process.env.AUTH_SECRET),
      directUrl: Boolean(process.env.DIRECT_URL),
      cloudinary: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET
      ),
      email: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
      cronSecret: Boolean(process.env.CRON_SECRET),
      adminNotify: Boolean(
        process.env.ADMIN_NOTIFY_EMAIL ?? process.env.ADMIN_EMAIL
      ),
    };
  }

  return Response.json(body, {
    status: databaseOk ? 200 : 503,
    headers: { "cache-control": "no-store" },
  });
}
