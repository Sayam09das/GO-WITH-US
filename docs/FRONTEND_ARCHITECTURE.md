# GO WITH US — Frontend Architecture

This document defines the frontend architecture, component patterns, state management strategies, data fetching conventions, and development guidelines for the **GO WITH US** travel discovery and trip-planning platform.

---

## 1. Purpose

The frontend architecture of GO WITH US is engineered to deliver a fast, responsive, and visually engaging travel platform. It establishes clear architectural boundaries that allow initial UI development using local fixture data, transitioning smoothly to full REST API integration without component rewrites.

Key architectural goals:
* **Premium Travel UI**: Editorial typography, rich photography, and fluid responsive layouts.
* **Rapid Developer Velocity**: Feature-oriented component isolation and modular architecture.
* **Component Reusability**: Well-defined separation between UI primitives, domain cards, and page sections.
* **Performance & Accessibility**: Next.js App Router optimizations, low JS bundle footprint, and WCAG AA accessibility compliance.
* **Maintainability & Scalability**: Strict TypeScript interfaces preventing technical debt and schema drift.

---

## 2. Confirmed Frontend Stack

### Core Technologies
* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **UI Library**: React
* **Iconography**: Lucide Icons (`lucide-react`)

### Animation Libraries & Responsibilities
* **Motion** (`framer-motion` / `motion`): Responsible for standard component interactions, UI state transitions, enter/exit animations, tabs, modals, and drawers.
* **GSAP**: Responsible for complex coordinated timelines, scroll-linked storytelling, and hero visual sequences.
* **Lenis**: Responsible for smooth scrolling mechanics.

*Rule*: Animation responsibilities are strictly isolated; libraries must never duplicate or compete over the same element's motion behavior.

### Backend Context & API Protocol
* **Backend Runtime**: Node.js + TypeScript + Fastify
* **Database & Cache**: PostgreSQL + Redis + Workers
* **API Architecture**: REST API (`fetch()` HTTP client; **Axios is strictly prohibited**)

---

## 3. Architectural Principles

1. **Feature-Oriented Organization**: Code is structured around business domains (destinations, stays, experiences, trips, itinerary) rather than arbitrary file types.
2. **Reusable Primitives**: Core UI controls (buttons, inputs, cards, dialogs) are decoupled from backend business logic.
3. **Server-First Rendering**: Pages and content sections render as React Server Components (RSC) by default.
4. **Targeted Client Components**: Client components (`"use client"`) are used exclusively when browser APIs, local state, or interactive events are required.
5. **Separation of Concerns**: Presentation components remain free of inline data fetching or raw HTTP calls.
6. **Strict TypeScript Typing**: Shared domain interfaces govern all props, state, and API payload structures.
7. **Minimal Global State**: Prefer URL search params and server-fetched state over heavy global state stores.
8. **Progressive Enhancement**: Critical travel content remains visible and legible even if client scripts fail or lag.
9. **Accessibility by Default**: Keyboard orientation, semantic HTML tags, and ARIA attributes are designed directly into base components.
10. **Performance-Aware Implementation**: Code splitting, image lazy-loading, and zero CLS layout skeletons are mandatory.

---

## 4. Recommended Frontend Structure

