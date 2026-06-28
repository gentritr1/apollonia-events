import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { MeanderRule } from "@/components/public/meander-rule";
import { navLinks } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-marble-deep/40 bg-marble/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-2">
            <Logo className="text-2xl" />
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-ink-soft">
              A calm, handcrafted setting for life&rsquo;s finest occasions —
              reserved by the day, attended to by hand.
            </p>
            <MeanderRule units={5} className="mt-6 opacity-70" />
          </div>

          {/* explore */}
          <div>
            <p className="overline mb-5">Explore</p>
            <ul className="space-y-3 text-sm text-ink-soft">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-aegean"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/reserve"
                  className="transition-colors hover:text-aegean"
                >
                  Reserve a date
                </Link>
              </li>
            </ul>
          </div>

          {/* visit */}
          <div>
            <p className="overline mb-5">Visit</p>
            <address className="space-y-3 text-sm not-italic text-ink-soft">
              <p>
                By appointment
                <br />
                Aegean Coast
              </p>
              <p>
                <a
                  href="mailto:hello@apollonia.events"
                  className="transition-colors hover:text-aegean"
                >
                  hello@apollonia.events
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="hairline mt-14 mb-6" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs tracking-wide text-ink-soft sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Apollonia Events. All rights
            reserved.
          </p>
          <p>By reservation only · A curated calendar of private occasions</p>
        </div>
      </div>
    </footer>
  );
}
