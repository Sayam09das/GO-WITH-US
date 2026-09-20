# GO WITH US — UI Component System

This document defines **which library owns which UI responsibility** so GO WITH US never ends up with five competing Button, Dialog, or Card implementations.

It complements `docs/DESIGN_SYSTEM.md` (colors, typography, spacing) and `docs/ANIMATION_GUIDELINES.md` (motion ownership). Those visual and motion rules are preserved — this document governs **component sourcing**.

---

## 1. Purpose

GO WITH US uses multiple UI sources intentionally. Each source has a narrow job. Install components **only when a screen needs them** — never bulk-install every registry.

---

## 2. UI Ownership Matrix

| Need | Owner | Install / use |
| :--- | :--- | :--- |
| **Base accessible components** | **shadcn/ui** | `pnpm dlx shadcn@latest add button` (etc.) |
| **Icons** | **Lucide** | `lucide-react` only |
| **Premium animated components** | **Magic UI** | Add via Magic UI registry when a screen needs them |
| **Special visual effects** | **VengeanceUI** | shadcn CLI + VengeanceUI registry URL |
| **Community / premium references** | **21st.dev** | Reference + adopt selectively; do not duplicate shadcn primitives |
| **Design intelligence / UI guidance** | **UI/UX Pro Max** | Workflow guidance during implementation (Cursor / design review) |
| **Component interactions** | **Motion** | Tabs, modals, drawers, save toggles, layout transitions |
| **Complex editorial animation** | **GSAP** | Hero timelines, scroll-linked editorial moments |
| **Smooth scrolling** | **Lenis** | Global scroll only |
| **Styling** | **Tailwind CSS** | Utility classes + design tokens in `globals.css` |
| **Global client state** | **None (no Redux)** | URL params, local state, RSC |
| **Server / data state** | **Next.js + fetch** | `lib/api/*` |

---

## 3. Non-Negotiable Rules

1. **One owner per primitive** — Button, Input, Dialog, Card, Sheet, Dropdown, Badge, Skeleton come from **shadcn/ui** unless explicitly listed otherwise below.
2. **No Axios** — native `fetch()` only.
3. **No Redux** — no global client store for MVP.
4. **No duplicate libraries** — do not add a second dialog system, icon pack, or button library.
5. **Preserve design tokens** — map shadcn theme variables to existing CSS variables in `apps/web/app/globals.css`. Do not replace finished colors or typography.
6. **Lucide only** — never mix Heroicons, Font Awesome, or other icon sets in product UI.

---

## 4. shadcn/ui — Primary Foundation

**Location:** `apps/web/components/ui/*`

**Owns:**
- Button, Input, Textarea, Select, Checkbox, Radio, Label
- Dialog, Sheet, Drawer, Popover, Dropdown Menu, Tooltip
- Card, Badge, Avatar, Separator, Skeleton
- Tabs, Accordion, Navigation Menu
- Form primitives (with React Hook Form when forms are built)

**Configuration:** `apps/web/components.json`

**Utilities:** `apps/web/lib/utils.ts` (`cn()`)

**Install example:**
```bash
cd apps/web
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog card input
```

---

## 5. VengeanceUI — Special Visual Effects

**Owns:** Decorative / atmospheric effects only (e.g. animated rays, glow backgrounds, shader-like accents).

**Does NOT own:** Buttons, forms, dialogs, navigation, cards, or layout primitives.

**Install via shadcn registry URL:**
```bash
cd apps/web
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/Ashutoshx7/VengeanceUI/main/public/r/animated-rays.json
```

**Registry alias (also supported):**
```bash
pnpm dlx shadcn@latest add @vengeanceui/animated-rays
```

**Placement:** `apps/web/components/effects/*` or path defined by the registry item. Wrap in a client component; never replace shadcn Dialog/Button with VengeanceUI equivalents.

---

## 6. Magic UI — Premium Animated Components

**Owns:** Marketing-grade animated blocks (marquees, bento reveals, border beams, text effects) when a page spec calls for them.

**Does NOT own:** Core app chrome (navbar, forms, trip workspace controls).

**Rule:** If Magic UI ships internal Motion usage, treat the component as a black box. Do not also animate the same node with GSAP or a second Motion wrapper.

