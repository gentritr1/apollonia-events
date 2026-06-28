"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { navLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-marble-deep/40 bg-ivory/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="Apollonia Events — home">
          <Logo className="text-2xl" />
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide transition-colors",
                isActive(link.href)
                  ? "text-aegean"
                  : "text-ink-soft hover:text-aegean"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reserve"
            className="rounded-full bg-aegean px-6 py-2.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-aegean-deep"
          >
            Reserve
          </Link>
        </nav>

        {/* mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="text-ink md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="border-marble-deep/40 bg-ivory">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex flex-col gap-1 px-6 pt-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b border-marble-deep/30 py-4 font-serif text-2xl transition-colors",
                    isActive(link.href) ? "text-aegean" : "text-ink"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/reserve"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-aegean px-6 py-3 text-center text-sm font-medium tracking-wide text-ivory"
              >
                Reserve a date
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
