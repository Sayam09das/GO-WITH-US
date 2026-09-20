# GO WITH US — SEO Foundation

This document defines the technical and editorial SEO architecture for **GO WITH US**. It complements:

* `docs/CONTENT_GUIDELINES.md` — tone, title copy patterns, alt text rules
* `docs/INFORMATION_ARCHITECTURE.md` — routes, URL structure, public vs protected pages
* `docs/PAGE_SPECIFICATIONS.md` — page-level content and semantic HTML expectations
* `docs/FRONTEND_ARCHITECTURE.md` — App Router implementation patterns

**Core principle:** GO WITH US ranks through useful travel content and clean technical SEO — not keyword stuffing, fake urgency, or booking-marketplace patterns.

---

## 1. Purpose

SEO exists to help travelers discover meaningful destination, stay, and experience pages — and to understand what GO WITH US is: a discovery and trip-planning platform, not an OTA.

Goals:

1. Make public discovery pages crawlable, indexable, and shareable.
2. Protect private user workspaces from accidental indexing.
3. Keep metadata natural, accurate, and aligned with on-page content.
4. Prepare for future multilingual expansion without rewriting the metadata system.

---

## 2. Metadata Architecture

All metadata flows through **Next.js App Router** `Metadata` / `generateMetadata()` in Server Components.

### Layers

| Layer | Owner | Scope |
| :--- | :--- | :--- |
| **Root defaults** | `app/layout.tsx` | Site name, default description, `metadataBase`, icons, default OG/Twitter, robots defaults |
| **Section layouts** | `app/(discover)/layout.tsx` (future) | Shared patterns for catalog pages |
| **Route metadata** | `page.tsx` | Static `metadata` export for fixed pages |
| **Dynamic metadata** | `[slug]/page.tsx` | `generateMetadata()` from fixture/API data |
| **Helpers** | `lib/seo/metadata.ts` | Title templates, canonical URLs, OG/Twitter builders |

### Rules

1. **One canonical metadata source per route** — build via `buildPageMetadata()`; do not hand-roll duplicate tags.
2. **Metadata must match visible content** — title and description reflect the actual `h1` and lead copy on the page.
3. **No keyword stuffing** — write for humans first; search engines second.
4. **Protected routes default to `noindex`** — see §14.
5. **Never expose secrets in metadata** — only public URLs and public content.

### Environment

```text
NEXT_PUBLIC_SITE_URL=https://gowithus.com   # production canonical origin
```

Local development uses `http://localhost:3000`. All canonical URLs are absolute, derived from `NEXT_PUBLIC_SITE_URL`.

---

## 3. Title Templates

Use the `buildPageTitle()` helper. Keep titles concise (50–60 characters ideal; hard cap ~70).

| Page type | Pattern | Example |
| :--- | :--- | :--- |
| **Home** | `GO WITH US — Travel Discovery & Trip Planning` | Fixed |
| **Catalog** | `{Section} | GO WITH US` | `Destinations \| GO WITH US` |
| **Destination detail** | `{Name} Travel Guide \| GO WITH US` | `Kyoto Travel Guide \| GO WITH US` |
| **Stay detail** | `{Name} — Stay in {City} \| GO WITH US` | `Hôtel Particulier — Stay in Paris \| GO WITH US` |
| **Experience detail** | `{Name} in {City} \| GO WITH US` | `Sunrise Temple Walk in Kyoto \| GO WITH US` |
| **Search** | `Search results for "{query}" \| GO WITH US` | When query present |
| **Search (empty)** | `Search \| GO WITH US` | Default |
| **Auth** | `{Action} \| GO WITH US` | `Sign In \| GO WITH US` |
| **Not found** | `Page not found \| GO WITH US` | 404 only |

### Anti-patterns

* `"Best Cheap Hotels Kyoto Japan Book Now Discount"` — keyword spam
* `"ONLY 3 ROOMS LEFT — Kyoto Hotels!!!"` — fake urgency
* Repeating the brand name twice in one title
* Titles that promise booking when the product is discovery/planning only

---

## 4. Descriptions

Target **140–160 characters**. One clear sentence about what the page offers.

### Patterns

| Page type | Guidance |
| :--- | :--- |
| **Home** | What GO WITH US is + primary user benefit |
| **Catalog** | What the traveler can browse and why it helps planning |
| **Destination** | Region character + what to explore (from `overview`, trimmed) |
| **Stay** | Property character + location context (not fake pricing) |
| **Experience** | Activity essence + who it suits |
| **Search** | Reflect query intent when present |

