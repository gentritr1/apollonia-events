import Link from "next/link";
import { MeanderRule } from "@/components/public/meander-rule";

export default function Home() {
  return (
    <main className="marble-wash flex min-h-screen flex-col">
      {/* slim brand bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7">
        <span className="font-serif text-xl tracking-wide text-ink">
          Apollonia
        </span>
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
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="overline mb-6">Private Events · Est. by the Aegean</p>

        <MeanderRule units={5} className="mb-10 opacity-80" />

        <h1 className="text-balance text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
          Where gatherings become
          <span className="text-aegean"> occasions</span>.
        </h1>

        <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
          A calm, handcrafted setting for weddings, private dinners, and
          celebrations — reserved by the day, attended to by hand.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
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
