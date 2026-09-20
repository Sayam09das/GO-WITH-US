# GO WITH US — Page Specifications

This document defines the page-level UI/UX specifications, content structures, interactive elements, and responsive layout behavior for every major route in **GO WITH US**.

---

## 1. Purpose

This document serves as the primary visual and structural reference prior to implementing individual routes. It works in alignment with `PRODUCT.md`, `FEATURES.md`, `USER_FLOWS.md`, `INFORMATION_ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `FRONTEND_ARCHITECTURE.md`, and `API_SPECIFICATION.md`.

---

## 2. Global Page Structure

Standard page layout hierarchy:

```text
Page Wrapper
├── Navbar (Header navigation)
├── Main Content Container
│   ├── Page Hero / Header
│   ├── Primary Content Sections
│   └── Supporting Content / Recommendations
└── Footer (Global footer)
```

Layouts adjust dynamically based on route context (e.g., trip itinerary workspace omits standard editorial footers to maximize planning area).

---

## 3. Global Navigation

### Desktop Navigation Header
* **Height**: 64px fixed/sticky navbar with glassmorphism backdrop blur (`backdrop-blur-md bg-white/80`).
* **Left**: Brand logo (`GO WITH US`).
* **Center**: Primary navigation links (`Destinations`, `Stays`, `Experiences`, `Trips`, `Saved`).
* **Right**: Search trigger icon + User menu / Auth CTA (`Sign In` or User Avatar).
* **Active Indicator**: Active route links highlight with primary ocean teal accent (`text-teal-600 font-semibold`).

### Mobile Navigation Bar
* **Fixed Bottom Bar**: 56px height tab bar with 5 primary touch nodes (`Home`, `Discover`, `Saved`, `Trips`, `Account`).
* **Top Header Bar**: Compact sticky top bar with logo, search icon, and notification bell.

---

## 4. Home Page `/`

### Page Purpose
Primary visual entry point delivering inspirational travel discovery and clear trip-planning entry paths.

### Section Breakdown
1. **Hero Section**:
   * Full-width editorial background imagery with subtle gradient overlay.
   * Headline: *Discover places. Save what inspires you. Build your trip.*
   * Integrated elevated search bar input with location and category dropdown triggers.
2. **Featured Destinations**:
   * Asymmetric visual grid (1 large feature card + 2 stacked supporting cards) highlighting top global locations.
3. **Travel Styles**:
   * Horizontal scrollable or grid category pills (*Beach*, *Mountain*, *Culture*, *Adventure*, *Luxury*, *Weekend Getaways*).
4. **Popular Destinations**:
   * 4-column card grid displaying trending destinations with save heart buttons and rating badges.
5. **Featured Stays**:
   * Spotlight carousel of boutique lodging and unique stay options.
6. **Featured Experiences**:
   * Highlighted local activities and day tours.
7. **Travel Inspiration**:
   * Editorial magazine layout featuring destination travel stories and guides.
8. **Trip Planning CTA**:
   * High-impact banner: *Found somewhere you love? Build a trip around it.* + Primary `[ Create a Trip ]` button.
9. **Footer**:
   * Site map, legal links, language/currency selectors, and brand social links.

---

## 5. Featured Destinations Section

* **Layout**: Asymmetric 3-card layout (Desktop) / Vertical stack (Mobile).
* **Card Components**: High-resolution cover photo, destination title, country, category tag, and quick save toggle.
* **Interaction**: Clicking a destination card navigates to `/destinations/[slug]`.

---

## 6. Travel Styles Section

* **Visual Style**: Clean visual category cards with icon overlays and subtle hover zoom.
* **Interaction**: Clicking a style filters the destinations directory by selected tag (`/destinations?style=adventure`).

---

## 7. Popular Destinations Section

* **Layout**: 4-column grid (Desktop) / 2-column grid (Tablet) / 1-column list (Mobile).
* **Content**: Displays location title, average rating score, starting budget tier badge, and direct save heart button.

---

## 8. Featured Stays Section

* **Layout**: 3-column card grid showcasing accommodations.
* **Content**: Stay photo, stay title, property type tag (*Villa*, *Boutique Hotel*), location, price tier ($$), star rating.
* **Link**: Navigates to `/stays/[slug]`.

---

## 9. Featured Experiences Section

* **Layout**: 3-column card grid showcasing curated activities.
* **Content**: Activity image, title, duration indicator (*3 Hours*), category tag (*Food Tour*, *Hiking*), rating.
* **Link**: Navigates to `/experiences/[slug]`.

---

## 10. Travel Inspiration Section

* **Visual Style**: Editorial visual stories featuring rich photography and short descriptive paragraphs.
* **Goal**: Engage visitors with travel ideas prior to trip creation.

---

## 11. Trip Planning CTA Section

* **Design**: Full-width ocean teal accent banner (`accent-subtle`) with prominent typography.
* **Actions**: Primary CTA button triggering trip creation (`/trips/new`).

---

## 12. Destination Discovery `/destinations`

* **Header**: Page title ("Explore Destinations") + subtitle + search/filter bar.
* **Filters Drawer / Sidebar**: Region, travel style, budget tier, rating filter options.
* **Sort Bar**: Sort by *Popularity*, *Name (A-Z)*, *Rating*.
* **Results Grid**: 3-column grid displaying matching destination cards.
* **State Management**: Filter changes update URL query parameters and trigger skeleton card loading states.

---

## 13. Destination Details `/destinations/[slug]`

### Layout Structure
```text
Hero Gallery (Full-width photo gallery)
↓
Overview Header (Title, Country, Region, Best Season, Budget Tier)
↓
Action Bar ("Save Destination" | "Add Destination to Trip")
↓
Content Grid (2 Columns: Main Details + Sidebar Quick Facts)
├── Overview & Narrative
├── Highlights & Top Attractions
├── Recommended Stays (Filtered Stay Cards Carousel)
├── Recommended Experiences (Filtered Experience Cards Carousel)
└── Essential Travel Info (Climate, Currency, Transport)
↓
Related Destinations Section
```

---

## 14. Stays Discovery `/stays`

* **Header**: "Find Unique Stays" + Location & Property Type filter bar.
* **Filters**: Property Type (*Hotel*, *Villa*, *Apartment*, *Lodge*), Price Tier, Amenities (*Pool*, *Wi-Fi*, *AirCon*).
* **Results**: 3-column card grid displaying stays with location, price indicator, and star rating.

---

## 15. Stay Details `/stays/[slug]`

* **Hero**: Multi-photo grid gallery showcasing property images.
* **Property Info**: Title, property type, location address, host/property description.
* **Amenities Grid**: Visual grid of property amenities with Lucide icons.
* **Location Map Context**: Geographic map/location description block.
* **Reviews Section**: Aggregate rating breakdown + user review list.
* **Actions**: Persistent sticky action bar with `[ Save Stay ]` and `[ Add to Trip Itinerary ]`.

---

## 16. Experiences Discovery `/experiences`

* **Header**: "Discover Experiences & Activities".
* **Filters**: Activity Category (*Tours*, *Outdoor*, *Food & Drink*, *Culture*), Duration (*Half Day*, *Full Day*), Price.
* **Results Grid**: 3-column grid of experience cards.

---

## 17. Experience Details `/experiences/[slug]`

* **Header**: Activity title, category badge, duration indicator, location tag.
* **Media**: Photo gallery of activity highlights.
* **Description**: Detailed schedule breakdown and included features.
* **Reviews**: Guest feedback and star rating breakdown.
* **Actions**: `[ Save Experience ]` and `[ Add to Trip Itinerary ]`.

---

## 18. Search `/search`

* **Header**: Unified Search Input field with clear button and query status ("Showing results for 'Bali'").
* **Category Tabs**: `[ All Results ]` `[ Destinations ]` `[ Stays ]` `[ Experiences ]`.
* **Results Layout**: Categorized sections displaying matched cards for each domain.
* **Empty State**: Displays helpful query suggestions and a single-click "Clear Search" button if no matches are found.

---

## 19. Saved `/saved`

* **Access**: Auth Protected.
* **Header**: "Your Saved Places".
* **Tabs**: `[ All ]` `[ Destinations ]` `[ Stays ]` `[ Experiences ]`.
* **Grid**: Card grid displaying favorited items with filled heart unsave toggles and direct `[ Add to Trip ]` buttons.
* **Empty State**: "You haven't saved any places yet" + `[ Explore Destinations ]` CTA.

---

## 20. Trips `/trips`

* **Access**: Auth Protected.
* **Header**: "Your Trips" + `[ + Create New Trip ]` Button.
* **Status Tabs**: `[ Active ]` `[ Upcoming ]` `[ Drafts ]` `[ Completed ]`.
* **Trip Cards**: Wide banner cards displaying cover photo, trip title, destination, dates, itinerary item count, and status badge.

---

## 21. Create Trip `/trips/new`

* **Access**: Auth Protected.
* **Form Layout**: Clean 1-column modal or focused page form.
* **Fields**:
  1. Trip Title (e.g. *Paris Spring Getaway*).
  2. Target Destination Selector.
  3. Start Date & End Date Pickers.
  4. Optional Description / Notes.
* **Actions**: `[ Cancel ]` and `[ Create Trip ]` (Navigates to `/trips/[tripId]`).

---

## 22. Trip Overview `/trips/[tripId]`

* **Access**: Auth Protected.
* **Header**: Trip Title, Destination, Date Range, Status Badge.
* **Sub-Navigation**: `[ Overview ]` `[ Itinerary Builder ]` `[ Saved Shortcuts ]`.
* **Content**: Summary stats (Total Days, Planned Items), Destination Overview, and prominent CTA: `[ Open Itinerary Builder ]`.

---

## 23. Itinerary `/trips/[tripId]/itinerary`

### Layout Architecture
```text
Trip Title Header & Days Navigator ([ Day 1 ] [ Day 2 ] [ Day 3 ] ...)
────────────────────────────────────────────────────────────────────────
Active Day Timeline Workspace
├── Morning Block (08:00 AM)
│   ├── Scheduled Activity Card (Time, Title, Location, Notes)
│   └── "+ Add Item to Morning" Button
├── Afternoon Block (12:00 PM)
│   ├── Scheduled Stay / Tour Card
│   └── "+ Add Item to Afternoon" Button
└── Evening Block (06:00 PM)
    ├── Scheduled Dining / Sightseeing Card
    └── "+ Add Item to Evening" Button
