---
name: JALRAKSHAK
description: Smart Irrigation Decision-Support Platform — ICAR Crop-Calendar & Canal Gauge System
colors:
  shell-green: "#143623"
  shell-green-deep: "#0D2618"
  paddy-green: "#156836"
  canal-cobalt: "#0B5380"
  turmeric-amber: "#9E5400"
  deficit-crimson: "#B91C1C"
  bg-ground: "#F6F3EB"
  bg-surface: "#FFFFFF"
  bg-subtle: "#EFECE2"
  ink-primary: "#18241D"
  ink-secondary: "#33473B"
  border-panel: "#C4BEAE"
  border-strong: "#9CA89E"
typography:
  display:
    fontFamily: "Archivo, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "1.22rem"
    fontWeight: 800
    lineHeight: 1.22
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "1.04rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Lexend, Noto Sans Devanagari, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Chivo Mono, Noto Sans Devanagari, ui-monospace, monospace"
    fontSize: "0.74rem"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  tag: "6px"
  control: "8px"
  panel: "12px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.paddy-green}"
    textColor: "{colors.bg-surface}"
    rounded: "{rounded.control}"
    padding: "8px 15px"
  button-cobalt:
    backgroundColor: "{colors.canal-cobalt}"
    textColor: "{colors.bg-surface}"
    rounded: "{rounded.control}"
    padding: "8px 15px"
  button-secondary:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.control}"
    padding: "8px 15px"
  panel-surface:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.panel}"
    padding: "16px 18px"
---

# Design System: JALRAKSHAK

## Overview

**Creative North Star: "The ICAR Crop-Calendar & Canal Headworks Gauge"**

JALRAKSHAK is designed for Indian multi-crop farmers (Wheat, Rice, Sugarcane, Cotton, Maize) operating irrigation schedules in bright outdoor sunlight as well as pre-dawn tube-well shifts. Drawing from Indian Council of Agricultural Research (ICAR) seasonal phenology wall charts, Krishi Vigyan Kendra (KVK) soil health cards, and masonry canal depth gauges, the interface replaces decorative SaaS chrome with physical measurement instruments: phenological growth-stage ribbons, calibrated root-zone moisture rails, millimeter-ruled water bars, and indelible action stamps.

Every screen prioritizes the four core farmer questions—*What action? When to irrigate? How much water (`mm`)? Why?*—while keeping final execution authority with the farmer and enforcing strict data-freshness guardrails (`<6h` weather, `<24h` soil moisture).

**Key Characteristics:**
- Sunlit chart-stock ground (`#F6F3EB`) paired with a deep foliage green (`#143623`) navigation shell for high outdoor contrast (`>7:1`), plus a Deccan Basalt dark mode (`#0D1712`) for night/dawn use.
- Bilingual English + Devanagari Hindi (`Noto Sans Devanagari`) route, crop, and action labels.
- Calibrated root-zone moisture threshold rail (`0–45% Vol`) plotting current moisture against Wilting Point (`12%`), Stress Threshold (`20%`), and Field Capacity (`32%`).
- Custom `1.8px`-stroke SVG icon system (`Icon.jsx`) including botanical emblems for Wheat, Rice, Sugarcane, Cotton, and Maize.
- Stepped `90ms steps(2)` state transitions that feel crisp and responsive on rural mobile devices.

## Colors

The palette pairs sun-bleached agricultural chart paper with deep botanical greens, canal-water cobalt, turmeric amber warnings, and crimson moisture-deficit indicators.

### Primary
- **Deep Foliage Shell Green** (`#143623`): Anchors the left navigation sidebar, mobile bottom navigation bar, and active phenology stage blocks.
- **Paddy Action Green** (`#156836`): Used for primary execution actions (`Record Executed Irrigation`), `WAIT` recommendation stamps, and healthy moisture bars.

### Secondary
- **Canal Headworks Cobalt** (`#0B5380`): Used for `IRRIGATE` action stamps, millimeter water-depth figures (`25.0 mm`), top-right `Register / पंजीकरण` CTA, focus rings, and emphasis borders.

### Tertiary
- **Turmeric Advisory Amber** (`#9E5400`): Marks `PARTIAL_IRRIGATION` stamps, wind/evaporation timing notes, and demo-telemetry disclosure tags.
- **Root-Deficit Crimson** (`#B91C1C`): Marks critical moisture pins below threshold and stale-data (`>24h`) safety blocks (`INSUFFICIENT_DATA`).

