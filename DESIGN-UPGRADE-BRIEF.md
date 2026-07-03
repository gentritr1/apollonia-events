# Apollonia Events — UI Upgrade Brief

A hand-off brief for the next design pass. Read `DESIGN.md` first — the palette,
type, and the anti-cliché contract there are non-negotiable. This brief is about
adding **depth, motion, and story** on top of that restraint, not adding decoration.

Current state: tasteful, calm, coherent — but static and abstract. It reads as a
very good template. What separates "tasteful" from "premium" is texture, motion,
imagery treatment, and one or two moments of storytelling. That is this brief.

---

## Tier 1 — Foundational (do these first, biggest impact)

### 1. A motion language (one system, used everywhere)
The site currently has zero motion beyond hover colors. Add exactly one motion
vocabulary and apply it consistently:

- **Scroll reveal:** sections fade in and rise ~12px, 700ms, `ease-out`, children
  staggered 80ms apart. Use an `IntersectionObserver` + a `.reveal` utility or a
  tiny `<Reveal>` server-friendly wrapper. Once per element, no re-trigger.
- **Meander draws itself:** `<MeanderRule>` is an SVG stroke — animate
  `stroke-dashoffset` so the Greek key traces in over ~1.2s when it enters the
  viewport. This is the signature moment; it makes the ornament feel engraved
  rather than pasted.
- **Hero sequence on load:** overline → meander → headline → copy → buttons,
  staggered 100ms. Nothing bounces. Nothing slides sideways.
- **Page transitions:** Next 16 supports the View Transitions API — a 250ms
  crossfade between public pages. Check `node_modules/next/dist/docs/` for the
  current API before wiring it.
- **Hard rule:** everything behind `@media (prefers-reduced-motion: no-preference)`.

### 2. Texture — the "not a Figma export" layer
- **Grain:** a single reusable SVG `feTurbulence` noise overlay at 2–3% opacity
  on `.marble-wash` sections and the dark CTA band. This alone kills the
  "generic AI UI" flatness. Keep it imperceptible — you feel it, you don't see it.
- **Gold becomes foil:** anywhere gold is a fill (meander, overline rules, CTA
  button), use a subtle linear gradient `gold-soft → gold → gold-soft` instead of
  flat `#a8854e`. On the CTA button, let the gradient position shift slowly on
  hover (background-position transition) — a quiet foil catch-light.
- **Hero figure:** the arch shape is good; the gradient inside is a placeholder
  that reads as one. Rebuild it as "Aegean light at dusk": 3–4 layered radial
  gradients + the grain overlay + a slow (20s+) drift animation on one layer.
  When real photos exist, swap in a Cloudinary image with the same arch mask,
  duotone-graded (`e_grayscale` + tint toward aegean) so photography always
  matches the palette.

### 3. Imagery treatment system (even before real photos)
- Define one Cloudinary transform preset for all public-site images: slight
  desaturation, warm highlight tint, consistent crop gravity. Premium sites are
  premium because every image is graded identically.
- Gallery/venue placeholder tiles: add the grain + a thin inner `gold/20`
  hairline inset (like a mat around a print) + caption in letterspaced small
  caps. Vary aspect ratios per row (see Tier 3, gallery).

---

## Tier 2 — Antiquity by whisper (clever, never cliché)

These are the "creative" moves. Each is typographic or geometric — no gods, no
helmets, no parchment, no extra columns.

### 4. Greek numeral section markers
Public pages number their sections with polytonic numerals beside the overline:
`Α΄ — The Venue`, `Β΄ — Occasions`, `Γ΄ — Gallery`. Small, gold, serif. It
rewards attention without shouting "GREECE."

### 5. Epigraph testimonials
Add a testimonials section styled like a carved inscription — achieved with
typography only: centered, Cormorant, generous letterspacing, small caps,
`marble-deep` colored text on ivory (low contrast, like relief carving), a
hairline above and below, attribution in tiny gold overline style. One quote at
a time, slow crossfade rotation. No stone texture, no images.

