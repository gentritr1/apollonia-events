import Link from "next/link";
import { MeanderRule } from "@/components/public/meander-rule";
import { Logo } from "@/components/brand/logo";

export default function Home() {
  return (
    <main className="marble-wash flex min-h-screen flex-col">
      {/* slim brand bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7">
        <Logo className="text-2xl" />
        <nav className="hidden gap-10 text-sm text-ink-soft sm:flex">
          <span className="cursor-default transition-colors hover:text-aegean">
            The Venue
          </span>
          <span className="cursor-default transition-colors hover:text-aegean">
            Events
          </span>
          <span className="cursor-default transition-colors hover:text-aegean">
            Gallery
          </span>
        </nav>
      </header>

      {/* hero */}
      <section className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-x-16 gap-y-16 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        {/* left — content */}
        <div className="max-w-xl text-center lg:text-left">
          <p className="overline mb-6">Private Events · Est. by the Aegean</p>

          <MeanderRule
            units={5}
            className="mx-auto mb-9 opacity-80 lg:mx-0"
          />

          <h1 className="text-balance text-5xl leading-[1.04] text-ink sm:text-6xl lg:text-7xl">
            Where gatherings become
            <span className="text-aegean"> occasions</span>.
          </h1>

          <p className="mx-auto mt-8 max-w-md text-pretty text-lg leading-relaxed text-ink-soft lg:mx-0">
            A calm, handcrafted setting for weddings, private dinners, and
            celebrations — reserved by the day, attended to by hand.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <Link
              href="/reserve"
              className="rounded-full bg-aegean px-8 py-3.5 text-sm font-medium tracking-wide text-ivory shadow-sm transition-all hover:bg-aegean-deep hover:shadow-md"
            >
              Reserve a date
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-marble-deep px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-gold hover:text-aegean"
            >
              Explore the venue
            </Link>
          </div>
        </div>

        {/* right — arched visual panel */}
        <div className="flex justify-center lg:justify-end">
          <figure
            aria-label="Apollonia venue"
            className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[9999px_9999px_1.5rem_1.5rem] bg-gradient-to-b from-marble via-aegean-bright/35 to-aegean-deep shadow-xl ring-1 ring-gold/30"
          >
            {/* marble sheen at the crown of the arch */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,255,255,0.6),transparent_55%)]" />
            {/* soft inner vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_120%,rgba(28,61,71,0.55),transparent_60%)]" />
            {/* fine gold frame, inset like a plate */}
            <div className="absolute inset-3 rounded-[9999px_9999px_1rem_1rem] border border-gold-soft/30" />
            {/* meander detail resting at the base */}
            <MeanderRule
              units={6}
              className="absolute bottom-7 left-1/2 -translate-x-1/2 text-gold-soft"
            />
          </figure>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-8">
        <div className="hairline mb-6" />
        <p className="text-center text-xs tracking-wide text-ink-soft">
          By reservation only · A curated calendar of private occasions
        </p>
      </footer>
    </main>
  );
}