### Rules

1. Pull from real content fields (`overview`, `summary`, `description`) — never invent facts.
2. Trim gracefully at word boundaries; never cut mid-word.
3. Do not repeat the title verbatim in the description.
4. Avoid superlatives unless supported by editorial content on the page.

---

## 5. Canonical URLs

Every **indexable public page** sets `alternates.canonical` to its clean URL.

```text
https://gowithus.com/destinations/kyoto-japan
https://gowithus.com/stays/hotel-particulier-paris
https://gowithus.com/experiences/sunrise-temple-walk-kyoto
```

### Rules

1. **Lowercase slugs** — `kyoto-japan`, not `Kyoto-Japan`.
2. **No trailing slashes** on canonical paths (except root `/`).
3. **No query params in canonical** — `/search?q=kyoto` canonicalizes to `/search` unless a dedicated filtered landing is intentional (MVP: canonical to `/search`).
4. **Pagination** (future): page 1 canonical to base; page 2+ may self-canonical or use `rel="prev/next"` when pagination ships.
5. **HTTP → HTTPS** and **www → non-www** (or chosen primary) enforced at deployment/CDN layer.

---

## 6. Open Graph

Default OG tags at root; route-level overrides for detail pages.

| Property | Default | Detail override |
| :--- | :--- | :--- |
| `og:title` | Page title | Entity name + context |
| `og:description` | Page description | Entity summary |
| `og:url` | Canonical URL | Same |
| `og:site_name` | `GO WITH US` | Same |
| `og:type` | `website` | `website` for catalogs; consider `article` for editorial destination guides |
| `og:locale` | `en_US` | Same until i18n |
| `og:image` | `/opengraph-image` (generated) | Entity hero image when available |

### Image rules

1. Minimum **1200×630** for custom hero OG images.
2. Alt text on OG images is not required by spec but hero images on-page must have alt text.
3. Fallback to site default OG when entity image is missing.
4. Use absolute URLs in metadata (`metadataBase` handles this).

---

## 7. Twitter / X Cards

Use **`summary_large_image`** for detail pages with hero imagery; **`summary`** for utility pages.

| Tag | Source |
| :--- | :--- |
| `twitter:card` | `summary_large_image` or `summary` |
| `twitter:title` | Same as OG title |
| `twitter:description` | Same as OG description |
| `twitter:image` | Same as OG image |

No separate Twitter copy unless platform-specific length limits require trimming (rare).

---

## 8. robots.txt

Implemented via `app/robots.ts`. Policy:

### Allow

* `/`
* `/destinations`, `/destinations/*`
* `/stays`, `/stays/*`
* `/experiences`, `/experiences/*`
* `/search`
* `/sign-in`, `/sign-up` (optional index — default **noindex** for auth)

### Disallow

* `/saved`
* `/trips`, `/trips/*`
* `/account`, `/account/*`
* `/api/*` (if any app routes exist)
* `/_next/*` (implicit via Next.js)

### Sitemap reference

```text
Sitemap: https://gowithus.com/sitemap.xml
```

---

## 9. sitemap.xml

Implemented via `app/sitemap.ts`.

### Included (indexable)

| URL | Priority | Change frequency |
| :--- | :--- | :--- |
| `/` | 1.0 | weekly |
| `/destinations` | 0.9 | weekly |
| `/stays` | 0.9 | weekly |
| `/experiences` | 0.9 | weekly |
| `/destinations/[slug]` | 0.8 | monthly |
| `/stays/[slug]` | 0.8 | monthly |
| `/experiences/[slug]` | 0.8 | monthly |

### Excluded

* Protected routes (`/saved`, `/trips/*`, `/account/*`)
* Auth pages
* Search with query params
* 404 / error responses

Dynamic entries are generated from fixtures (MVP) and API (production). Slugs must match `INFORMATION_ARCHITECTURE.md`.

---

## 10. Favicon & App Icons

| Asset | Path / file | Notes |
| :--- | :--- | :--- |
| Favicon | `app/icon.tsx` | Generated SVG favicon |
| Apple touch icon | `app/apple-icon.tsx` | 180×180 |
| Default OG | `app/opengraph-image.tsx` | 1200×630 branded fallback |

When a custom brand mark ships, replace generated icons with designed assets in `public/` and update metadata references.

---

## 11. Semantic HTML Rules

