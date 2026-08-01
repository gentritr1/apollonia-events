import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { LogoBadge } from "@/components/brand/logo-badge";
import { MeanderRule } from "@/components/public/meander-rule";
import { WaveRule } from "@/components/public/wave-rule";
import { brandName, contactCopy, footerCopy, navCopy } from "@/lib/content";
import { navLinks } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-marble-deep/40 bg-marble/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-2">
            <LogoBadge variant="footer" className="mb-6 size-18" />
            <Logo className="text-2xl" />
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-ink-soft">
              {footerCopy.description}
            </p>
            <div className="mt-7">
              <p className="font-serif text-3xl italic leading-none text-aegean-deep">
                φιλοξενία
              </p>
              <p className="mt-2 max-w-sm font-serif text-sm italic leading-relaxed text-ink-soft">
                {footerCopy.philoxenia}
              </p>
            </div>
            <div className="mt-7 flex flex-col items-start gap-3">
              <MeanderRule units={5} className="opacity-70" />
              <WaveRule repeats={5} className="text-gold-soft/80" />
            </div>
          </div>

          {/* explore */}
          <div>
            <p className="overline mb-5">{footerCopy.explore}</p>
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
                  {navCopy.reserveDate}
                </Link>
              </li>
            </ul>
          </div>

          {/* visit */}
          <div>
            <p className="overline mb-5">{footerCopy.visit}</p>
            <address className="space-y-3 text-sm not-italic text-ink-soft">
              <p>
                {footerCopy.byAppointment}
                <br />
                {footerCopy.street}
                <br />
                {footerCopy.cityLine}
              </p>
              <p className="space-y-1">
                {footerCopy.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="block transition-colors hover:text-aegean"
                  >
                    {phone.label}
                  </a>
                ))}
              </p>
              <p>
                <a
                  href={contactCopy.whatsappHref}
                  className="link-arrow text-aegean transition-colors hover:text-aegean-deep"
                  target="_blank"
                  rel="noreferrer"
                >
                  {contactCopy.whatsappLabel}
                </a>
              </p>
              <p>
                <a
                  href={footerCopy.instagramHref}
                  className="link-arrow text-aegean transition-colors hover:text-aegean-deep"
                  target="_blank"
                  rel="noreferrer"
                >
                  {footerCopy.instagramLabel}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="hairline mt-14 mb-6" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs tracking-wide text-ink-soft sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {brandName}. {footerCopy.rights}
          </p>
          <p className="footer-dusk-line">{footerCopy.duskLine}</p>
          <p>{footerCopy.reservationOnly}</p>
        </div>
      </div>
    </footer>
  );
}
