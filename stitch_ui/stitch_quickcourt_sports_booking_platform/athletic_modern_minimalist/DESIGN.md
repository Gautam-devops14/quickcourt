---
name: Athletic Modern Minimalist
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#404941'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707a71'
  outline-variant: '#bfc9bf'
  surface-tint: '#216b43'
  primary: '#004225'
  on-primary: '#ffffff'
  primary-container: '#0a5c36'
  on-primary-container: '#89d2a2'
  inverse-primary: '#8dd6a6'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#31394e'
  on-tertiary: '#ffffff'
  tertiary-container: '#485066'
  on-tertiary-container: '#bbc2dc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a8f3c1'
  primary-fixed-dim: '#8dd6a6'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#00522e'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies a modern, high-precision sports-tech utility tailored for rapid, frictionless court reservations and sports venue operations. The visual language is disciplined, athletic, and contemporary—drawing inspiration from professional tennis courts, architectural sports complexes, and premium Swiss instrument interfaces.

The emotional target is effortless competence: users should feel immediate clarity, speed, and confidence when inspecting schedules, comparing surfaces, and confirming time slots. The interface avoids gratuitous visual effects, decorative gradients, or artificial glass layers. Instead, it relies on crisp 1px structural borders, deliberate whitespace, structured information density, and focused high-visibility accents to communicate availability and momentum.

## Colors

The color palette is rooted in athletic tradition and functional contrast:

- **Primary (`#0A5C36`)**: A rich, deep court forest green that serves as the dominant anchor for key brand moments, primary CTAs, active booking states, and top-tier navigation surfaces.
- **Secondary / Accent (`#10B981`)**: An energized, athletic court emerald. Used sparingly for status confirmation, available time-slot badges, verified venue indicators, and live scheduling highlights.
- **Tertiary / Base Dark (`#0F172A`)**: A deep slate black used for high-emphasis headlines, active numeric displays, and solid contrast control.
- **Neutral (`#64748B`)**: A balanced slate grey providing secondary body text, timestamp notation, court dimension details, and disabled states.
- **Surface Canvas (`#F8FAFC`)**: A crisp, cool off-white that creates high separation without the fatigue of pure raw white across large canvases.
- **Card / Island Surfaces (`#FFFFFF`)**: Pure white reserved for interactive components, schedule slots, booking sheets, and cards.
- **Structural Borders (`#E2E8F0`)**: Crisp 1px perimeter outlines establishing clear visual containment.

## Typography

The design system utilizes Plus Jakarta Sans across all typographic roles. Its clean neo-grotesque geometry features wide apertures and crisp alternate shapes that maintain legibility at high data density—vital for multi-court availability grids, calendar dates, pricing matrices, and reservation summaries.

Tabular numerals (`tnum`) must be enforced for all time-slot listings, pricing figures, and duration countdowns. Uppercase micro-labels (`label-sm`) feature a strict `0.04em` tracking offset to preserve readability when specifying surface classifications (e.g., HARD COURT, CLAY, PADEL, INDOOR).

## Layout & Spacing

A strict 8-point base grid governs layout flow, component framing, and gap tolerances. Content relies on a responsive 12-column layout on desktop viewports (`>= 1024px`), a 6-column layout on tablet (`768px - 1023px`), and a 4-column layout on mobile (`< 768px`).

- **Mobile Viewports**: Margins are pinned to `1rem` (`16px`) with `1rem` gutters. Calendar and court booking strips convert from multi-column tables into horizontal snap-scrolling rails or vertical stack lists.
- **Desktop Viewports**: Margins expand up to `3rem` (`48px`) with a fixed content max-width container capped at `1280px`. Schedule grids adopt split-view architectures: sticky filters and court details on the left, multi-slot time-matrix grids on the right.
- **Rhythm**: Element-level spacing maps directly to standard steps: `0.25rem` (`4px`) for compact tag insets, `0.5rem` (`8px`) for tight item pairings, `1rem` (`16px`) for card interiors and form controls, and `1.5rem` (`24px`) to `2rem` (`32px`) between discrete visual groups.