Public pages must use meaningful structure:

```html
<main>
  <header>        <!-- page intro, optional breadcrumb -->
  <article>       <!-- primary content on detail pages -->
  <section>       <!-- grouped content blocks -->
  <nav>           <!-- in-page or breadcrumb nav -->
  <aside>         <!-- supplementary filters or related items -->
  <footer>        <!-- page-level footer content if any -->
</main>
```

### Requirements

1. **Exactly one `<h1>` per page** — matches the primary page topic.
2. **Logical heading order** — no skipped levels (`h1 → h3` without `h2`).
3. **Lists for lists** — use `<ul>`/`<ol>` for feature lists, itinerary items, filters.
4. **Real links for navigation** — crawlable `<a href>` for primary nav; avoid JS-only navigation for SEO-critical paths.
5. **Buttons for actions** — "Save", "Add to trip" are actions, not navigation (use `<button>` or `<Link>` appropriately).

---

## 12. Heading Hierarchy

| Page type | h1 | h2 examples | h3 examples |
| :--- | :--- | :--- | :--- |
| **Home** | Brand promise / hero headline | Featured destinations, Plan your trip | Individual card titles |
| **Catalog** | Section name (`Destinations`) | Filter groups, regions | Card titles |
| **Destination detail** | Destination name | Overview, Where to stay, Experiences | Sub-section labels |
| **Stay detail** | Stay name | About, Location, Nearby | Amenity groups |
| **Experience detail** | Experience name | What to expect, Good to know | Detail labels |

Card titles inside grids may use `h2` or `h3` depending on page depth — but never duplicate the page `h1`.

---

## 13. Image Alt Strategy

Follow `docs/CONTENT_GUIDELINES.md` §33.

| Image type | Alt text |
| :--- | :--- |
| **Hero** | Describe scene + location context |
| **Card thumbnail** | Subject + place name |
| **Decorative** | `alt=""` |
| **Icons** | Visible text nearby, or `aria-label` on control |
| **User avatars** | Person's name or "Your profile" |

Never use filename-based alt (`photo123.jpg`). Never stuff keywords.

---

## 14. JSON-LD / Schema Architecture

Render via `<JsonLd />` from `components/seo/json-ld.tsx`. One `@graph` or multiple scripts per page — keep valid and non-duplicative.

### Site-wide (home)

* **`WebSite`** — name, url, description, `SearchAction` pointing to `/search?q={query}`

### Catalog pages

* **`ItemList`** — list of entities on the page (when data available)
* **`BreadcrumbList`** — Home → Section

### Destination detail

* **`TouristDestination`** or **`Place`** — name, description, image, geo (when coordinates exist)
* **`BreadcrumbList`** — Home → Destinations → {Name}

### Stay detail

* **`LodgingBusiness`** — name, description, image, address (when available)
* **`BreadcrumbList`**

### Experience detail

* **`TouristAttraction`** or **`Event`** (for timed experiences) — name, description, location
* **`BreadcrumbList`**

### Rules

1. JSON-LD data must match visible page content.
2. Do not add `AggregateRating` or `Offer` until real review/price data exists.
3. Do not mark up protected/private pages.

---

## 15. Destination / Stay / Experience Page SEO

Each public detail page implements:

1. `generateMetadata()` — title, description, canonical, OG, Twitter
2. Semantic HTML — single `h1`, structured sections
3. JSON-LD — entity schema + breadcrumbs
4. Internal links — related stays/experiences in destination context
5. Hero image with descriptive alt text

### Slug format

```text
/destinations/{city-region-country}     → kyoto-japan, paris-france
/stays/{property-name-city}             → hotel-particulier-paris
/experiences/{activity-name-city}       → sunrise-temple-walk-kyoto
```

Slugs are stable — if content renames, implement 301 redirects (post-MVP infrastructure).

---