```
* **Interactions**: Reorder items within a day, move items between days, edit time/notes, or delete items.

---

## 24. Account `/account`

* **Access**: Auth Protected.
* **Layout**: Left sidebar navigation (Desktop) / Top horizontal pill tabs (Mobile).
* **Navigation Nodes**: Profile, Preferences, Travel History, Settings.

---

## 25. Account Profile `/account/profile`

* **Fields**: Avatar Upload/Selector, Full Name, Email (Read-only), Home City, Bio.

---

## 26. Account Preferences `/account/preferences`

* **Interests**: Travel style tags (Beach, Culture, Adventure, Culinary) and budget preference selection.

---

## 27. Travel History `/account/history`

* **Archive**: List of past completed trips with read-only itinerary access and travel summaries.

---

## 28. Account Settings `/account/settings`

* **Security**: Password change form, authentication preferences, account deletion option with double confirmation.

---

## 29. Authentication Pages

### `/sign-in`
* Centered card containing Email & Password inputs, "Remember Me", "Forgot Password?" link, Sign In button, and link to `/sign-up`.

### `/sign-up`
* Registration form containing Full Name, Email, Password, Confirm Password, terms check, and link to `/sign-in`.

---

## 30. Responsive Page Rules

* **Desktop**: Multi-column grids, fixed sticky navbar, spacious 64px–96px section padding.
* **Tablet**: 2-column adaptive grids, collapsible filter drawers.
* **Mobile**: 1-column visual stacking, slide-up bottom sheet filters, fixed bottom navigation bar, 44x44px touch targets.

---

## 31. Loading States

All data-fetching routes implement explicit skeleton components (`DestinationSkeleton`, `StayCardSkeleton`, `ItinerarySkeleton`) matching layout geometry during loading phases.

---

## 32. Empty States

Empty lists display centered visual graphics, clear explanation titles, and contextual next-action buttons (e.g., "No trips created yet" → `[ Create Your First Trip ]`).

---

## 33. Error States

Failed API requests render inline error containers: **"Unable to load content. [ Retry Button ]"**.

---

## 34. Authentication & Protected Actions

Guest users browse destinations, stays, experiences, search, and reviews freely. Attempting to save items, create trips, or write reviews prompts a non-intrusive Authentication Required Modal.

---

## 35. SEO & Discoverability

Public pages feature semantic HTML tags (`<h1>`–`<h3>`), dynamic metadata generation, and clean canonical URLs (`/destinations/tokyo-japan`).

---

## 36. Accessibility

Full WCAG AA compliance: visible focus rings, aria labels on icon buttons, keyboard focus management, and `prefers-reduced-motion` support.

---

## 37. Visual Quality Rules

GO WITH US pages must remain calm, editorial, spacious, and image-driven. Heavy SaaS tables, dense booking grids, and aggressive sales countdown banners are strictly forbidden.

---

## 38. Page-to-Page Relationships

```text
Home (/) ──► Destinations (/destinations) ──► Destination Detail (/destinations/[slug])
                   │
                   ▼
             Click "Save" / "Add to Trip"
                   │
                   ▼
          Saved Places (/saved) ──► Create Trip (/trips/new) ──► Itinerary Workspace
```

---

## 39. Implementation Priority

1. **Phase 1**: Navbar, Layout, Home Hero, Home Sections, Footer.
2. **Phase 2**: Destinations, Stays, Experiences, Search.
3. **Phase 3**: Saved Places, User Account, Authentication.
4. **Phase 4**: Trips, Trip Creation, Itinerary Workspace.
5. **Phase 5**: Polishing, Loading/Empty/Error states, SEO & Accessibility refinement.

---

## 40. Final Page Specification Principles

1. Every page has a single clear purpose.
2. Discovery pages prioritize visual exploration.
3. Detail pages prioritize storytelling and planning metadata.
4. Planning workspaces prioritize calm organization.
5. Public browsing remains frictionless.
6. Responsive behavior and accessibility are built-in defaults.