### 6. One word of Greek, used once
In the footer brand block: **φιλοξενία** set in Cormorant italic, with
"philoxenia — the ancient duty of generosity to guests" as a one-line caption.
That's the entire brand story in one artifact. Do not repeat Greek text
anywhere else.

### 7. "The day at Apollonia" timeline (homepage, between venue and occasions)
A horizontal band telling one day's arc: `11:00 Preparations · 17:00 Ceremony ·
20:00 Dinner under the olives · 00:00 Last dance`. Times in serif italic, a thin
gold line connecting dots, and the band's background shifts ivory → gold-tinged
→ aegean-deep left to right (morning → dusk). Storytelling is the most premium
feature a venue site can have, and nobody has this.

### 8. A second ornament: the wave (kymation)
The meander is currently the only motif, so it's forced to do everything. Add a
`<WaveRule>` sibling — a thin ionic wave scroll SVG, same construction — and use
it **only** in the footer and the reservation success state. Two motifs, each
with a fixed home, is a system; one motif everywhere is a stamp.

### 9. Nav active state
Replace the plain color change with a 3-unit meander underline (or a simple
hairline that draws in 200ms) under the active link. Shrink the header from
`h-20` to `h-16` after 80px of scroll, with the bottom hairline only appearing
once scrolled.

---

## Tier 3 — UX that sells the reservation

### 10. Reserve flow → "the invitation"
The form works but feels administrative. Make the reservation feel like
commissioning an invitation:
- Two steps: **the day** (date, time, occasion, guests) → **your details**
  (name, phone, email, notes), with a hairline progress indicator (`Α΄ · Β΄`).
- Beside/above the form, a live summary card styled like a letterpress invite —
  arch-topped, serif, the chosen date rendered as "Saturday, the 14th of
  September" as the user picks it. It fills in as they type.
- **Availability in the calendar itself:** fetch confirmed reservation dates and
  disable/strike them in the picker, with a one-line legend. Nothing is more
  premium than not wasting the guest's time.
- Success state: the invite card gets a slow gold hairline that traces its
  border (same stroke-dash technique as the meander) + the wave rule. No confetti.

### 11. Gallery page
- Rows of varied aspect ratios (portrait 3/4 "stele", wide 16/9 "frieze") rather
  than a uniform grid — curated wall, not Instagram grid.
- Hover: slow scale (1.03, 800ms) + caption reveals in small caps over a bottom
  gradient scrim.
- Lightbox: ivory scrim (not black), image framed with the thin gold mat,
  keyboard navigable, caption beneath like a museum label.

### 12. Buttons & focus
- One primary style (aegean pill) + one quiet style (hairline pill) — already
  true; add: arrow glyph that slides in 4px on hover for text links
  ("View the full gallery →"), and gold `focus-visible` rings site-wide
  (currently default ring). Keyboard users get the premium treatment too.

### 13. Mobile menu
Full-screen ivory takeover instead of a side sheet: serif links staggering in
(80ms), meander at the bottom, close icon top-right. The sheet is the one
component that currently feels "stock shadcn."

---

## Guardrails & housekeeping

- **Contrast:** `--color-gold` (#a8854e) on ivory is ~3.2:1 — fine as ornament,
  not fine as 12px text. Darken text-role gold to ~#8a6b3c or bump overline size.
- Grain/gradients must never exceed ~3% visual weight; if a texture is visible
  in a screenshot thumbnail, it's too strong.
- Every animation ≤ 1.2s, `ease-out`, opacity/transform only (compositor-friendly).
- `prefers-reduced-motion` disables all of it, `font-display: swap` on both faces.
- Per `AGENTS.md`: this Next.js version has breaking changes — read the docs in
  `node_modules/next/dist/docs/` before using View Transitions or new APIs.
- Admin stays a clean tool; none of this brief applies there.

## Suggested order of work

1. Motion system + meander draw-in (signature moment, touches every page)
2. Grain + gold-foil treatment + hero figure rebuild
3. Reserve flow upgrade (availability calendar + invitation card)
4. Timeline section + epigraph testimonials + φιλοξενία footer
5. Gallery masonry + lightbox, nav/header refinements, mobile menu