## Elevation & Depth

Visual hierarchy is communicated through tonal separation and hairline boundaries rather than dramatic z-axis shadows. Surfaces sit flat and deliberate, drawing contrast from `#F8FAFC` background canvases, `#FFFFFF` card fills, and crisp `#E2E8F0` borders.

- **Level 0 (Flat Canvas)**: Neutral `#F8FAFC` base page layer.
- **Level 1 (Structural Cards & Slots)**: Surface `#FFFFFF` bordered with `1px solid #E2E8F0`. No drop shadow; elevation is defined strictly by border luminance contrast.
- **Level 2 (Interactive Floating / Hover)**: For hovering court cards, dropdown popovers, and sticky mobile booking summaries: `box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.04)`, paired with a border tone transition to `#CBD5E1`.
- **Level 3 (Modals & Bottom Booking Drawers)**: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)`. Dimmed backdrops use `rgba(15, 23, 42, 0.4)` without blur.

## Shapes

The design system employs a soft, restrained border radius (`roundedness: 1`), keeping controls and surfaces precise and grounded:

- **Base Radius (`0.25rem` / `4px`)**: Applied to checkboxes, micro-tags, surface tags, and status dots.
- **Medium Radius (`0.375rem` / `6px`)**: Applied to input fields, time-slot selection pills, and secondary utility buttons.
- **Large Radius (`rounded-lg: 0.5rem` / `8px`)**: Applied to venue cards, reservation summary panels, booking detail modals, and hero court imagery.
- **Pill Formats**: Strictly reserved for dynamic status badges (e.g., "Available", "Lighting Included", "Booked") and segmented venue view filters.

## Components

### Buttons
- **Primary**: Background `#0A5C36`, text `#FFFFFF`, font `label-lg`, height `44px`, padding `0 1.25rem`, border radius `6px`. Hover: `#084C2C`. Active: `#063D23`.
- **Secondary**: Background `#FFFFFF`, text `#0F172A`, 1px solid `#E2E8F0`, height `44px`, padding `0 1.25rem`, border radius `6px`. Hover: `#F8FAFC` with border `#CBD5E1`.
- **Destructive**: Background `#FEF2F2`, text `#DC2626`, 1px solid `#FEE2E2`.

### Time-Slot Selector Chips
- **Available**: Background `#FFFFFF`, text `#0F172A`, 1px solid `#E2E8F0`, border radius `6px`, padding `8px 12px`. Hover: border `#10B981`, background `#F0FDF4`.
- **Selected**: Background `#0A5C36`, text `#FFFFFF`, border `1px solid #0A5C36`.
- **Unavailable / Booked**: Background `#F1F5F9`, text `#94A3B8`, border `1px solid #E2E8F0`, pointer-events `none`, diagonal strikethrough indicator optional.

### Input Fields & Search Bars
- Background `#FFFFFF`, 1px solid `#E2E8F0`, border radius `6px`, height `42px`, padding `0 12px`, typography `body-md`. Placeholder color `#94A3B8`.
- Focus state: border `1px solid #0A5C36`, subtle box-shadow `0 0 0 1px #0A5C36`.

### Cards & Venue Panels
- Background `#FFFFFF`, 1px solid `#E2E8F0`, border radius `8px`, padding `1rem` to `1.5rem`.
- Media aspect ratios strictly locked to `16:9` or `4:3` with `overflow: hidden` and inset surface classification tags fixed to the upper left corner.

### Checkboxes & Radios
- Size `18px x 18px`, border `1.5px solid #CBD5E1`, border radius `4px` (checkbox) or `50%` (radio).
- Checked: Background `#0A5C36`, border-color `#0A5C36`, inner white tick or dot.

### Match & Court Schedule Matrix (Specialized Component)
- Horizontal timeline columns with sticky 60-minute interval markers.
- Continuous multi-court rows divided by 1px solid `#F1F5F9` lines.
- Current-time live indicator: `1.5px` vertical hairline in `#10B981` with a `6px` solid dot pinned to the header.