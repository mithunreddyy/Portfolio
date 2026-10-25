# DESIGN.md: Mithun Reddy Portfolio

**Status:** draft for owner review.
**Sources:** observed values come from `src/index.css` and `README.md`. Items marked **PROPOSED** are additions to make the direction more designed. Each one stays a proposal until the owner keeps it.

## Identity

Observed: a personal portfolio for a design-minded software engineer. It is editorial first: project case studies, a long-form blog, and a live availability status.

Personality, observed: quiet, precise, typographic. Motion rewards attention and does not fill space.

## Dials

**PROPOSED:** ENERGY 2 / RHYTHM 2 / MOTION 2.

Design Read: *"Reading this as: personal portfolio and editorial blog for engineers and hiring managers, in a restrained editorial style, dial ENERGY 2 / RHYTHM 2 / MOTION 2."*

Raise RHYTHM to 3 if the owner wants section compositions to vary more.

## Palette

Light is the default, on a soft, cool off-white (not pure white). Dark is a working toggle through `data-theme="dark"` on `:root`. Both modes must work.

| Token | Dark | Light |
|---|---|---|
| `--color-bg` | `#080808` | `#f6f7f9` |
| `--color-ink` | `#f0f0f0` | `#15171a` |
| `--color-muted` | `#a1a1a1` | `#636872` |
| `--color-line` | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.08)` |
| `--color-accent` | `#3B82F6` | `#2563EB` |

Rule: one accent. Neutrals do not count toward the palette limit.

**PROPOSED:** reserve the accent for one moment per screen, such as the primary action or the availability dot. Everything else stays in ink and muted.

## Typography

- **Sans (headings and body):** Hanken Grotesk, fallback Inter. Reason: editorial headings with a clear weight range.
- **Mono (metadata and code):** Geist Mono, fallback JetBrains Mono. Reason: dates, read times, and code-like data read as data.
- Blog title: 2.25rem to 3rem, weight 700, letter-spacing -0.02em, line-height 1.15.
- Lead: 1.05rem to 1.12rem, line-height 1.85.
- Body: 1.02rem to 1.08rem, line-height 1.9 to 1.95.
- Measure: content column is 680px max.

## Shape and Depth

- Cards: 16px radius (`rounded-2xl`), surface `ink` at 3% opacity.
- Depth comes from surface contrast, not shadow. No shadows are defined in the current system.
- Pills are not part of the system, except the availability status dot.

## Layout

- One content column, 680px max, with 20px to 24px side gutters.
- Whitespace separates sections. It is structure, not leftover space.

**PROPOSED (RHYTHM 2):** keep one shared column, but vary the internal composition: a text-led intro, a list-led project index, and a wide case-study block. Do not repeat the same card grid in every section.

## Motion

- Library: Motion. Smooth scroll: Lenis.
- Transitions: 200ms to 300ms, ease.
- Hover states on links and cards are the baseline.

**PROPOSED (MOTION 2):** one signature reveal per page, such as the title entering once. No Fade Up, Bounce, or Floating on every element.

## Identity Motif

**PROPOSED:** the mono metadata line (date, read time, location) is the recurring typographic voice across blog and case studies. It is the one place where the mono face appears.

## Known Conflicts With antislop

These items come from the current code and conflict with an antislop rule. Per R-37, each one needs an owner decision: keep it and record the reason, or drop it.

1. **Radial accent spotlight** on `body::after` at 5% opacity (`src/index.css`). Rule R-01 and R-13: a glow needs a stated purpose.
   Owner decision: [pending]

2. **Uppercase mono labels with 0.08em to 0.14em tracking** on the back link, meta row, "more" label, and footer (`src/index.css`). Rule R-06: wide-tracked uppercase is forbidden as a default without purpose.
   Owner decision: [pending]

3. **Lucide icons** (README: "thin stroke variants"). Rule R-04: an icon set picked for its library look needs written relevance per icon.
   Owner decision: [pending]

Note: the README lists Inter as the UI font, but the CSS puts Hanken Grotesk first. This DESIGN.md follows the CSS.

## Antislop Checks for This Design

- No em dashes in UI text (R-02).
- Mobile: no horizontal overflow, tap targets 44px (R-03).
- Every stat, testimonial, and claim must be real or removed (R-17, R-18, R-36).
- Every nav item must have a real destination (R-24).
- Light and dark both verified (R-34).
