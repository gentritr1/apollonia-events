# Apollonia Events — Design Language

Modern luxury inspired by Ancient Greek aesthetics, without the clichés.
Feel: **elegant, calm, premium, spacious, handcrafted.**

## Palette (Tailwind tokens, defined in `src/app/globals.css`)

| Token | Hex | Use |
|---|---|---|
| `ivory` | `#f6f2e9` | Page background |
| `marble` / `marble-deep` | `#ece6d9` / `#ddd5c4` | Surfaces, hairlines, borders |
| `ink` / `ink-soft` | `#1e2a30` / `#475158` | Headings / body text |
| `aegean` / `aegean-deep` / `aegean-bright` | `#2c5c6b` / `#1c3d47` / `#3e7f91` | Primary actions, accents |
| `gold` / `gold-soft` | `#a8854e` / `#c4a872` | Overlines, fine ornament |
| `olive` | `#6f7245` | Sparing secondary accent |

Use Tailwind utilities directly: `bg-ivory`, `text-aegean`, `border-marble-deep`, etc.

## Typography

- **Headings:** Cormorant Garamond (`font-serif`) — `font-weight: 500`, tight leading.
- **Body / UI:** Inter (`font-sans`).
- **Overline:** `.overline` — small, uppercase, wide tracking, gold.

## Patterns & helpers

- `.marble-wash` — very low-contrast radial marble background for full-bleed sections.
- `.hairline` — thin fading divider; prefer over heavy borders.
- `<MeanderRule />` — short, tileable Greek-key accent. **Use once or twice per page, never as a fill.**

## Rules (the anti-cliché contract)

- Generous whitespace and vertical rhythm; let elements breathe.
- Symmetry and balance, but allow refined asymmetry.
- **Avoid:** cheesy mythology, cartoon gods, Spartan helmets, parchment textures,
  overused columns, generic AI-looking UI.
- Decoration is earned: one accent beats three.
