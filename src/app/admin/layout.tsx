import Link from "next/link";
import {
  CalendarDays,
  Images,
  LayoutDashboard,
  LogOut,
  TableProperties,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    disabled: false,
  },
  {
    href: "/admin/reservations",
    label: "Reservations",
    icon: TableProperties,
    disabled: false,
  },
  {
    href: "/admin/calendar",
    label: "Calendar",
    icon: CalendarDays,
    disabled: false,
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: Images,
    disabled: false,
  },
];

async function signOutAction() {
  "use server";

  await signOut({ redirectTo: "/login" });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-marble/35 text-ink">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-marble-deep bg-ivory md:w-64 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:block md:px-6 md:py-6">
            <Link href="/admin/reservations" aria-label="Apollonia admin home">
              <Logo className="text-2xl" />
            </Link>
            <p className="hidden text-xs text-ink-soft md:mt-2 md:block">
              Reservations desk
            </p>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1 md:px-4 md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const className = cn(
                "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors md:w-full",
                item.disabled
                  ? "cursor-not-allowed text-ink-soft/50"
                  : "text-ink-soft hover:bg-marble hover:text-aegean"
              );

              if (item.disabled) {
                return (
                  <span
                    key={item.href}
                    aria-disabled="true"
                    className={className}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </span>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={className}>
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden px-4 py-6 md:block">
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="outline"
                className="w-full justify-start"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-marble-deep bg-ivory/80 px-5 backdrop-blur md:hidden">
            <span className="text-sm font-medium text-ink-soft">Admin</span>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