### Neutral
- **Sunlit Chart Stock** (`#F6F3EB`): Primary application canvas ground, reducing glare compared to pure white in outdoor sunlight.
- **Crisp Ledger Surface** (`#FFFFFF`): Foreground panel surface for data tables, forms, and advisory cards.
- **Warm Bund Silt** (`#EFECE2`): Topbar, table header, and right-hand alert rail ground.
- **Alluvial Loam Ink** (`#18241D`) & **Secondary Foliage Slate** (`#33473B`): High-contrast primary and secondary text colors.
- **Structural Panel Border** (`#C4BEAE`) & **Control Border** (`#9CA89E`): Crisp `1.5px` structural rules.

### Named Rules
**The Sunlight Contrast Rule.** Secondary text on colored or tinted grounds must be tinted from the surface hue (`#CFE3D6` on `#143623`), never mid-gray, maintaining a minimum `4.5:1` contrast ratio outdoors.

**The Water-Quantity Safety Color Rule.** Canal Cobalt (`#0B5380`) water-depth figures (`mm`) appear only alongside `IRRIGATE` or `PARTIAL_IRRIGATION` stamps; `WAIT` and `INSUFFICIENT_DATA` states never render a numeric water volume.

## Typography

**Display Font:** `Archivo` with `Noto Sans Devanagari` fallback  
**Body Font:** `Lexend` with `Noto Sans Devanagari` fallback  
**Label/Mono Font:** `Chivo Mono` with `Noto Sans Devanagari` fallback

**Character:** `Archivo` provides sturdy, condensed industrial clarity for field headings and water-depth numerals; `Lexend` maximizes open-counter legibility for agronomic reasoning; `Chivo Mono` aligns tabular timestamps, coordinates, and millimeter gauges.

### Hierarchy
- **Display** (`800`, `2rem`, `1.2` line-height, `-0.025em` tracking): Water-depth readout (`25 mm`) and primary brand header.
- **Headline** (`800`, `1.22rem`, `1.22` line-height, `-0.02em` tracking): Section panel headings (`ICAR Crop Phenology Calendar`, `Field Irrigation Advisory`).
- **Title** (`700`, `1.04rem`, `1.25` line-height): Sub-panel headers (`Calibrated Root-Zone Moisture Rail`) and action stamps.
- **Body** (`400–600`, `0.9rem`, `1.55` line-height, max `72ch`): Agronomic reasoning, alert descriptions, and form labels.
- **Label** (`600–700`, `0.74rem`, `1.3` line-height, `tabular-nums`): Freshness badges (`Weather: 0.7h (<6h OK)`), model versions, and table headers.

### Named Rules
**The No-Kicker Heading Rule.** Headings (`h1`–`h4`) never carry a small uppercase eyebrow or kicker label above them; the heading itself leads its container.

**The Tabular Measurement Rule.** Every moisture percentage, millimeter water depth, hectare area, temperature, and timestamp uses `font-variant-numeric: tabular-nums`.

## Layout

The application uses a three-zone operational shell on desktop (`grid-template-columns: 248px minmax(0, 1fr) 308px`):
- **Left Sidebar (`248px`):** Brand header, the 9 Core Farmer Routes (`Overview`, `My Farms`, `Irrigation`, `Recommendations`, `Weather`, `Analytics`, `History`, `Alerts`, `Settings`) with bilingual English + Hindi labels, and the Service Telemetry probe box (`Spring API :8080`, `FastAPI ML :8000`, `PostgreSQL :5432`).
- **Topbar (`grid-column: 2 / 4`):** Active farm plot selector, 6-hour weather freshness tag, demo/live telemetry badge, `EN + हिंदी` toggle, `Sunlight / Night Mode` toggle, and top-right `Login / लॉगिन` and `Register / पंजीकरण` buttons.
- **Main Workspace (`minmax(0, 1fr)`):** Stacked `14px`-gap panels with `16px 20px` padding, housing the 4-stage Phenology Calendar ribbon, the 2-column Hero Field Irrigation Advisory & Root-Zone Moisture Rail, and the 2-column 7-Day Millimeter Bar Gauge + All Plots Status Table.
- **Right Rail (`308px`):** Field Alerts & Freshness cards above the Active Multi-Crop Plots switcher.
- **Responsive Tablet (`<= 1180px`) & Mobile (`<= 780px`):** At `<= 780px`, the sidebar becomes a slide-over drawer (`280px`) paired with a fixed 5-tab Mobile Quick Navigation Bar at the bottom (`56px` height), the topbar compacts into a 2-row header with `44px` touch targets, and the 4 phenology stages reflow into a `2x2` grid with zero horizontal page scroll.

## Elevation & Depth

Surfaces are flat and architectural by default, separated by tonal layering (`#F6F3EB` canvas, `#EFECE2` rails, `#FFFFFF` panels) and crisp `1.5px` structural borders (`#C4BEAE` for standard panels, `2px solid #0B5380` for the primary Field Irrigation Advisory).