```text
apps/web/
├── app/                           # Next.js App Router route segments
│   ├── layout.tsx                 # Root application layout
│   ├── page.tsx                   # Homepage route (/)
│   ├── destinations/              # Destination routes
│   │   ├── page.tsx               # /destinations directory
│   │   └── [slug]/page.tsx        # /destinations/[slug] profile
│   ├── stays/                     # Stay routes
│   │   ├── page.tsx               # /stays catalog
│   │   └── [slug]/page.tsx        # /stays/[slug] profile
│   ├── experiences/               # Experience routes
│   │   ├── page.tsx               # /experiences catalog
│   │   └── [slug]/page.tsx        # /experiences/[slug] profile
│   ├── search/                    # Unified search results route (/search)
│   ├── saved/                     # Saved places workspace route (/saved)
│   ├── trips/                     # Trip routes
│   │   ├── page.tsx               # /trips dashboard
│   │   ├── new/page.tsx           # /trips/new creation wizard
│   │   └── [tripId]/              # /trips/[tripId] overview & itinerary
│   │       ├── page.tsx           # Trip overview
│   │       └── itinerary/page.tsx # Day-by-day itinerary planner
│   ├── account/                   # Account management routes
│   ├── sign-in/                   # Sign in route (/sign-in)
│   └── sign-up/                   # Registration route (/sign-up)
│
├── components/                    # Modular React components
│   ├── ui/                        # Low-level UI primitives (Button, Input, Badge, Dialog)
│   ├── layout/                    # Layout wrappers (Navbar, MobileNav, Footer, Container)
│   ├── hero/                      # Hero section variants
│   ├── destinations/              # Destination-specific components (DestinationCard, Filter)
│   ├── stays/                     # Stay-specific components (StayCard, AmenityList)
│   ├── experiences/               # Experience-specific components (ExperienceCard)
│   ├── search/                    # Search bar & results grid components
│   ├── trips/                     # Trip management cards & summary widgets
│   ├── itinerary/                 # Day timeline, ActivityCard, SlotEditor
│   └── account/                   # Profile form, preference toggles
│
├── data/                          # Development mock data
│   └── fixtures/                  # Local TypeScript fixtures matching API schemas
│       ├── destinations.ts
│       ├── stays.ts
│       ├── experiences.ts
│       ├── trips.ts
│       └── reviews.ts
│
├── lib/                           # Core utilities & data access layer
│   ├── api/                       # REST client modules (using native fetch)
│   │   ├── client.ts              # Base fetch wrapper & error handler
│   │   ├── destinations.ts
│   │   ├── stays.ts
│   │   ├── experiences.ts
│   │   ├── trips.ts
│   │   └── saved.ts
│   └── utils/                     # Formatting helpers, classnames, date handlers
│
├── hooks/                         # Custom React hooks (useSaved, useTrip, useDebounce)
├── types/                         # Shared TypeScript domain definitions
│   ├── destination.ts
│   ├── stay.ts
│   ├── experience.ts
│   ├── trip.ts
│   └── user.ts
│
└── public/                        # Static public assets (images, icons, fonts)
```

---

## 5. App Router Architecture

The Next.js App Router orchestrates route segments, data boundaries, and layouts:

* **Nested Layouts (`layout.tsx`)**: Used at the root level for global navbar/footer, and in `/trips/[tripId]` for persistent trip header navigation.
* **Loading UI (`loading.tsx`)**: Automatic suspense boundaries rendering layout skeletons matching target page geometry.
* **Error Boundaries (`error.tsx`)**: Contextual error handling preventing isolated API failures from crashing the global application wrapper.
* **Not Found (`not-found.tsx`)**: Custom 404 pages rendered when slugs or trip IDs fail lookup queries.
* **Route Metadata (`metadata`)**: Dynamic SEO title, description, and OpenGraph tags generated via Server Components.

---

## 6. Server vs Client Components

### Prefer Server Components (RSC) for:
* Page layouts and structural wrappers.
* Content fetching and initial payload delivery.
* Destination detail content and editorial articles.
* Static visual cards and landing section composition.
* SEO-sensitive pages and metadata generation.

### Use Client Components (`"use client"`) for:
* Interactive form inputs and client validation.
* Search query inputs, debounced suggestions, and filter state updates.
* Save / Favorite toggle buttons.
* Drag-and-drop itinerary builders and timeline slot editors.
* Mobile navigation drawers, modal dialogs, and dropdown menus.
* Custom animation triggers using Motion or GSAP.

---

## 7. Component Architecture

The frontend separates components into three distinct layers:

```text
┌─────────────────────────────────────────────────────────┐
│                      Page Section                       │
│    (e.g., FeaturedDestinationsSection, HeroSection)     │
└────────────────────────────┬────────────────────────────┘
                             │ Composes
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Domain Component                     │
│         (e.g., DestinationCard, ItineraryItem)          │
└────────────────────────────┬────────────────────────────┘
                             │ Built with
                             ▼
┌─────────────────────────────────────────────────────────┐
│                       UI Primitive                      │
│            (e.g., Button, Badge, Input, Card)           │
└─────────────────────────────────────────────────────────┘
```

1. **UI Primitives (`components/ui`)**: Unstyled or base-styled atomic components (`Button`, `Input`, `Badge`, `Skeleton`, `Dialog`).
2. **Domain Components (`components/[feature]`)**: Feature-aware cards and lists (`DestinationCard`, `StayCard`, `ItineraryTimelineNode`).
3. **Page Sections (`components/[feature]/sections`)**: High-level page compositions (`FeaturedStaysSection`, `TripItineraryWorkspace`).

---

## 8. Page Composition

