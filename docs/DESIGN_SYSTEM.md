# GO WITH US — Design System

This document serves as the official visual design system and component specification for **GO WITH US**, acting as the authoritative visual source of truth for all future frontend implementation.

---

## 1. Purpose

The GO WITH US design system establishes a cohesive visual language across the entire application. It ensures every view feels like part of a unified, high-end travel discovery platform.

### Visual Identity Goal
GO WITH US must feel:
* **Premium & Editorial**: Inspiring typography, generous whitespace, and rich imagery.
* **Travel-Focused & Immersive**: Photography leads the user experience.
* **Modern & Calm**: Clean visual hierarchy that reduces cognitive stress during planning.
* **Human & Sophisticated**: Warm, inviting tones and refined micro-interactions.

### Explicit Anti-Patterns
GO WITH US must **NOT** feel like:
* A dense, tabular SaaS admin dashboard.
* A aggressive, high-density hotel booking marketplace clone.
* A cookie-cutter component library or default template.
* A visually noisy travel portal filled with promotional banners.

---

## 2. Design Philosophy

1. **Visual Storytelling**: Photography is a primary content layer, not mere decoration.
2. **Editorial Composition**: Layouts utilize asymmetrical balances, bold typography, and intentional whitespace to elevate travel narrative.
3. **Simplicity**: UI elements are trimmed to their functional essentials.
4. **Content First**: Interfaces frame destination data, stays, activities, and itineraries cleanly without competing for attention.
5. **Premium Restraint**: Elegance is achieved through precise spacing, strong typography, subtle borders, and smooth motion—never through heavy gradients or dense drop shadows.
6. **Functional Beauty**: Aesthetics always serve intuitive usability and fast task completion.

---

## 3. Brand Personality

* **Curious**: Inspires exploration and discovery of new places.
* **Adventurous**: Encourages authentic travel experiences.
* **Refined**: Polished visual execution with sophisticated layout details.
* **Welcoming**: Approachable, accessible, and intuitive for all users.
* **Confident**: Uncluttered interfaces that communicate trust and authority.
* **Relaxed**: Stress-free planning workflows.

---

## 4. Color System

The color system uses functional semantic design tokens to ensure visual harmony, proper contrast ratios, and effortless theme management.

### Color Tokens Palette

| Token Name | Role / Usage | Light Mode Value | Dark Mode Value |
| :--- | :--- | :--- | :--- |
| `bg-primary` | Main page background | `#FAFAFA` (Off-white) | `#0F172A` (Slate 900) |
| `bg-secondary` | Cards, elevated surfaces | `#FFFFFF` (Pure white) | `#1E293B` (Slate 800) |
| `bg-tertiary` | Subtle background highlights | `#F1F5F9` (Slate 100) | `#334155` (Slate 700) |
| `text-primary` | Primary headings & body text | `#0F172A` (Deep Slate) | `#F8FAFC` (Off-white) |
| `text-secondary` | Subtitles, secondary metadata | `#475569` (Slate 600) | `#94A3B8` (Slate 400) |
| `text-muted` | Captions, disabled labels | `#94A3B8` (Slate 400) | `#64748B` (Slate 500) |
| `border-default` | Card borders, dividers | `#E2E8F0` (Slate 200) | `#334155` (Slate 700) |
| `border-subtle` | Subtle element separation | `#F1F5F9` (Slate 100) | `#1E293B` (Slate 800) |
| `accent-primary` | Primary brand action color (Emerald) | `#0D9488` (Teal 600) | `#14B8A6` (Teal 500) |
| `accent-hover` | Hover state for brand actions | `#0F766E` (Teal 700) | `#2DD4BF` (Teal 400) |
| `accent-subtle` | Subtle brand backgrounds | `#CCFBF1` (Teal 100) | `#134E4A` (Teal 900) |
| `status-success` | Success feedback & badges | `#16A34A` (Green 600) | `#22C55E` (Green 500) |
| `status-warning` | Warning state indicators | `#D97706` (Amber 600) | `#F59E0B` (Amber 500) |
| `status-error` | Errors & destructive actions | `#DC2626` (Red 600) | `#EF4444` (Red 500) |

### Palette Usage Rules
* Default background is a warm off-white (`#FAFAFA`) to avoid harsh eye fatigue.
* Primary accent is a rich ocean teal (`#0D9488`), evoking travel, clarity, and calm.
* Avoid heavy neon hues or dark black backgrounds.

