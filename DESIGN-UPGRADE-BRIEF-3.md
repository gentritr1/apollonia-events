# Apollonia Events — UI Upgrade Brief, Phase 3

Theme: **story, trust, and two rare "special" touches.** Phases 1–2 made the site
premium and Albanian; phase 3 makes it *convert* and gives it two features almost
no venue site has. All copy in this phase is Albanian (formal **ju**, same tone
as phase 2). Admin stays English and out of scope.

**Refinement pass, not a redesign.** Same frozen list as `DESIGN-UPGRADE-BRIEF-2.md`:
tokens, fonts, layouts, existing sections, no new dependencies, motion ≤1.2s
ease-out behind `prefers-reduced-motion`. Reuse existing utilities (`.reveal`,
`.btn`, meander draw, grain). Per `AGENTS.md`, check `node_modules/next/dist/docs/`
before using any Next API (View Transitions, `ImageResponse`, route handlers).

---

## 1. "Datat më të afërta të lira" — free-dates strip (highest conversion value)

The DB already knows confirmed reservations (the reserve calendar uses them).
Surface that knowledge *before* the form:

- A server helper `getUpcomingFreeDates()` in `src/server/reservations.ts`:
  the next 3 free **Saturdays** (skip dates with a confirmed reservation).
- **Homepage:** a slim band directly under the hero — overline
  "Disponueshmëria" + one line: "Të shtunat më të afërta të lira —
  **14 shtator · 28 shtator · 5 tetor**", each date a link to
  `/reserve?date=YYYY-MM-DD`. Dates in serif, gold interpuncts, hairline above
  and below. No card, no box — typographic.
- **Reserve page:** the same three dates as small `.btn-sm .btn-quiet` chips above
  the form ("Zgjidhni një të shtunë të lirë"); clicking pre-fills the date field
  (the form reads the `date` search param on mount and sets it if valid/free).
- Cache with a short revalidate (e.g. 1 hour) so it doesn't hit the DB per view.

Why it matters: telling guests when you're free before they ask is the single
most premium gesture a booking flow can make.

## 2. Heritage band — "Nga Apolonia e lashtë" (the one earned decorative moment)

On **/venue**, between the page header and the spaces list: a full-width quiet
band telling the name's story in three short beats.

- Left (or top on mobile): an **engraved-line drawing of the Adriatic coast**
  (one SVG, same language as `TempleLine`: 1.2px gold strokes, no fills) — the
  coastline from Vlorë up past Fier, with a small meander-dot marking Apolonia.
  The coastline **draws itself on scroll** (existing stroke-draw pattern), the
  dot fades in last.
- Right: three beats, each overline + one sentence (serif), staggered reveal:
  1. "Emri" — Apolonia, qyteti antik pranë Fierit, port i dijes dhe i mikpritjes.
  2. "Trashëgimia" — Mikpritja si nder i lashtë — φιλοξενία — e mbartur brez pas brezi.
  3. "Sot" — Një shtëpi e vetme, një ngjarje e vetme, kujdesi i dikurshëm.
  (Polish the Albanian; keep each under ~14 words.)
- This is a *story section*, not decoration wallpaper: it appears once, only on
  /venue. Do not reuse the coastline SVG anywhere else.

## 3. Dusk mode — the site lives with the light (flagship "special" feature)

After sunset (local time), the public site shifts — subtly — toward evening:

- An inline `<script>` in the root layout (before hydration, no flash) sets
  `data-tone="dusk"` on `<html>` when the local hour is ≥ 19 or < 6; otherwise
  `data-tone="day"`. No geolocation, no API — plain client clock.
- In `globals.css`, one override block under `html[data-tone="dusk"]`:
  `--background` shifts to a slightly deeper warm ivory (≈ `#f1ece0`),
  `.marble-wash` and the hero arch gradients lean a touch more `aegean-deep`,
  gold accents warm toward `gold-soft`. **Total effect must be whisper-subtle —
  if a side-by-side screenshot looks "different themed", it's too much.**
  This is not dark mode; text/ink tokens do not change, contrast is unaffected.