Pages act strictly as lightweight orchestrators of sections and components. Page files (`page.tsx`) must remain clean:

```tsx
// app/page.tsx (Server Component Example)
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedDestinationsSection } from "@/components/destinations/FeaturedDestinationsSection";
import { FeaturedStaysSection } from "@/components/stays/FeaturedStaysSection";
import { Footer } from "@/components/layout/Footer";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Navbar />
      <HeroSection />
      <FeaturedDestinationsSection />
      <FeaturedStaysSection />
      <Footer />
    </main>
  );
}
```

---

## 9. Data Architecture

During initial UI development, local fixture files provide realistic data structures matching future REST responses.

```text
Local Fixtures (data/fixtures/*.ts)
              │
              ▼
    React UI Components
              │
              ▼ (Post-backend launch)
     REST API Client (lib/api/*.ts)
```

### Fixture Guidelines
* Fixtures must strictly implement shared TypeScript interfaces from `@/types`.
* Mock data should contain realistic photography URLs, geographic details, prices, and ratings.

---

## 10. API Integration Architecture

All external backend interactions occur through a modular data-access layer using native `fetch()`.

* **Axios is strictly prohibited**.
* Requests use standard headers, credentials, and error wrappers.
* Endpoint contracts, envelopes, and status codes are defined in `docs/API_SPECIFICATION.md`.

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Request Failed: ${res.status}`);
  }

  return res.json();
}
```

---

## 11. Type Architecture

Shared TypeScript interfaces ensure data contracts remain identical across fixtures, API calls, and UI components:

```typescript
// types/destination.ts
export interface Destination {
  id: string;
  slug: string;
  title: string;
  country: string;
  region: string;
  heroImage: string;
  overview: string;
  highlights: string[];
  budgetTier: 'budget' | 'moderate' | 'luxury';
  bestTimeToVisit: string;
  rating: number;
  reviewCount: number;
  isSaved?: boolean;
}
```

*Strictness*: No implicit `any` types permitted.

---

## 12. State Management

State is kept as close to the consuming component as possible:

1. **Server State**: Data fetched on server components or managed via native SWR/React Server Component boundaries.
2. **Local Component State**: Standard `useState` / `useReducer` for UI toggles, active tabs, and temporary modal controls.
3. **URL Search Params**: Search queries, filter selections, active dates, and sorting options stored in the URL query string (`useSearchParams`).
4. **Context API**: Reserved strictly for universal session state (`AuthContext`) and theme preferences. Redux or heavy global stores are prohibited.

---

## 13. Search & Filter State

Search and filter controls reflect their state in URL parameters (`/search?q=paris&category=beach&budget=moderate`).

Benefits:
* Shareable and bookmarkable search URLs.
* Browser Back/Forward button history works naturally.
* Reloading the page preserves current filter results.

---

## 14. Forms

Forms follow a simple, accessible pattern:
* Controlled input states or native HTML form submission.
* Explicit `<label>` elements connected via `htmlFor`.
* Inline error messages displayed below inputs.
* Buttons disabled with loading spinner indicators during pending submissions.

---

## 15. Loading Architecture

Skeleton loaders preserve visual spatial constraints during data retrieval:

```tsx
// components/ui/Skeleton.tsx
export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-slate-200 p-4 h-[320px] w-full" />
  );
}
```

Never display blank white pages or screen-wide blocking spinners.

---

## 16. Error Architecture

Contextual error boundaries isolate component-level failures:

```text
API Request Fails ──► Error Boundary Catches ──► Render Error Box + [ Retry Button ]
```

Errors communicate: **What happened + What action the user can take next.**

---

## 17. Empty States

Data-driven lists without entries render custom Empty State components featuring:
1. Re-assuring visual icon or illustration.
2. Clear explanation text (e.g. "No saved places yet").
3. Direct action button (e.g. "Explore Destinations").

---

## 18. Image Architecture

All travel photography is delivered via Next.js `<Image>`:
* **Formats**: Auto-converted to WebP/AVIF.
* **Sizing**: Explicit `sizes` property specified to serve appropriate srcset sizes based on viewport.
* **Placeholders**: `placeholder="blur"` using lightweight blur Data URLs to prevent Cumulative Layout Shift (CLS).
* **Priority**: `priority` flag assigned exclusively to visible hero images above the fold.

---

## 19. Animation Architecture