**Install:** Add individual Magic UI components through their documented shadcn-compatible registry when needed — not all at once.

---

## 7. 21st.dev — Reference & Selective Adoption

**Owns:** Nothing by default.

**Use for:** Inspiration and vetted community patterns (hero variants, card layouts, micro-interactions).

**Cursor MCP (installed):** `.cursor/mcp.json` connects the 21st.dev server. Set `API_KEY_21ST` in `.cursor/.env` (gitignored) or your shell environment, then restart Cursor.

**Init command (already run):**
```bash
cd apps/web
npx @21st-dev/cli init --client cursor --write
```

**Rule:** Before copying a 21st.dev component:
1. Check if shadcn/ui already covers the primitive.
2. Adapt styling to GO WITH US tokens (Manrope, Playfair Display, orange accent system).
3. Place domain-specific compositions in `apps/web/components/<feature>/`, not `components/ui/`.

---

## 8. UI/UX Pro Max — Design Workflow Guidance

**Owns:** Process, not runtime code.

**Installed (Cursor):** `.cursor/skills/` via:
```bash
npx ui-ux-pro-max-cli init --ai cursor
```

**Use during:** Navbar, homepage, discovery, and itinerary UI implementation.

**Apply for:**
- Visual hierarchy checks
- Spacing and scan-path review
- Accessibility and responsive behavior review
- Premium editorial tone (avoid booking-marketplace patterns)

Consult before merging major UI surfaces. Does not replace `docs/DESIGN_SYSTEM.md` or `docs/PAGE_SPECIFICATIONS.md`.

---

## 9. Lucide — Icons

**Package:** `lucide-react`

**Owns:** All icons across navbar, cards, filters, itinerary, account.

**Sizes:** 16px inline metadata · 20px controls · 24px navigation

Icon-only buttons require `aria-label`.

---

## 10. Component Folder Structure

```text
apps/web/
├── components/
│   ├── ui/              ← shadcn/ui primitives ONLY
│   ├── effects/         ← VengeanceUI & similar visual effects
│   ├── magic/           ← Magic UI animated blocks (when added)
│   ├── layout/          ← Navbar, Footer, Container (Phase 2+)
│   ├── hero/            ← Editorial hero sections (Phase 2+)
│   └── <feature>/       ← Domain cards & sections
├── lib/
│   ├── utils.ts         ← cn()
│   └── animation/       ← Lenis provider, GSAP helpers (when added)
```

---

## 11. Decision Flow — Before Adding a Component

```text
Need a UI element?
        │
        ▼
Is it a standard primitive (button, input, dialog, card)?
   YES ──► shadcn/ui
   NO
        │
        ▼
Is it a decorative effect / atmosphere?
   YES ──► VengeanceUI (via registry URL)
   NO
        │
        ▼
Is it a premium animated marketing block?
   YES ──► Magic UI (single component, when needed)
   NO
        │
        ▼
Is it motion for an existing shadcn component?
   YES ──► Motion (wrap shadcn, do not fork the primitive)
   NO
        │
        ▼
Is it editorial scroll / hero timeline?
   YES ──► GSAP
   NO
        │
        ▼
Compose with shadcn + Tailwind in feature folder
```

---

## 12. Anti-Patterns

| Do NOT | Do instead |
| :--- | :--- |
| Install Button from Magic UI, VengeanceUI, and shadcn | shadcn Button only |
| Add MUI, Chakra, or Ant Design | shadcn + Tailwind |
| Add a second icon library | Lucide |
| Animate the same node with Motion + GSAP | One library per node |
| Bulk-install every registry item | Add per screen need |
| Replace `globals.css` tokens with shadcn defaults | Map shadcn to existing variables |

---

## 13. Related Documents

* `docs/DESIGN_SYSTEM.md` — colors, typography, spacing (preserved)
* `docs/ANIMATION_GUIDELINES.md` — Motion, GSAP, Lenis, Magic UI, VengeanceUI motion rules
* `docs/FRONTEND_ARCHITECTURE.md` — app structure and data layer
* `docs/PAGE_SPECIFICATIONS.md` — page-level UI specs (Phase 2+)
