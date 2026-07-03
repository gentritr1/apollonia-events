# Apollonia Events — UI Upgrade Brief, Phase 2

Scope: (1) Albanian localization of the public site, (2) a Greek engraved-line
loading/empty-state family, (3) button-height consistency, (4) three micro-animations.

**This is a refinement pass, not a redesign.** Phase 1 (see `DESIGN-UPGRADE-BRIEF.md`
and `DESIGN.md`) is done and approved. Everything below builds on utilities that
already exist in `src/app/globals.css` (`.reveal`, `.reveal-stagger`, `.gold-foil-bg`,
`.link-arrow`, `--apollonia-grain`, the meander/wave `stroke-dashoffset` draw pattern).

## Frozen — do not touch

- Color tokens, fonts, type scale, spacing, and the layout/structure of every page.
- Existing sections (hero, timeline, epigraphs, gallery wall, invitation preview) —
  their design stays exactly as is; only their *strings* change (see §2).
- No new dependencies. No new colors. No new ornament styles beyond §3's one glyph.
- The anti-cliché contract in `DESIGN.md` still applies: line-drawing only, never
  filled illustrations, never mythological figures, never texture backgrounds.
- Admin (`/admin`, `/login`) is out of scope entirely — stays English, stays plain.
- Motion rules: ≤1.2s, `ease-out`, opacity/transform/stroke only, all inside
  `@media (prefers-reduced-motion: no-preference)`.

---

## 1. Button system — one recipe, two sizes (do this first, it's mechanical)

Today there are three competing pill heights: page CTAs `py-3.5` (~49px), header
Reserve `py-2.5` (~41px), form buttons `h-11` (44px). Replace all padding-based
sizing with fixed heights.

Add to `globals.css` (as plain classes next to `.overline` etc.):

- `.btn` — base: `inline-flex items-center justify-center gap-2 rounded-full
  text-sm font-medium tracking-wide transition-colors disabled:opacity-60`,
  height **3rem (h-12)**, padding-inline **2rem (px-8)**.
- `.btn-sm` — modifier: height **2.75rem (h-11)**, padding-inline **1.5rem (px-6)**.
- `.btn-primary` — `bg-aegean text-ivory hover:bg-aegean-deep`.
- `.btn-quiet` — `border border-marble-deep text-ink hover:border-gold hover:text-aegean`.
- `.btn-gold` — composes with the existing `.gold-foil-bg`, text `aegean-deep`.

Exact replacement map (no other class changes on these elements):

| Location | Recipe |
|---|---|
| Hero "Reserve a date" — `src/app/(public)/page.tsx` | `.btn .btn-primary` |
| Hero "Explore the venue" (keeps `link-arrow`) | `.btn .btn-quiet` |
| Dark CTA band button — `page.tsx` | `.btn .btn-gold` |
| Section CTAs — `venue/page.tsx`, `events/page.tsx`, `gallery/page.tsx` | `.btn .btn-primary` |
| Header Reserve — `site-header.tsx` | `.btn .btn-sm .btn-primary` |
| Mobile menu Reserve — `site-header.tsx` | `.btn .btn-primary` (full width via `w-full`) |
| Form Continue / Submit — `reservation-form.tsx` | `.btn .btn-sm .btn-primary` |
| Form Back | `.btn .btn-sm .btn-quiet` |

Form fields stay `h-11`, so `.btn-sm` aligns with them. Definition of done: grep
for `rounded-full` in `src/app/(public)` + `src/components/{site,public}` finds no
`py-2.5`/`py-3.5` sizing left on buttons.

---

## 2. Albanian localization (public site only)

The site's audience is Albanian. Public site becomes Albanian-only — no i18n
framework, no locale switcher, no routing changes.

### Mechanics

1. **Centralize strings.** All public-site copy moves into `src/lib/content.ts`
   (it already holds `eventTypes`, `venueFeatures`, `galleryItems` — extend the
   same pattern with typed objects per page: `homeCopy`, `venueCopy`, `reserveCopy`,
   `navCopy`, `footerCopy`, etc.). Components/pages import from there; no literal
   UI strings left in JSX. This is the whole "framework."
2. `<html lang="sq">` in `src/app/layout.tsx` — but since admin stays English,
   set `lang="sq"` via the public route group layout's pages metadata is not
   possible for `<html>`; acceptable: set `lang="sq"` globally (admin being
   English-labelled inside is fine).
3. **Dates:** `import { sq } from "date-fns/locale"` — use it in
   `format(..., { locale: sq })` everywhere a date renders (reservation form
   trigger label, invitation preview, success card) and pass `locale={sq}` to the
   `Calendar` / react-day-picker instance. Dates must read
   "e shtunë, 14 shtator 2026", not English.
4. **Validation:** all messages in `src/lib/validations/reservation.ts` → Albanian,
   plus the `timeSlots` labels. Server error strings in `src/server/reservations.ts` too.
5. **Emails:** guest-facing templates in `src/lib/email/templates.ts` → Albanian
   (subject + body). Internal/admin notification emails may stay English.
6. **Metadata:** every public page's `title`/`description` → Albanian.
   Keep `title` brand suffix: "… — Apollonia Events".

### Tone & translation direction

Formal **ju** throughout, elegant and spare — the Albanian of a fine invitation,
not marketing-speak. Do not translate word-for-word; keep sentences shorter than
the English where Albanian would get heavy. Starter glossary (use these; polish
around them):

