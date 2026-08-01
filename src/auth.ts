import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";

/**
 * A real bcrypt hash of a value nobody can supply, used so a login attempt for
 * an unknown account costs the same time as one for a known account.
 */
const DUMMY_HASH =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(1),
          })
          .safeParse(creds);

        if (!parsed.success) return null;

        // Throttle before touching the database. Both buckets are needed: the
        // email bucket protects one account from a distributed guess, the IP
        // bucket stops one host spraying many accounts.
        const email = parsed.data.email.toLowerCase();
        const ip = await getClientIp();
        const [byEmail, byIp] = await Promise.all([
          consumeRateLimit({
            bucket: `login:email:${email}`,
            limit: 8,
            windowSeconds: 15 * 60,
          }),
          consumeRateLimit({
            bucket: `login:ip:${ip}`,
            limit: 20,
            windowSeconds: 15 * 60,
          }),
        ]);

        if (!byEmail.ok || !byIp.ok) {
          console.warn(`Login throttled for ${ip}`);
          return null;
        }

        const user = await db.user.findUnique({ where: { email } });

        // Always spend a bcrypt comparison, even when the account does not
        // exist. Returning early on a miss makes unknown emails answer
        // measurably faster than known ones, which is an enumeration oracle.
        const hash = user?.passwordHash ?? DUMMY_HASH;
        const ok = await bcrypt.compare(parsed.data.password, hash);

        if (!user || !ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