Animation responsibilities are delegated strictly by scope:
* **Motion**: Component mount/unmount (`AnimatePresence`), hover scaling, modal transitions, mobile drawers.
* **GSAP**: Coordinated hero entrance timelines, scroll-linked pin animations.
* **Lenis**: Smooth page scroll orchestration.

*Note*: Detailed specifications reside in `docs/ANIMATION_GUIDELINES.md`.

---

## 20. Styling Architecture

Tailwind CSS serves as the utility styling engine, utilizing centralized tokens defined in `docs/DESIGN_SYSTEM.md`.

* Avoid arbitrary Tailwind inline values (`w-[387px]`); prefer design tokens (`max-w-md`).
* Use `clsx` or `tailwind-merge` (`cn()` utility) to handle conditional class merging.

---

## 21. Accessibility Architecture

* **Keyboard Focus**: Visible focus rings (`focus-visible:ring-2 focus-visible:ring-teal-500`) on all interactive controls.
* **Touch Targets**: Minimum target dimension of 44x44px on mobile viewports.
* **ARIA Support**: `aria-expanded` on dropdowns/drawers, `aria-label` on icon-only buttons (e.g., save hearts).
* **Reduced Motion**: Respect `prefers-reduced-motion` media queries.

---

## 22. Responsive Architecture

Design follows a mobile-first approach:
* Base styles target mobile viewports.
* `sm:`, `md:`, `lg:`, `xl:` prefixes progressively adapt layouts for tablet and desktop.
* Mobile navigation utilizes dedicated slide-up bottom sheets and fixed bottom tab bars.

---

## 23. SEO & Metadata

Public routes generate static and dynamic metadata:

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const destination = await getDestinationBySlug(params.slug);
  return {
    title: `${destination.title} Travel Guide | GO WITH US`,
    description: destination.overview,
    openGraph: {
      images: [destination.heroImage],
    },
  };
}
```

---

## 24. Performance

* **Bundle Control**: Tree-shake icons from `lucide-react`.
* **RSC First**: Keep client JavaScript bundles minimal by preferring Server Components.
* **Lazy Loading**: Dynamic imports (`next/dynamic`) for heavy non-critical components.

---

## 25. Security Considerations

* **Key Safety**: Never expose secret API keys or private tokens in `NEXT_PUBLIC_` environment variables.
* **Input Sanitization**: Escape user-generated review content to prevent XSS.
* **Session Storage**: Store session tokens in `httpOnly` secure cookies rather than raw `localStorage`.

---

## 26. Environment Configuration

```text
# .env.example
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 27. Testing Strategy

* **Component Tests**: Verify reusable UI primitives (Buttons, Cards, Inputs).
* **End-to-End Tests**: Validate key user flows (`Discover → Save → Create Trip → Add Itinerary Item`).

---

## 28. Code Quality Rules

1. Use strict TypeScript; no explicit `any`.
2. Small, focused components under 200 lines of code.
3. Clean imports using `@/` path aliases.
4. No dead code or unused variables.

---

## 29. Development Workflow

```text
Design System Tokens
         ↓
UI Primitives (Button, Input, Badge)
         ↓
Layout Wrappers (Navbar, Footer)
         ↓
Homepage & Discovery Pages (Fixtures First)
         ↓
Detail & Trip Planning Workspaces
         ↓
REST API Layer Integration
         ↓
Testing & Polish
```

---

## 30. Architecture Boundaries

```text
[ React Page / Section ]
         │
         ▼
[ Domain Component ] ──► Uses ──► [ UI Primitive ]
         │
         ▼
[ API Client Function (lib/api/*) ]
         │ (fetch)
         ▼
[ Node.js + Fastify REST API ]
```

UI components must never call `fetch()` directly inline; all requests route through `lib/api/`.

---

## 31. Anti-Patterns

* **NO Axios**: Use native `fetch()`.
* **NO Redux**: Use URL state, local state, or RSC.
* **NO Giant Client Components**: Do not place `"use client"` at page root unless required.
* **NO Inline Arbitrary Tailwind Colors**: Use design system tokens.
* **NO Duplicate Animation Libraries**: Do not mix Motion and GSAP on the same element.

---

## 32. Final Architecture Summary

```text
                             GO WITH US
                                  │
                          Next.js App Router
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
      Pages                  Components               Data Layer
  (RSC Layouts)           (Domain UI & Primitives)  (lib/api REST Client)
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼ (HTTP REST)
                         Node.js + Fastify Backend
                                  │
                             PostgreSQL
                                  │
                            Redis / Workers
```
