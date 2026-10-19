# OpenCode Prompt --- Phase 4: JALRAKSHAK UI and Farmer Application

You are the product-minded frontend engineer. Inspect the repository,
existing design system, and API contracts first. Implement the
JALRAKSHAK UI in React using the existing project conventions. Do not
replace the stack or invent backend endpoints.

## Visual direction

Use the supplied admin dashboard screenshots as inspiration, not as a
literal copy: - Premium clean SaaS/admin UI. - Collapsible left sidebar
with icons and clear active state. - Top bar with breadcrumb, global
search where meaningful, light/dark theme toggle, notifications and user
menu. - Rounded cards, subtle borders/shadows, ample spacing, pale blue
and soft green accents. - Light and dark themes with readable
contrast. - Wide desktop: main workspace plus right-side Alerts/Recent
Activity panel. - Tablet/mobile: collapsible sidebar, stacked cards and
no forced horizontal scrolling. - Accessible keyboard focus, labels,
semantic HTML and loading/empty/error states. - Avoid fake website
analytics. All labels and charts must be relevant to farms, water,
weather and irrigation. - Clearly label mock/demo data; never present it
as live sensor or validated ML data.

## Navigation

Overview, My Farms, Irrigation, Recommendations, Weather, Analytics,
History, Alerts, Settings. Admin-only pages should be role-gated in the
UI and protected by backend authorization too.

## Overview dashboard

-   KPI cards: total farms, pending recommendations, latest
    soil-moisture status when available, and irrigation activity/water
    metric only when backed by real or explicitly demo-labelled data.
-   Moisture/rainfall chart with units and time range.
-   Weather summary with source timestamp and stale-data indicator.
-   Recent recommendations table with farm, crop, action, quantity/unit
    if available, date and status.
-   Alerts/activity panel with sensible empty states.
-   Do not imply water savings unless measured and clearly qualified.

## Tasks

1.  Create reusable layout, sidebar, topbar, card, chart wrapper, alert
    item, table, empty/loading/error and confirmation components.
2.  Use a single design-token source for colours, spacing, radii,
    typography, borders and shadows.
3.  Implement theme preference persistence using the project's existing
    method; avoid duplicate competing theme systems.
4.  Use the actual API client/contracts where available. If APIs are not
    ready, isolate clearly marked mock data behind a mock adapter and
    document it.
5.  Build forms with validation and accessible feedback.
6.  Add responsive breakpoints and test light/dark mode.
7.  Add frontend tests for critical navigation, forms, theme and error
    states.
8.  Document how to run the frontend and where API base URL is
    configured.

## Constraints

-   Do not modify backend/ML code unless necessary for a documented
    contract mismatch; report it instead.
-   Do not install a large UI kit without checking existing dependencies
    and explaining why.
-   Do not copy unrelated Figma/template branding or assets.
-   Do not claim every screen is functional if it uses placeholders.

## Acceptance criteria

The UI runs, matches the intended visual direction, is responsive and
accessible, has consistent light/dark modes, and clearly separates live
data from demo data. Report screenshots only if actually captured.