## 16. Dynamic Metadata for `[slug]` Pages

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return buildNotFoundMetadata();

  return buildPageMetadata({
    title: buildDestinationTitle(destination.name),
    description: trimDescription(destination.overview),
    path: `/destinations/${slug}`,
    ogImage: destination.heroImage,
    ogType: "website",
  });
}
```

If entity is not found, return not-found metadata and render `notFound()`.

---

## 17. Not-Found Handling

* **Global:** `app/not-found.tsx` — helpful message, link home, link to `/destinations`
* **Metadata:** `noindex, follow` — do not index 404 URLs
* **HTTP status:** 404 (Next.js default for `notFound()`)
* **JSON-LD:** none on 404

For invalid slugs on detail routes, call `notFound()` from the page — do not soft-200 empty pages.

---

## 18. Loading & Error SEO Considerations

| State | SEO behavior |
| :--- | :--- |
| **`loading.tsx`** | No metadata change; streaming shows skeleton; canonical unchanged |
| **`error.tsx`** | Client boundary; parent metadata persists; do not index error states as separate URLs |
| **Empty catalog** | Still indexable if page has unique purpose; honest empty copy |
| **Soft 404** | Forbidden — missing slug must hard 404 |

Loading UI must not replace `h1` with spinners permanently — skeleton → content swap preserves structure.

---

## 19. Crawlable Navigation

Primary nav links must be real anchors:

* Destinations → `/destinations`
* Stays → `/stays`
* Experiences → `/experiences`

Footer links to public pages (About, Privacy — when added) use standard hrefs.

**Avoid:** onclick-only navigation for primary IA paths, hidden links, infinite-scroll-only discovery without paginated/sitemap fallback (future consideration).

---

## 20. Clean URLs

From `docs/INFORMATION_ARCHITECTURE.md`:

* Lowercase, hyphen-separated slugs
* No file extensions (`.html`, `.php`)
* No session IDs in URLs
* No hash-based routing for primary content
* Query params for filters/search only — not for primary entity identity

---

## 21. No Accidental Indexing of Private Pages

These routes **must** include `robots: { index: false, follow: false }`:

| Route | Reason |
| :--- | :--- |
| `/saved` | Personal bookmarks |
| `/trips`, `/trips/*` | Private trip workspaces |
| `/account`, `/account/*` | User profile and settings |
| `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` | Auth utility pages |

Also:

* Add `X-Robots-Tag: noindex` header at CDN for protected routes (deployment layer, post-MVP)
* Never link to private pages from public sitemap
* Auth-gated pages should not appear in internal links from public footer

---

## 22. hreflang Architecture (Future Multilingual)

Not MVP. Prepare now:

1. Keep copy in dictionary files (`CONTENT_GUIDELINES.md` §35).
2. Use `html lang="en"` on root; switch per locale later.
3. When i18n ships, URL pattern: `/en/destinations/kyoto-japan`, `/ja/destinations/kyoto-japan`
4. Metadata adds `alternates.languages`:

```typescript
alternates: {
  canonical: "https://gowithus.com/en/destinations/kyoto-japan",
  languages: {
    en: "https://gowithus.com/en/destinations/kyoto-japan",
    ja: "https://gowithus.com/ja/destinations/kyoto-japan",
    "x-default": "https://gowithus.com/en/destinations/kyoto-japan",
  },
}
```

5. Sitemap index per locale or unified sitemap with `xhtml:link` entries.

---

## 23. Performance & Core Web Vitals

SEO and performance intersect:

| Metric | GO WITH US approach |
| :--- | :--- |
| **LCP** | Priority hero images, `priority` on above-fold, responsive sizes |
| **INP** | Minimal client JS on discovery pages; RSC first |
| **CLS** | Skeleton dimensions match content; reserve space for images |
| **Font loading** | `display: swap` on local fonts (already configured) |

Lenis smooth scroll and heavy animation must respect `prefers-reduced-motion` — animation jank hurts UX signals.

---

## 24. Implementation Checklist

Before shipping a new public page:

- [ ] Title follows template and reads naturally
- [ ] Description is 140–160 chars from real content
- [ ] Canonical URL set
- [ ] OG + Twitter tags present
- [ ] Exactly one `h1`
- [ ] Images have meaningful alt text
- [ ] JSON-LD validates in Google Rich Results Test (when applicable)
- [ ] Page appears in sitemap (if indexable)
- [ ] Protected pages have `noindex`
- [ ] Invalid slugs return 404

---

## 25. Related Documents

* `docs/CONTENT_GUIDELINES.md` — §32–33 copy and alt text
* `docs/INFORMATION_ARCHITECTURE.md` — routes and URL structure
* `docs/PAGE_SPECIFICATIONS.md` — §35 semantic HTML
* `docs/FRONTEND_ARCHITECTURE.md` — §23 metadata code patterns
* `apps/web/lib/seo/` — shared metadata helpers

---

## 26. Final Rule

**Write titles and descriptions you would click as a traveler — not copy engineered to game search rankings.**