### Named Rules
**The Single-Elevation Rule.** Declare elevation once: bordered panels never carry drop shadows (`box-shadow: none`), avoiding muddy "ghost cards" in outdoor light.

## Shapes

- **Panels (`.jr-panel`):** `12px` border radius with `1.5px solid` full perimeter borders.
- **Interactive Controls & Inputs (`.btn-*`, `.field-label input`):** `8px` border radius with `1.5px solid` borders and `40px–44px` minimum touch height.
- **Stamps & Telemetry Tags (`.action-stamp`, `.mono-tag`):** `6px` border radius, rectangular passbook/advisory stamp proportions rather than full pills.
- **No Side-Stripe Accents:** Callouts, nav items, and alerts use full-perimeter borders (`1.5px`) and custom SVG icons rather than thick `border-left` stripes.

## Components

### Buttons
- **Shape:** `8px` radius (`var(--radius-control)`), `42px` minimum height, `8px 15px` padding, `700` weight.
- **Primary (`.btn-primary`):** Paddy Green (`#156836`) fill with `#FFFFFF` text for field execution and form submission; darkens to `#10522A` on hover in `90ms steps(2)`.
- **Cobalt CTA (`.btn-cobalt`):** Canal Cobalt (`#0B5380`) fill with `#FFFFFF` text for top-right `Register / पंजीकरण` and moisture sync actions; darkens to `#083E61` on hover.
- **Secondary (`.btn-secondary`):** Crisp `#FFFFFF` surface with `1.5px solid #9CA89E` border and `#18241D` ink; shifts to `#EFECE2` on hover.

### Chips / Telemetry Tags (`.mono-tag`)
- **Style:** `Chivo Mono` `0.74rem` (`600`), `5px 10px` padding, `6px` radius, `1px solid` semantic border.
- **Variants:** `ok-tag` (`#E8F3EC` fill, `#156836` border/ink), `warn-tag` (`#FDF3DF` fill, `#9E5400` border/ink), `cobalt-tag` (`#E6F1F8` fill, `#0B5380` border/ink), `danger-tag` (`#FCE8E8` fill, `#B91C1C` border/ink).

### Cards / Panels (`.jr-panel`, `.jr-panel-emphasis`)
- **Corner Style:** `12px` radius.
- **Background:** `#FFFFFF` (`#14231B` in dark mode).
- **Border:** `1.5px solid #C4BEAE` (`2px solid #0B5380` on `.jr-panel-emphasis`); never nested card-in-card.
- **Internal Padding:** `16px 18px` (`14px` on mobile).

### Inputs / Fields (`.field-label`)
- **Style:** Stacked label (`0.82rem`, `600` weight) over `42px`-height input/select with `#F6F3EB` ground, `1.5px solid #9CA89E` stroke, and `8px` radius.
- **Focus:** `2.5px solid #0B5380` outline with `2px` offset.

### Navigation (`.jr-sidebar`, `.jr-mobile-bottom-nav`)
- **Desktop Sidebar:** `#143623` ground, `44px`-height route buttons with `1.8px`-stroke SVG icons on the left and Devanagari Hindi subtitles on the right. Active route flips to `#F6F3EB` background and `#18241D` ink.
- **Mobile Navigation:** Slide-over drawer (`transform 90ms steps(2)`) plus fixed 5-tab bottom bar (`56px` height) for thumb reachability.

### Calibrated Root-Zone Moisture Rail (`.threshold-rail-box`)
- **Structure:** A `30px`-tall graduated track combining `20px` vertical millimeter rule ticks over a 4-zone soil-moisture continuum (Wilting `12%` → Stress `20%` → Field Capacity `32%` → Saturation `45%`), with a `4px` crimson position pin and top callout (`NOW: 15%`).

## Do's and Don'ts

### Do:
- **Do** show exact data-freshness age (`<6h` for weather, `<24h` for soil moisture) and model version (`baseline-heuristic-v1`) on every recommendation surface.
- **Do** suppress numeric water quantities (`irrigationAmountMm`) whenever the recommendation is `WAIT` or `INSUFFICIENT_DATA`.
- **Do** use custom stroke SVGs (`Icon.jsx`) for all crop, weather, and navigation icons, and include `Noto Sans Devanagari` whenever rendering Hindi labels.
- **Do** keep `Login` and `Register` directly accessible in the top-right header bar across desktop and mobile viewports.

### Don't:
- **Don't** place uppercase kicker/eyebrow labels above headings (`h1`–`h4`).
- **Don't** use Unicode emoji (`🌾`, `💧`, `⚠`) in place of drawn SVG icons.
- **Don't** combine borders and drop shadows on the same panel, or use thick `border-left` stripes on cards or alerts.
- **Don't** claim unvalidated water-savings percentages or present simulated fallback telemetry as live sensor data.
