"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { MeanderRule } from "@/components/public/meander-rule";
import { navCopy } from "@/lib/content";
import { navLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 80);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const mobileMenu = (
    <div className="mobile-menu-panel fixed inset-0 isolate z-[100] flex min-h-[100dvh] flex-col bg-ivory px-6 py-5 md:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label={navCopy.homeAriaLabel}>
          <Logo className="text-2xl" />
        </Link>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-marble/70"
          aria-label={navCopy.closeMenu}
          onClick={() => setOpen(false)}
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="mt-16 flex flex-1 flex-col" aria-label={navCopy.mobileNavigationLabel}>
        {navLinks.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "mobile-menu-link border-b border-marble-deep/35 py-5 font-serif text-4xl leading-none transition-colors",
              isActive(link.href) ? "text-aegean" : "text-ink"
            )}
            style={{ "--menu-delay": `${index * 80}ms` } as CSSProperties}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/reserve"
          onClick={() => setOpen(false)}
          className="btn btn-primary mobile-menu-link mt-8 w-full"
          style={{ "--menu-delay": `${navLinks.length * 80}ms` } as CSSProperties}
        >
          {navCopy.reserveDate}
        </Link>
      </nav>

      <MeanderRule units={6} className="mx-auto mb-4 text-gold-soft" />
    </div>
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 bg-ivory/82 backdrop-blur-md transition-[border-color,background-color] duration-300",
          scrolled ? "border-b border-marble-deep/45" : "border-b border-transparent"
        )}
        style={{ viewTransitionName: "site-header" } as CSSProperties}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-6xl items-center justify-between px-6 transition-[height] duration-300",
            scrolled ? "h-16" : "h-20"
          )}
        >
          <Link href="/" aria-label={navCopy.homeAriaLabel}>
            <Logo className="text-2xl" />
          </Link>

          {/* desktop nav */}
          <nav
            className="hidden items-center gap-10 md:flex"
            aria-label={navCopy.desktopNavigationLabel}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative py-2 text-sm tracking-wide transition-colors",
                  isActive(link.href)
                    ? "text-aegean"
                    : "text-ink-soft hover:text-aegean"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-200",
                    isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            ))}
            <Link
              href="/reserve"
              className="btn btn-primary btn-sm"
            >
              {navCopy.reserve}
            </Link>
          </nav>

          {/* mobile nav */}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-marble/70 md:hidden"
            aria-label={navCopy.openMenu}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {open && typeof document !== "undefined"
        ? createPortal(mobileMenu, document.body)
        : null}
    </>
  );
}
