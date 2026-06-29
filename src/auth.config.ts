import type { DefaultSession, NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

function isUserRole(value: unknown): value is UserRole {
  return value === "ADMIN" || value === "STAFF";
}

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user && isUserRole(token.role)) {
        session.user.role = token.role;
      }

      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = auth?.user?.role === "ADMIN";

      if (nextUrl.pathname.startsWith("/admin")) {
        return isAdmin;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