- The dark CTA band gains, at dusk only, a scatter of 5–7 tiny gold dots
  (staggered slow fade-in, opacity ≤ 0.5) — first stars. Nothing twinkles.
- One discoverable detail, footer bottom line at dusk only:
  "Apollonia nën yje — deri në orën e fundit."

## 4. Trust & contact — how Albanian guests actually reach venues

- **WhatsApp:** a quiet text link (not a green bubble, no floating widget) in
  (a) the footer "Vizitoni" block and (b) the reservation success card:
  "Shkruani në WhatsApp →" using the existing `.link-arrow` style, `wa.me`
  URL with a pre-filled Albanian greeting. Phone number comes from one constant
  in `src/lib/content.ts` (placeholder until the real number exists).
- **FAQ on /reserve**, below the form: "Pyetje të shpeshta" — 5 questions as a
  hairline accordion (native `<details>`, serif `<summary>`, no icons beyond a
  rotating chevron): capacity (deri në 120 të ftuar), exclusivity (vetëm një
  ngjarje në ditë), kitchen (kuzhina jonë, menu sezonale), weather plan (salla e
  brendshme), how confirmation works (kërkesë → konfirmim personal). Real
  answers, two sentences max each.

## 5. Share cards — premium where links travel (WhatsApp/Instagram)

When the site is shared, the preview must look bespoke, not like a screenshot:

- `opengraph-image.tsx` via Next's `ImageResponse` (built-in — verify current
  API in the local Next docs): ivory background, centered wordmark
  ("apollonia" + column glyph simplified as pure shapes — ImageResponse can't
  render the SVG component; rebuild it as boxes/polygons), a 5-unit meander
  rule, and the page title in Cormorant (load the font in the handler).
- One default card at the root + per-page titles for /venue, /events, /gallery,
  /reserve (Albanian). Test with `curl -I` and by viewing the generated PNG.

## 6. Smoothness pack (small, exactly these)

1. **Gallery → lightbox morph:** the clicked tile's image morphs into the
   lightbox via the View Transitions API (already used for page fades — same
   feature, element-level `view-transition-name` on the active tile). Fallback:
   current behavior.
2. **Blur-up images:** Cloudinary tiles get a tiny blurred placeholder
   (`e_blur:2000,q_1,w_32` variant as background) so images arrive as a focus
   pull, not a pop-in.
3. **Reserve deep-link polish:** `/reserve?date=…` (from §1) scrolls the form
   into view with `scroll-margin-top` matching the sticky header.

## Explicitly NOT in this phase

- No entrance/splash animation, no custom cursors, no sound, no chat widgets,
  no Instagram API embeds, no map embeds (a static engraved map may come with
  real address/photos later).
- No new ornament families. The coastline drawing (§2) is a one-off artifact.
- Real photography remains the biggest remaining lever — when photos exist,
  they drop into the phase-1 Cloudinary treatment; nothing here blocks that.

## Verification checklist

- `./node_modules/.bin/eslint .` · `./node_modules/.bin/tsc --noEmit` ·
  `./node_modules/.bin/next build` (direct binaries; pnpm v11 lockfile issue).
- Free dates: seed/verify a confirmed reservation on an upcoming Saturday and
  confirm that date is skipped on the strip and pre-fill rejects it.
- Dusk: temporarily force `data-tone="dusk"` and screenshot-diff against day —
  the shift must be visible side-by-side and invisible in isolation.
- OG: `curl -sI localhost:3000/opengraph-image` returns an image content-type;
  visually check the PNG once.
- Smoke all public routes + 404 in Albanian; `prefers-reduced-motion` shows no
  coastline draw, no star fade, no morphs; mobile 375px: strip, FAQ, chips —
  no horizontal overflow.