---

## 5. Typography

Typography creates the visual backbone of the editorial travel feel.

### Type Scale Specification

| Level | Size | Line Height | Weight | Tracking | Intended Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | 56px / 3.5rem | 1.1 | 700 (Bold) | -0.02em | Hero headlines & major editorial statements |
| **H1** | 40px / 2.5rem | 1.2 | 700 (Bold) | -0.01em | Destination detail titles, major page headings |
| **H2** | 32px / 2.0rem | 1.25 | 600 (SemiBold) | -0.01em | Section headers, card group titles |
| **H3** | 24px / 1.5rem | 1.3 | 600 (SemiBold) | 0.00em | Card titles, trip itinerary day headers |
| **H4** | 20px / 1.25rem | 1.4 | 600 (SemiBold) | 0.00em | Subsection titles, modal headers |
| **Body Large** | 18px / 1.125rem | 1.6 | 400 (Regular) | 0.00em | Editorial intro text, destination overviews |
| **Body Standard** | 16px / 1.0rem | 1.5 | 400 (Regular) | 0.00em | Primary body text, descriptions, review text |
| **Body Small** | 14px / 0.875rem | 1.4 | 400 (Regular) | 0.00em | Metadata, secondary labels, filter options |
| **Caption** | 12px / 0.75rem | 1.3 | 500 (Medium) | +0.02em | Image captions, subtle metadata badges |
| **Button** | 14px / 0.875rem | 1.0 | 600 (SemiBold) | +0.01em | Interactive button text |

---

## 6. Spacing System

Spacing follows an 8px grid scale for structural predictability, supplemented by a 4px micro scale.

```text
Space 1  (4px)   ── Micro spacing (badge padding, icon-text gap)
Space 2  (8px)   ── Tight element spacing
Space 3  (12px)  ── Compact inner card padding
Space 4  (16px)  ── Standard element padding / gap
Space 6  (24px)  ── Card padding, container gutters
Space 8  (32px)  ── Subsection spacing
Space 12 (48px)  ── Major section spacing
Space 16 (64px)  ── Large section breaks
Space 24 (96px)  ── Editorial hero section spacing
```

---

## 7. Layout System

### Container Bounds
* **Max Content Width**: `1280px` (`max-w-7xl`) centered with responsive horizontal padding.
* **Gutter Padding**: `16px` on Mobile, `24px` on Tablet, `32px` on Desktop.

### Grid Standards
* **Desktop Grid**: 12-column grid system with 24px gutters.
* **Tablet Grid**: 6-column grid with 20px gutters.
* **Mobile Grid**: 2-column or 1-column layout with 16px gutters.

---

## 8. Responsive Breakpoints

| Breakpoint Token | Min Width | Target Devices & Behavior |
| :--- | :--- | :--- |
| `sm` | `640px` | Large phones & small tablets; single column stacks expand to 2 columns. |
| `md` | `768px` | Tablets; navigation shifts, filter drawers convert to collapsible bars. |
| `lg` | `1024px` | Laptops & standard desktop; multi-column layouts, sidebars visible. |
| `xl` | `1280px` | Large desktop; full 12-column layout max-width reached. |

---

## 9. Border Radius

Restrained radius tokens maintain a modern, clean geometry without looking overly rounded:

* **Radius Small (`4px`)**: Badges, tooltips, subtle tags.
* **Radius Medium (`8px`)**: Form inputs, small buttons, thumbnail images.
* **Radius Large (`16px`)**: Destination cards, stay cards, modal dialogs.
* **Radius Full (`9999px`)**: Circular avatars, pill category buttons, save hearts.

---

## 10. Shadows & Elevation

Hierarchy is established primarily through **typography, spatial margins, and contrast** rather than heavy drop shadows.

* **Elevation Flat (`none`)**: Standard cards use subtle 1px border (`border-default`) on crisp background.
* **Elevation Soft (`0 2px 8px rgba(0,0,0,0.04)`)**: Subtle card hover state.
* **Elevation Floating (`0 8px 24px rgba(0,0,0,0.08)`)**: Dropdown menus, sticky search headers.
* **Elevation Overlay (`0 16px 48px rgba(0,0,0,0.16)`)**: Modal dialogs, mobile slide-up sheets.

---

## 11. Buttons

```text
[ Primary Action ]   [ Secondary Action ]   [ Ghost Action ]   [ Destructive Action ]
```

