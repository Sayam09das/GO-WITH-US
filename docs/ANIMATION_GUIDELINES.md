# GO WITH US — Animation Guidelines

This document defines the motion language, animation hierarchy, library ownership rules, and performance guidelines for **GO WITH US**.

---

## 1. Purpose

Animation in GO WITH US enhances visual storytelling, provides physical feedback for user actions, and establishes a calm, premium travel feel. Motion must always support usability and content comprehension—it must never exist solely as distraction or decorative noise.

---

## 2. Animation Philosophy

1. **Hierarchy & Structure**: Motion reinforces page layout relationships and spatial orientation.
2. **Feedback**: Micro-animations confirm clicks, save toggles, and form submissions instantly.
3. **Calm Restraint**: Animations are smooth, controlled, and quiet. Bouncy or hyperactive motion is strictly prohibited.
4. **Natural Reveals**: Content enters the viewport naturally via subtle fades and small translates.
5. **Image Respect**: Photography motion must never blur, stretch, or degrade visual image clarity.

---

## 3. UI & Animation Library Stack

GO WITH US combines UI component sources with motion libraries. Each layer has a single owner. See `docs/UI_COMPONENT_SYSTEM.md` for full component ownership.

| Layer | Library | Role |
| :--- | :--- | :--- |
| Base components | **shadcn/ui** | Accessible Button, Dialog, Card, Input, etc. |
| Icons | **Lucide** | All product icons |
| Premium animated blocks | **Magic UI** | Marketing-grade animated sections (add per need) |
| Visual effects | **VengeanceUI** | Decorative effects via shadcn registry (e.g. animated rays) |
| Component motion | **Motion** | shadcn wrapper transitions, tabs, drawers, save toggles |
| Editorial motion | **GSAP** | Hero timelines, scroll-linked storytelling |
| Smooth scroll | **Lenis** | Global scroll only |
| Styling | **Tailwind CSS** | Utilities + `globals.css` tokens |

**Install VengeanceUI effects (example):**
```bash
cd apps/web
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/animated-rays.json
```

Do not install Magic UI or VengeanceUI components that duplicate shadcn primitives (Button, Dialog, Card).

---

## 4. Animation Technology Responsibilities

GO WITH US utilizes distinct animation tools, each assigned exclusive responsibilities:

### 1. Motion (`motion` / `framer-motion`)
* **Scope**: React component-level UI state transitions on **shadcn/ui** components.
* **Use Cases**: Component mount/unmount (`AnimatePresence`), hover states, modal dialogs, mobile slide-up sheets, tab switches, dropdown menus, and save heart toggles.

### 2. GSAP
* **Scope**: Advanced visual timelines and scroll-driven editorial moments.
* **Use Cases**: Coordinated hero visual sequences, complex image mask unveils, and scroll-linked storytelling sections.

### 3. Lenis
* **Scope**: Global smooth scrolling.
* **Use Cases**: Normalizing scroll wheel dynamics for fluid visual pacing.

### 4. Magic UI
* **Scope**: Self-contained premium animated components (marquees, beams, text effects).
* **Use Cases**: Homepage editorial sections and marketing moments when page specs call for them.
* **Rule**: Treat Magic UI as a sealed unit. Do not wrap the same DOM node with Motion or GSAP.

### 5. VengeanceUI
* **Scope**: Atmospheric visual effects (background rays, glow layers, shader accents).
* **Use Cases**: Hero backgrounds and editorial accent layers — never buttons, forms, or dialogs.
* **Install**: shadcn CLI + VengeanceUI registry URL (see Section 3).

*Rule*: Motion responsibilities are strictly isolated. Libraries must never animate the same DOM node simultaneously.

---

## 5. Animation Ownership Rule

| Interaction / Element | UI Source | Animation Owner |
| :--- | :--- | :--- |
| Button / Input / Form | shadcn/ui | **Motion** (hover/focus micro) |
| Dialog / Sheet / Drawer | shadcn/ui | **Motion** |
| Card (discovery) | shadcn/ui + Tailwind | **Motion** (hover) |
| Mobile Filter Sheet | shadcn/ui Sheet | **Motion** |
| Save Heart Toggle | shadcn/ui Button or icon | **Motion** |
| Premium text / beam effect | Magic UI | **Magic UI internal** |
| Hero background rays | VengeanceUI | **VengeanceUI internal** |
| Hero Timeline Sequence | — | **GSAP** |
| Editorial Image Mask Unveil | — | **GSAP** |
| Global Page Scroll Dynamics | — | **Lenis** |

---

## 6. Motion Hierarchy

* **Micro Motion (100ms – 180ms)**: Button hover, icon state change, bookmark heart toggle.
* **Component Motion (180ms – 300ms)**: Card viewport entrance, search dropdown, filter drawer toggle.
* **Editorial Motion (300ms – 700ms)**: Hero background transition, large image reveal sequence.

---

## 7. Timing Guidelines

```text
Micro Interactions   ──► 100ms to 180ms (Instant feedback)
Component Transitions ──► 180ms to 280ms (Swift & responsive)
Dialogs & Drawers    ──► 280ms to 400ms (Smooth physical entry)
Hero & Editorial     ──► 500ms to 800ms (Paced storytelling)
```

---

## 8. Easing

* **Entrance**: `easeOut` (`[0.0, 0.0, 0.2, 1.0]`) — Elements enter quickly and settle smoothly.
* **Exit**: `easeIn` (`[0.4, 0.0, 1.0, 1.0]`) — Elements leave swiftly without drawing attention.
* **Reversible**: `easeInOut` (`[0.4, 0.0, 0.2, 1.0]`) — Smooth linear transitions for toggles.

