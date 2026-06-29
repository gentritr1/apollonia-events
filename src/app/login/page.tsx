import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";

async function authenticate(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      redirect("/login?error=invalid");
    }

    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const showError = error === "invalid";

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-6 py-16">
      <section className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Logo className="justify-center text-3xl" />
          <h1 className="mt-10 font-serif text-4xl text-ink">Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            Access the Apollonia reservations desk.
          </p>
        </div>

        {showError ? (
          <p
            className="mb-4 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            Invalid email or password.
          </p>
        ) : null}

        <form
          action={authenticate}
          className="rounded-lg border border-marble-deep bg-[#fbf9f3] p-5 shadow-sm"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full">
            Sign in
          </Button>
        </form>
      </section>
    </main>
  );
}