### Button Variants & Specs

| Variant | Background | Text Color | Border | Hover State | Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary** | `accent-primary` | White | None | `accent-hover` | 44px | Primary action per view (e.g. "Create Trip", "Search") |
| **Secondary** | `bg-secondary` | `text-primary` | `border-default` | `bg-tertiary` | 44px | Supporting actions (e.g. "Filters", "Cancel") |
| **Ghost** | Transparent | `text-primary` | None | `bg-tertiary` | 44px | Low-emphasis inline navigation |
| **Destructive** | `status-error` | White | None | Red 700 | 44px | Deleting trips or itinerary items |
| **Icon Button** | Transparent | `text-primary` | `border-default` | `bg-tertiary` | 40px / 44px | Save heart buttons, close icons |

---

## 12. Form Controls

* **Standard Input & Select**: 44px height, 8px radius, 1px border (`border-default`), clean focus ring in `accent-primary`.
* **Search Bar**: Elevated 52px height control with leading search icon, instant clear button (`×`), and integrated primary action button.
* **Checkboxes & Radios**: Custom accessible controls with 20x20px touch target and teal check states.

---

## 13. Cards

Cards are tailored specifically to content type:

### Card Variants

* **Destination Card**: Aspect ratio 4:3 image, destination title, country badge, star rating, save heart overlay in top-right corner.
* **Stay Card**: Aspect ratio 16:9 gallery thumbnail, property title, category badge, location, nightly price tier indicator, star rating.
* **Experience Card**: Aspect ratio 1:1 square or 4:3 image, title, duration indicator (e.g. "3 Hours"), price tier, save button.
* **Trip Card**: Wide banner card displaying destination hero image, trip title, date range, status badge (*Upcoming*, *Active*, *Completed*), and itinerary progress bar.
* **Review Card**: Compact card with user avatar, name, star rating component, date, and review text.

---

## 14. Image System

Photography is central to the visual identity of GO WITH US.

### Image Rules
* **Aspect Ratios**: Hero (`21:9` or `16:9`), Cards (`4:3` or `16:9`), Experience Thumbs (`1:1`).
* **Object Fit**: Standardize on `object-cover` with intentional focal-point positioning.
* **Loading Behavior**: Display low-quality blur placeholders (`blurDataURL`) during Next.js image loading to avoid visual layout shifts.
* **Corner Treatment**: Card imagery adopts the parent container's 16px radius with overflow clipping.

---

## 15. Navigation Components

* **Desktop Header**: Fixed/sticky top navbar (`64px` height) with backdrop blur filter (`backdrop-blur-md bg-white/80`).
* **Mobile Bottom Bar**: Fixed bottom bar (`56px` height) with 5 touch-friendly icons (44x44px target area) and active state indicator indicator dot.

---

## 16. Search UI

Search provides an interactive, instant feedback experience:

```text
Search Input Field ──► Live Suggestion Dropdown ──► Search Results Grid (Destinations, Stays, Experiences)
```

Includes clear loading skeleton rows and "No Results" recovery states with filter reset actions.

---

## 17. Filters

* **Desktop**: Collapsible left sidebar or top horizontal filter pill bar.
* **Mobile**: Slide-up **Bottom Sheet** drawer triggered by a sticky "Filters" button.

---

## 18. Badges & Metadata

Compact pills for category tags and status indicators:

* **Category Badge**: Light background (`bg-tertiary`), medium text, 4px radius.
* **Featured Badge**: Ocean teal background (`accent-subtle`), dark teal text.
* **Status Badge**: Dynamic color based on state (Green for *Active*, Slate for *Completed*, Amber for *Draft*).

---

## 19. Dialogs, Drawers & Sheets

* **Modal Dialogs**: Centered overlay for confirmation prompts and auth dialogs with background dimming (`bg-black/50`).
* **Mobile Bottom Sheets**: Slide-up sheet with top swipe indicator pill for mobile filter controls.

---

## 20. Feedback States

Every data-driven component implements five core feedback states:

1. **Default**: Rendered content view.
2. **Loading**: Animated skeleton placeholders matching the exact geometry of target cards.
3. **Empty**: Centered icon, friendly message, and primary CTA button (e.g. "Explore Destinations").
4. **Error**: Inline warning icon, clear error description, and "Retry" action.
5. **Success**: Toast popups confirming actions (e.g. "Added to Itinerary").

---