*Avoid*: Excessive elastic or spring bounce easing.

---

## 9. Page Entrance

Pages load without blocking script delays:
1. Hero background photo settles smoothly (`scale 1.03 → 1.0`).
2. Main heading fades up (`opacity 0 → 1`, `translateY 12px → 0px`).
3. Search input and supporting UI enter sequentially.

---

## 10. Hero Animation

* Hero image uses subtle initial scale reduction (`1.04` to `1.0`) over 800ms.
* Search bar container enters with soft shadow elevation.

---

## 11. Scroll Reveal

* Cards and section titles fade up when entering the viewport threshold (trigger at 15% viewport height).
* Stagger timing is capped at `0.05s` delay per item to prevent artificial loading feel.

---

## 12. Image Animation

* Destination card photos scale subtly (`scale-105`) on desktop hover.
* Transitions use GPU-accelerated CSS transforms (`transition-transform duration-500 ease-out`).

---

## 13. Destination Card Motion

Hovering a destination card subtly scales the cover image while keeping title text and save buttons firmly anchored.

---

## 14. Stay & Experience Card Motion

* Slight image zoom on desktop hover.
* Touch devices skip hover scaling in favor of instant touch press highlights.

---

## 15. Navigation Animation

* Navbar condenses padding slightly upon scroll past 50px threshold.
* Mobile bottom nav bar items highlight with subtle spring indicator dots on active tab switch.

---

## 16. Search Animation

Search input expansion and dropdown suggestion lists animate seamlessly with Motion (`AnimatePresence`).

---

## 17. Save / Favorite Animation

Toggling a save heart triggers an instant micro-scale pulse (`scale: [1, 1.25, 1]`) in 150ms before resolving state.

---

## 18. Trip & Itinerary Animation

* Adding or reordering itinerary items uses smooth layout transitions (`layoutId` or Motion layout transitions).
* Removing an item fades it out (`opacity: 0`, `height: 0`) over 200ms before collapse.

---

## 19. Modal / Dialog / Sheet Motion

* **Modals**: Backdrop fades in (`opacity 0 → 0.5`), modal container scales up (`scale 0.95 → 1.0`).
* **Mobile Sheets**: Slide up vertically from screen bottom (`translateY 100% → 0%`).

---

## 20. Stagger Animations

Limit staggered card group reveals to a maximum of 4 items to ensure lower-end devices render without frame drops.

---

## 21. Hover Philosophy

Desktop hover states communicate affordance via clear visual feedback (subtle color shift, image zoom, or slight translate).

---

## 22. Parallax

Parallax is restricted exclusively to hero visual breaks and editorial destination stories, maintaining low movement ratios (`0.15x` scroll speed).

---

## 23. Page Transitions

Route changes transition smoothly without full-screen blocking overlay loaders.

---

## 24. Loading Animations

Skeleton components utilize smooth opacity pulsing (`animate-pulse bg-slate-200`) matching exact layout boundaries.

---

## 25. Reduced Motion

```typescript
// Respect user system preferences
const shouldReduceMotion = useReducedMotion();

const animationVariants = {
  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
  visible: { opacity: 1, y: 0 },
};
```
When `prefers-reduced-motion: reduce` is detected, transform translations and parallax effects are completely disabled.

---

## 26. Mobile Animation

Mobile devices execute lightweight animations with reduced movement distances and zero heavy scroll listeners.

---

## 27. Performance Rules

* Animate ONLY GPU-accelerated properties: `transform` (`translate3d`, `scale`) and `opacity`.
* Never animate layout geometry properties (`width`, `height`, `top`, `left`, `margin`, `padding`).

---

## 28. Image & Animation Performance

Images lazy-load before scroll-reveal triggers fire to prevent unstyled image jumps.

---

## 29. Accessibility

Motion must never obscure interactive focus rings or impede screen reader operation.

---

## 30. Animation & Content Hierarchy

Primary headlines and main hero visuals animate first; secondary metadata follows.

---

## 31. Animation Anti-Patterns

* **NO** bouncy spring animations on buttons.
* **NO** 3D card flips or rotation tricks.
* **NO** competing libraries animating the same DOM node.
* **NO** animating layout properties (`width`, `height`).
* **NO** Magic UI or VengeanceUI components replacing shadcn Button, Dialog, or Card.
* **NO** wrapping a Magic UI or VengeanceUI effect with Motion or GSAP on the same DOM node.

---

## 32. Animation Intensity by Product Area

| Product Area | Motion Intensity | Primary Library |
| :--- | :--- | :--- |
| **Navbar** | Low | Motion |
| **Hero** | High | GSAP / Motion |
| **Destination Discovery** | Medium | Motion |
| **Destination Details** | Medium–High | GSAP / Motion |
| **Stay & Experience Discovery** | Medium | Motion |
| **Search & Filters** | Low | Motion |
| **Saved Places** | Low | Motion |
| **Trips Dashboard** | Low | Motion |
| **Itinerary Workspace** | Medium | Motion |
| **Account & Settings** | Low | Motion |

---

## 33. Animation Implementation Checklist

1. Does this motion enhance clarity or feedback?
2. Is the library owner clearly identified (Motion, GSAP, or Lenis)?
3. Are only `transform` and `opacity` animated?
4. Is `prefers-reduced-motion` supported?
5. Does it execute at 60fps on mobile viewports?

---

## 34. Animation Design Language

> **Smooth → Spacious → Natural → Editorial → Intentional**

---

## 35. Final Rule

**Content and usability always come first. Animation exists to make travel discovery immersive and trip planning natural.**
