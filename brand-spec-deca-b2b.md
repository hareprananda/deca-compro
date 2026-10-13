# DECA — Brand Spec (B2B / Consumer site)

**Source:** `http://103.159.199.42:8090/` — read from its own live stylesheets,
`home.css` (40.5 KB, the page at `/`) and `styles.css` (29.3 KB, `login.html` +
`register.html`). Extracted 2026-10-13. Everything below is measured, not guessed.

> Supersedes nothing — this documents a **second DECA property** alongside the
> `deca.co.id` work in `DESIGN.md` / `design-system-v2.md`. See the last section:
> the two sites do not share a palette.

**One sentence:** a tight-cornered, editorial B2B system set in Manrope and DM Sans,
built around pale green icon chips and one arch-shaped photographic flourish —
undermined by two divergent palettes and a small-text layer that fails contrast throughout.

---

## Tokens

Sampled from `home.css`, converted to OKLch.

| Role | Hex | OKLch | Notes |
| --- | --- | --- | --- |
| `--bg` | `#f8fbf8` | `oklch(98.5% 0.0051 145.5)` | page canvas, faintly green-tinted |
| `--surface` | `#ffffff` | `oklch(100% 0 89.9)` | cards, panels, mega-menu |
| `--fg` | `#102521` | `oklch(24.5% 0.0283 180.1)` | body ink — 15.39:1 on `--bg` |
| `--muted` | `#657773` | `oklch(55.3% 0.0222 180.5)` | secondary text — 4.54:1 |
| `--border` | `#e3ebe6` | `oklch(93.3% 0.0108 158.8)` | hairlines |
| `--accent` | `#05bd3b` | `oklch(69.5% 0.2133 145.7)` | brand green — **fill only**, 2.41:1 as text |
| `--accent-2` | `#0074db` | `oklch(56.4% 0.1798 254.1)` | brand blue — 4.46:1, marginal as text |

### Corrections the source needs

Four pairs fail, and one of them is the primary button in both systems.

| Pair | Measured | Fix |
| --- | --- | --- |
| white on `#05bd3b` (marketing button) | **2.52** | label becomes `--fg` → **6.38** |
| white on `#58ea60` (auth gradient, light stop) | **1.57** | gradient deepened → **4.56 / 4.51** at both stops |
| `#008c42` as text | **4.17** | `--green-ink` `#058540` → **4.54** |
| `#05bd3b` as icon | **2.41** | `--green-icon` `#11a63a` → **3.08** |
| `#0074db` as text | **4.46** | `--blue-ink` `#0172d7` → **4.59** |
| 16 ad-hoc greys at 8–11px | **2.30 – 4.37** | all become `--muted` → **4.54** |

No corrected value is a new colour — each is the sampled brand colour mixed toward
that sheet's own ink, far enough to clear the threshold.

---

## Font stacks

- **Display** — `'Manrope', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif` — weights 400–800, `letter-spacing: -.055em` on headings
- **Body** — `'DM Sans', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif` — weights 400–700
- **Mono** — `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` (used in practice only for code, not for figures)

Both faces are served from Google Fonts. The tight negative tracking is what gives
the dense small-type setting its character.

---

## Observed rules

1. **Small radii throughout, with one arch.** Buttons 7px, cards 9px, panels and
   mega-menu 14px. The single exception is a photo mask — `border-radius: 140px 140px 17px 17px`
   on the hero, `9px 94px 9px 9px` on the trust photo. That arch is the flourish.
2. **Green carries the brand, blue carries capability.** Green marks what DECA does;
   blue marks the technical and partner layer — API chips, lending, PSP, marketplace.
   `--eco` and `--mint` exist only as gradient stops and tints.
3. **Green-tinted shadows on interactive elements.** Button and card shadows use the
   brand green at low alpha (`rgb(6 168 50 / .14)`), not neutral black. Shadows on
   passive surfaces stay neutral.
4. **A disciplined motion system.** `rise-in .72s cubic-bezier(.2,.7,.2,1)` for entrances,
   `soft-drift 6s` and `glow-breathe 7s` for ambient life, `draw-chart` for chart reveals —
   with a complete `prefers-reduced-motion` block that switches all of it off.
5. **Interface copy is set unusually small — 8 to 11px.** This is the system's defining
   characteristic and its central flaw: at those sizes even colour pairs that pass at
   13px become hard to read, which is why the small-text layer fails contrast wholesale.

## Brand assets

The logo ships as **one 1080 × 1080 RGBA PNG** (`assets/deca-logo.png`, 15.8 KB) — the
rounded green tile with a white stylised ‘d’, followed by the `deca` letterforms, centred
with generous vertical padding. Localised here as `logos/deca-b2b-logo.png`.

The site never ships a trimmed wordmark. The header crops it in CSS:

```css
.brand     { width:112px; height:50px; overflow:hidden }
.brand img { width:112px; height:112px; top:-38px; max-width:none }
```

One asset then serves the header (112 × 50), the footer (122 × 39) and both auth pages
(134 × 42), each cropping to its own height by changing only the container.

**That is the only image on the homepage.** A full crawl of `/` returns exactly one `<img>`,
and neither stylesheet contains a single `url()` beyond an inline SVG filter reference.
Every phone mockup, dashboard card, chart, ecosystem map and QR mark is built from borders,
gradients and inline SVG. For a payments brand this is a notable engineering result and the
system's best performance decision.

---

## How this relates to the `deca.co.id` system

The two properties share **no colour values at all**:

| | `deca.co.id` (this project's `DESIGN.md`) | `103.159.199.42:8090` |
| --- | --- | --- |
| Display / body | CircularStd | Manrope / DM Sans |
| Ink | `#18233f` navy | `#102521` green-black |
| Accent | `#01b101` | `#05bd3b` (marketing) · `#04ca02` (auth) |
| Neutrals | cool grey | green-tinted (marketing) · blue-tinted (auth) |

And within the second site, `home.css` and `styles.css` also share **zero hex values**.
Three palettes currently claim to be DECA. Consolidating them is the first job.