## 21. Trip & Itinerary UI

The itinerary workspace requires an organized, stress-free aesthetic:

```text
Day Header (e.g. "Day 1 — Friday, Oct 12")
├── Morning Block (08:00 AM)  ──► Item Card [ Custom Note / Activity ]
├── Afternoon Block (01:00 PM) ──► Item Card [ Stay Check-in ]
└── Evening Block (07:00 PM)   ──► Item Card [ Experience ]
```

Activities are rendered as clean horizontal cards with draggable handle icons, time tags, note summaries, and action menus.

---

## 22. Reviews & Ratings

* **Rating Display**: Clean 5-star rating graphic using filled teal stars for rating metrics.
* **Review Form**: Star picker control, textarea input with character counter, submit button.

---

## 23. Icons

* **Standard Library**: **Lucide Icons** (`lucide-react`) for consistent stroke width (1.75px default).
* **Standard Sizes**: `16px` (Inline metadata), `20px` (Buttons, inputs), `24px` (Navigation tabs).

---

## 24. Accessibility

* **Color Contrast**: Text colors meet WCAG AA minimum contrast ratio (4.5:1 for body text, 3:1 for large display text).
* **Focus Rings**: All interactive controls feature visible 2px focus rings (`focus-visible:ring-2 focus-visible:ring-teal-500`).
* **Touch Targets**: All clickable mobile elements meet the minimum `44x44px` touch size requirement.
* **Reduced Motion**: Respect system `prefers-reduced-motion` settings.

---

## 25. Interaction Principles

* **Tactile Hover**: Cards scale subtly (`scale-[1.01]`) or shift border color on desktop hover.
* **Instant State Feedback**: Heart icon toggles save state instantly prior to API round-trip.
* **Confirm Destructive Actions**: Deleting a trip or itinerary item requires explicit modal confirmation.

---

## 26. Visual Hierarchy Rules

Visual importance is structured in descending order:
1. Destination / Experience Hero Image & Title.
2. Primary Call-to-Action ("Save", "Add to Trip", "Create Trip").
3. Supporting Metadata (Dates, Location, Rating).
4. Secondary Actions & Navigation.

---

## 27. Editorial Layout Rules

To avoid monotonous, generic card grids, GO WITH US encourages editorial layout variations:
* **Asymmetric Feature Sections**: Pair a large 2-column hero card with a stacked 1-column list.
* **Full-Width Photography Breaks**: Interspersed high-impact visual banners between content groups.
* **Generous Section Padding**: 64px–96px vertical margins between major page sections.

---

## 28. Component Consistency Rules

* **Design Tokens Required**: No hardcoded arbitrary color values or inline pixel margins.
* **Reusable Components**: Shared UI elements (Cards, Badges, Buttons, Inputs) are maintained as single source-of-truth React components.

---

## 29. Performance-Aware Design

* **Optimized Image Assets**: Next.js `<Image>` component used universally with automatic WebP/AVIF formatting and responsive srcset sizing.
* **Zero Cumulative Layout Shift (CLS)**: Skeletons match exact final component dimensions.

---

## 30. Design Tokens Directory Layout

```text
src/design-system/
├── tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── radius.ts
│   └── shadows.ts
└── components/
    ├── Button.tsx
    ├── Card.tsx
    ├── Input.tsx
    ├── Modal.tsx
    └── Badge.tsx
```

---

## 31. Do / Don't

| DO | DON'T |
| :--- | :--- |
| **DO** use high-impact, authentic travel photography. | **DON'T** clutter pages with low-quality stock images or heavy ad banners. |
| **DO** maintain generous whitespace and calm layouts. | **DON'T** cram dense tabular data into every card. |
| **DO** rely on typography and contrast for visual hierarchy. | **DON'T** use excessive drop shadows or neon gradient overlays. |
| **DO** provide instant visual feedback on interactive state changes. | **DON'T** leave users guessing if an action was received. |
| **DO** test every page across mobile, tablet, and desktop views. | **DON'T** treat mobile as a shrunken desktop interface. |

---

## 32. Design System Governance

* Frontend developers must utilize established design tokens and reusable components.
* Introducing new color values, typography sizes, or custom spacing scale steps requires documented design system justification.

---

## 33. Final Design Direction

> **GO WITH US should feel like a premium digital travel magazine combined with a practical personal trip planner — immersive enough to inspire travel, structured enough to help users actually plan it.**