| English (current) | Albanian |
|---|---|
| Reserve / Reserve a date | Rezervo / Rezervoni një datë |
| Explore the venue | Zbuloni vendin |
| The Venue / Events / Gallery (nav) | Vendi / Eventet / Galeria |
| Where gatherings become occasions. | Ku çdo mbledhje bëhet ngjarje. |
| Private Events · Est. by the Aegean | Evente private · Buzë Adriatikut |
| Weddings | Dasma |
| Private Dinners | Darka private |
| Celebrations | Festime |
| Corporate & Cultural | Evente korporative & kulturore |
| Hold your date | Rezervoni ditën tuaj |
| Date / Time / Occasion / Guests | Data / Ora / Rasti / Të ftuar |
| Full name / Phone / Email / Notes | Emri i plotë / Telefoni / Email / Shënime |
| Continue / Back | Vazhdo / Kthehu |
| Send reservation request | Dërgo kërkesën e rezervimit |
| Sending… | Duke dërguar… |
| Crossed dates are reserved | Datat e shënuara janë të rezervuara |
| A request, not a booking. We will confirm your date personally. | Një kërkesë, jo një rezervim i mbyllur. Datën do ta konfirmojmë personalisht. |
| Thank You / We will answer with care | Faleminderit / Do t'ju përgjigjemi me kujdes |
| By reservation only | Vetëm me rezervim |

### The brand story upgrade (small copy change, big meaning)

Apollonia is also **Apolonia e lashtë** — the ancient city near Fier, Albania.
Use this once, in the footer brand block, replacing/joining the φιλοξενία line:

> **φιλοξενία** — *mikpritje: nderi i lashtë ndaj mikut, nga Apolonia e dikurshme
> deri në ditën tuaj.*

(Keep the Greek word styled as-is; caption in Cormorant italic, one line, small.)
This roots the Greek-antiquity theme in Albanian soil — the theme stops being
"borrowed Greek" and becomes local heritage. Optionally one sentence in the venue
intro may echo it ("emri vjen nga Apolonia e lashtë…"). Nowhere else.

---

## 3. The engraved-line family — "ruins that draw themselves"

One new SVG glyph family, extending the existing stroke-draw language (same
technique as the meander). Think **archaeological survey drawing**, not clip art:
a temple front elevation reduced to ~12 thin strokes (stylobate, four column
shafts as single lines, entablature, pediment triangle). Gold (`currentColor`),
`strokeWidth 1.2`, `strokeLinecap="square"`, no fills ever.

Build `<TempleLine>` in `src/components/public/temple-line.tsx` with two variants:

- `variant="whole"` — the full elevation.
- `variant="ruin"` — same drawing with the pediment's right half and one column
  omitted, and those missing strokes lying as two short lines at the base.

And one animation mode: `animate="draw"` — strokes trace in sequentially
(stroke-dashoffset, ~1.2s total, staggered per path). For loading states, the
draw loops: trace in → hold → fade → repeat.

**Exactly four placements** (this is the kitsch guardrail — it appears only when
the user waits or something is absent, never as decoration):

1. **Form submit pending:** in the reservation form footer while `isSubmitting`,
   a ~40px `whole` glyph looping the draw next to "Duke dërguar…".
2. **Lightbox image loading:** centered ~48px looping glyph on the ivory scrim
   until the image paints.
3. **Route loading:** `src/app/(public)/loading.tsx` — centered glyph (~56px)
   looping over ivory, nothing else.
4. **404:** `src/app/not-found.tsx` — the `ruin` variant (~72px, drawn once, not
   looping), headline "Kjo faqe është rrënojë." with a one-line sub
   ("Ajo që kërkoni nuk gjendet më këtu.") and a `.btn .btn-primary` link home
   ("Kthehu në fillim"). This is the one witty moment on the site — keep it dry.

Hard limits: max height 72px, never on marble-wash textures, never behind text,
never more than one glyph on screen.

---

## 4. Micro-animations (exactly these three, nothing else)

1. **Logo fluting shimmer:** on `Logo` hover, the three fluting lines inside the
   column glyph draw in top-to-bottom (200ms, staggered 40ms). Group them and
   reuse the stroke-draw utility; no movement of the glyph itself.
2. **Hero arch parallax:** the `aegean-arch` inner gradient layers translateY
   ±8px max, tied to scroll (CSS `animation-timeline: scroll()` if the installed
   Next/browser targets support it cleanly — check `node_modules/next/dist/docs/`
   and fall back to a tiny rAF listener; do not add a library).
3. **Timeline line draw:** the day-timeline's connecting gold line draws
   left-to-right when the section enters the viewport (same IntersectionObserver
   + stroke/scaleX pattern as the meander); dots fade in after their segment
   passes them.

---

## Verification checklist (run all)

- `./node_modules/.bin/eslint .` · `./node_modules/.bin/tsc --noEmit` ·
  `./node_modules/.bin/next build` (direct binaries — pnpm v11 rejects this lockfile).
- Smoke: `/`, `/venue`, `/events`, `/gallery`, `/reserve`, plus a bogus URL for
  the 404 — all render, all Albanian, no stray English strings
  (`grep -rn "Reserve\|Guests\|Choose a" src/app/\(public\) src/components/public src/components/site` should return nothing).
- Reservation flow end-to-end: step Α΄ → Β΄ → submit → success card, dates render
  with the `sq` locale, reserved dates still disabled.
- Buttons: every pill measures 48px (or 44px for `.btn-sm`) via devtools.
- Mobile (375px): menu, reserve, gallery — no horizontal overflow.
- `prefers-reduced-motion: reduce`: no glyph loops, no parallax, no draws.
