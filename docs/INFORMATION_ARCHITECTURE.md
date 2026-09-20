# GO WITH US — Information Architecture

This document defines the information architecture, route structure, navigation hierarchy, content relationships, and page organization for the **GO WITH US** travel discovery and trip-planning platform.

---

## 1. Information Architecture Principles

The information architecture of GO WITH US is built around ten core principles:

1. **Clear Hierarchy**: Every page, route, and content node has an unambiguous position within the application structure.
2. **Simple Navigation**: Navigation patterns prioritize clarity and speed, keeping critical destinations within 1–2 clicks.
3. **Discovery Before Complexity**: Users encounter inspiring destinations and content before exposed planning mechanics.
4. **Planning as Core Utility**: Trip creation and itinerary tools are elevated to primary product functions, accessible from any context.
5. **Consistent Page Relationships**: Parent-child and peer-level relationships follow predictable layout patterns across all product areas.
6. **Clean, Readable URLs**: Routes use lowercase, human-readable slugs and RESTful patterns (e.g., `/destinations/paris-france`).
7. **Responsive Navigation**: Desktop headers and mobile bottom bars adapt structure specifically to form-factor constraints.
8. **Public Exploration Without Barriers**: All destination, stay, experience, search, and review content is browseable without forced authentication.
9. **Protected Personal Spaces**: Saved items, trip creation, itinerary edits, and account management sit safely behind authenticated security controls.
10. **Scalable Architecture**: The route and navigation layout easily accommodates post-MVP extensions (e.g., maps, collaborative trips, travel budgets) without requiring structural rewrites.

---

## 2. Global Application Structure

```text
GO WITH US
│
├── Home (/)
│
├── Discover (/destinations, /stays, /experiences)
│   ├── Destinations (/destinations)
│   │   └── Destination Details (/destinations/[slug])
│   ├── Stays (/stays)
│   │   └── Stay Details (/stays/[slug])
│   └── Experiences (/experiences)
│       └── Experience Details (/experiences/[slug])
│
├── Search (/search)
│
├── Saved (/saved)
│   ├── Saved Destinations
│   ├── Saved Stays
│   └── Saved Experiences
│
├── Trips (/trips)
│   ├── Trip Creation (/trips/new)
│   ├── Trip Overview (/trips/[tripId])
│   └── Trip Itinerary (/trips/[tripId]/itinerary)
│
└── Account (/account)
    ├── Profile (/account/profile)
    ├── Preferences (/account/preferences)
    ├── Travel History (/account/history)
    └── Settings (/account/settings)
```

---

## 3. Primary Navigation

### Desktop Navigation Structure

```text
[ Logo: GO WITH US ]  |  Destinations  Stays  Experiences  Trips  Saved  |  [ Search Bar ]  [ User Avatar / Sign In ]
```

### Primary Navigation Items

* **Logo / Home**: Direct link to the main discovery landing page (`/`).
* **Destinations**: Main directory for browsing global locations and travel regions (`/destinations`).
* **Stays**: Directory of curated accommodations and boutique lodging (`/stays`).
* **Experiences**: Catalog of activities, cultural tours, and local attractions (`/experiences`).
* **Trips**: Central management hub for upcoming, active, and completed user trips (`/trips`).
* **Saved**: Quick access to bookmarked destinations, stays, and experiences (`/saved`).
* **Account Dropdown / Auth Button**: Unauthenticated users see a "Sign In" CTA; authenticated users see an avatar menu linking to Profile, Preferences, Travel History, Settings, and Sign Out.

---

## 4. Mobile Navigation

Mobile navigation shifts primary tabs into a fixed bottom navigation bar for comfortable one-handed thumb interaction, keeping high-frequency destinations immediately accessible.

```text
Sticky Top Bar:   [ Logo ]                                    [ Search Icon ]  [ Auth Avatar ]
─────────────────────────────────────────────────────────────────────────────────────────────
Page Content
─────────────────────────────────────────────────────────────────────────────────────────────
Fixed Bottom Bar: [ Home ]    [ Discover ]    [ Saved ]    [ Trips ]    [ Account ]
```

### Mobile Tab Breakdown

1. **Home (`/`)**: High-level visual inspiration and featured destinations.
2. **Discover (`/destinations`)**: Unified entry into Destinations, Stays, and Experiences.
3. **Saved (`/saved`)**: Instant access to user's saved favorites.
4. **Trips (`/trips`)**: Fast access to active itineraries and upcoming trips.
5. **Account (`/account`)**: User profile, settings, travel history, and auth actions.

---

## 5. Route Architecture

The Next.js Application Router utilizes clean, semantic URL paths:

```text
/                          Home page — Editorial inspiration & search entry

/destinations              Destination directory page (filterable/searchable)
/destinations/[slug]       Single Destination detail profile

/stays                     Stay discovery page (filterable catalog)
/stays/[slug]              Single Stay detail profile

/experiences               Experience discovery page (filterable catalog)
/experiences/[slug]        Single Experience detail profile

/search                    Unified cross-product search results page

/saved                     User saved places workspace (Destinations, Stays, Experiences)

/trips                     User trips listing dashboard (Upcoming, Active, Past)
/trips/new                 Trip creation wizard / form page
/trips/[tripId]            Trip overview page
/trips/[tripId]/itinerary  Interactive day-by-day itinerary builder workspace

/account                   Account overview & quick links
/account/profile           User profile management
/account/preferences       Travel style & interest preferences
/account/history           Travel history & past completed trips archive
/account/settings          Security, email, and password settings

/sign-in                   User sign in page
/sign-up                   User registration page
/forgot-password           Password reset request page
/reset-password            Password reset confirmation page
```

---

## 6. Public vs Protected Areas

| Area / Route | Public Access | Auth Required | Purpose & Reasoning |
| :--- | :---: | :---: | :--- |
| **Home (`/`)** | **Yes** | No | Primary landing and brand introduction; open to all visitors. |
| **Destinations (`/destinations`)** | **Yes** | No | Public research catalog for exploring global destinations. |
| **Destination Details (`/destinations/[slug]`)** | **Yes** | No | Rich destination profiles; unrestricted access drives engagement. |
| **Stays (`/stays`)** | **Yes** | No | Accommodation browsing; no account needed to view stays. |
| **Stay Details (`/stays/[slug]`)** | **Yes** | No | Full stay descriptions, amenities, and photos; public. |
| **Experiences (`/experiences`)** | **Yes** | No | Activity directory; publicly browseable. |
| **Experience Details (`/experiences/[slug]`)** | **Yes** | No | Full activity specifications; public. |
| **Search (`/search`)** | **Yes** | No | Cross-product search engine; unrestricted public utility. |
| **Saved (`/saved`)** | No | **Yes** | Personal user bookmarks; requires authenticated user session. |
| **Trips (`/trips`)** | No | **Yes** | Private trip dashboard; requires account ownership. |
| **Trip Details & Itinerary (`/trips/[tripId]/*`)** | No | **Yes** | Personal day-by-day travel planning workspace; protected. |
| **Account (`/account/*`)** | No | **Yes** | Personal profile, security, and preferences; strictly protected. |
| **Reviews (Viewing)** | **Yes** | No | Public social proof on stays/experiences; browseable by all. |
| **Reviews (Submitting / Editing)** | No | **Yes** | UGC moderation requirement; writing reviews requires auth. |

---

## 7. Home Information Architecture

The homepage is structured as an editorial travel magazine landing experience:

```text
Home
│
├── 1. Hero Section (Inspirational headline, background visual, global search bar)
├── 2. Featured Destinations (Curated high-impact destination cards)
├── 3. Explore by Travel Style (Category pills: Beach, Culture, Mountain, Luxury, Adventure)
├── 4. Popular Destinations (Grid of trending locations based on user saves)
├── 5. Featured Stays (Spotlight on boutique hotels and unique lodging)
├── 6. Featured Experiences (Curated local tours and activities)
├── 7. Travel Inspiration & Guides (Editorial articles and travel insights)
├── 8. Trip Planning Call-to-Action ("Start Planning Your Journey")
└── 9. Footer (Site map, category links, legal notes, social channels)
```

---

## 8. Destination Architecture

```text
Destinations Directory (/destinations)
├── Global Search & Filter Bar (Region, Category, Travel Style, Budget Tier)
├── Sort Controls (Popularity, Alphabetical)
└── Destination Cards Grid
      │
      ▼ (Click Destination Card)
Destination Detail Page (/destinations/[slug])
├── Hero Banner & Photo Gallery
├── Overview & Quick Facts (Country, Region, Best Season, Budget Level)
├── Highlights & Top Sights
├── Things To Do (Local Activities)
├── Recommended Stays (Filtered Stay Cards)
├── Curated Experiences (Filtered Experience Cards)
├── Essential Travel Information (Weather, Transport, Local Currency)
├── User Reviews & Community Ratings
├── Related Destinations (Nearby / Similar Vibe)
└── Persistent Action Bar ("Save Destination" | "Add Destination to Trip")
```

---

## 9. Stay Architecture

```text
Stays Directory (/stays)
├── Search & Filter Bar (Location, Property Type, Price Tier, Amenities, Rating)
├── Sort Controls (Recommended, Rating, Price)
└── Stay Cards Grid
      │
      ▼ (Click Stay Card)
Stay Detail Page (/stays/[slug])
├── Image Gallery / Grid
├── Property Header (Title, Type, Location Tag, Star Rating)
├── Overview & Detailed Description
├── Amenity List (Wi-Fi, Pool, Breakfast, Air Conditioning, Parking, etc.)
├── Location Context & Geographic Overview
├── Price Indicator & Booking Guidance Note
├── Verified Guest Reviews & Ratings Breakdown
└── Persistent Action Bar ("Save Stay" | "Add Stay to Trip Itinerary")
```

---

## 10. Experience Architecture

```text
Experiences Directory (/experiences)
├── Search & Filter Bar (Location, Category, Duration, Rating, Price)
├── Sort Controls (Popularity, Duration, Rating)
└── Experience Cards Grid
      │
      ▼ (Click Experience Card)
Experience Detail Page (/experiences/[slug])
├── Hero Visual & Photo Gallery
├── Activity Header (Title, Category Badge, Location, Duration Estimate)
├── Overview & What You'll Do
├── Key Highlights & Included Features
├── Location & Meeting Point Context
├── Price Indicator / Fee Tier
├── User Reviews & Feedback
└── Persistent Action Bar ("Save Experience" | "Add Experience to Trip Itinerary")
```

---

## 11. Search Architecture

The search architecture provides a single cross-product query gateway:

```text
Search Query Input (`/search?q=paris`)
        │
        ▼
Search Results Workspace
├── Global Query Status Header ("Results for 'Paris'")
├── Results Category Tabs ([ All (14) ] [ Destinations (4) ] [ Stays (6) ] [ Experiences (4) ])
├── Filter Sidebar / Drawer (Location, Price, Rating, Category)
├── Sort Options (Relevance, Popularity, Name)
│
├── Destinations Match Section ──► Grid of matching Destination Cards
├── Stays Match Section        ──► Grid of matching Stay Cards
└── Experiences Match Section  ──► Grid of matching Experience Cards
```

---

## 12. Saved Architecture

Centralized workspace for user bookmarks (`/saved`):

```text
Saved Places Workspace (/saved)
├── Workspace Header ("Your Saved Places")
├── Category Navigation Tabs ([ All ] [ Destinations ] [ Stays ] [ Experiences ])
│
├── Saved Destinations Grid (Cards with heart filled toggle & "Add to Trip" CTA)
├── Saved Stays Grid        (Cards with heart filled toggle & "Add to Trip" CTA)
└── Saved Experiences Grid  (Cards with heart filled toggle & "Add to Trip" CTA)
```

---

## 13. Trip Architecture

User trips management hierarchy (`/trips`):

```text
Trips Dashboard (/trips)
├── Dashboard Header + "Create New Trip" Button (/trips/new)
├── Trip Status Tabs ([ All ] [ Active ] [ Upcoming ] [ Drafts ] [ Completed ])
│
└── Trip Cards List
      │
      ▼ (Select Specific Trip)
Trip Overview Workspace (/trips/[tripId])
├── Trip Header Banner (Title, Target Destination, Start Date — End Date, Status Badge)
├── Trip Navigation Sub-bar ([ Overview ] [ Itinerary Builder ] [ Saved Places Shortcuts ] [ Settings ])
├── Trip Summary (Duration in Days, Total Planned Activities, Notes)
└── Quick Action ("Go to Day-by-Day Itinerary" -> `/trips/[tripId]/itinerary`)
```

---

## 14. Itinerary Architecture

The interactive day-by-day planning workspace (`/trips/[tripId]/itinerary`):

```text
Trip Itinerary Workspace (/trips/[tripId]/itinerary)
├── Trip Header & Quick Stats (e.g., "Paris Getaway — 5 Days")
├── Days Timeline Selector Tabs ([ Day 1: Oct 12 ] [ Day 2: Oct 13 ] [ Day 3: Oct 14 ] ...)
│
└── Active Day Timeline View (e.g., Day 1)
    ├── Morning Block (08:00 AM – 12:00 PM)
    │   ├── Morning Activity Card (Time, Title, Notes, Remove Button)
    │   └── "+ Add Item to Morning" Button
    │
    ├── Afternoon Block (12:00 PM – 05:00 PM)
    │   ├── Stay Check-in Card
    │   ├── Experience Card
    │   └── "+ Add Item to Afternoon" Button
    │
    └── Evening Block (05:00 PM – 11:00 PM)
        ├── Dining / Activity Card
        └── "+ Add Item to Evening" Button
```

---

## 15. Account Architecture

Account management section (`/account/*`):

```text
Account Workspace (/account)
├── Account Navigation Sidebar / Top Sub-nav
│   ├── Profile (/account/profile)        ──► Name, Avatar, Bio, Home City
│   ├── Preferences (/account/preferences) ──► Travel Styles, Interest Tags, Budget Preference
│   ├── Saved Places (/saved)              ──► Direct link to Saved workspace
│   ├── Travel History (/account/history)  ──► Archive of past completed trips
│   └── Settings (/account/settings)      ──► Password, Email, Security settings
```

---

## 16. Authentication Architecture

Public authentication routes and flows:

```text
/sign-in
├── Credentials Form (Email, Password)
├── "Forgot Password?" Link ──► (/forgot-password)
├── "Don't have an account? Sign Up" Link ──► (/sign-up)
└── Post-Login Redirect (Returns user to previous context/URL)

/sign-up
├── Account Creation Form (Full Name, Email, Password, Confirm Password)
└── "Already have an account? Sign In" Link ──► (/sign-in)

/forgot-password ──► Enter Email ──► Send Reset Link
/reset-password  ──► Enter New Password ──► Return to Sign In
```

---

## 17. Content Relationships

```text
               ┌────────────────────────┐
               │      Destination       │
               └───────────┬────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
     ┌───────────┐   ┌───────────┐   ┌───────────┐
     │   Stays   │   │Experiences│   │  Reviews  │
     └─────┬─────┘   └─────┬─────┘   └───────────┘
           │               │
           └───────┬───────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                        User                         │
│  ├── Saved Places (Destinations, Stays, Experiences)│
│  ├── Reviews Written                                │
│  └── Trips Created ──────────┐                      │
└──────────────────────────────┼──────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │        Trip         │
                    │  ├── Overview       │
                    │  ├── Dates & Notes  │
                    │  └── Itinerary      │
                    │      └── Days ──────┼──► Scheduled Items (Stays/Experiences/Custom)
                    └─────────────────────┘
```

---

## 18. URL & Naming Conventions

1. **Lowercase & Hyphenated**: All URL paths use lowercase letters with hyphens separating words (`/destinations/costa-rica`).
2. **Plural Nouns for Collections**: Use plural nouns for top-level collection routes (`/destinations`, `/stays`, `/experiences`, `/trips`).
3. **Human-Readable Slugs**: Detail routes use descriptive slugs derived from entity titles rather than raw database UUIDs (`/stays/villa-bella-bali` instead of `/stays/9b1deb4d-3b7d-4142-90d4-26021...`).
4. **Shallow Nesting**: Avoid deep route nesting beyond 3 levels. Prefer `/trips/[tripId]/itinerary` over `/account/user/trips/[tripId]/days/itinerary`.
5. **RESTful Consistency**: Frontend URL naming matches backend API endpoint concepts (`/api/v1/destinations/[slug]`).

---

## 19. Navigation Rules

1. **Predictable Navigation**: Top desktop bar and mobile bottom bar must remain sticky and present across primary pages.
2. **Clear Back Navigation**: Detail pages must provide breadcrumb links or back arrows returning users to their previous listing view.
3. **Expose Contextual Recommendations**: Destination detail pages must link directly to related stays and experiences.
4. **Ubiquitous Trip Access**: "Add to Trip" buttons must be accessible directly from destination cards, stay cards, experience cards, and saved lists.
5. **Quick Access to Saved Places**: Saved items must remain 1 click away via header icon or mobile tab bar.
6. **Separate Account Settings**: Keep dense security and account settings separated from primary travel discovery navigation.
7. **Mobile-Optimized Touch**: Mobile navigation items must provide minimum 44x44px touch targets.
8. **Unblock Discovery**: Public exploration must never be blocked by authentication modals or forced sign-in overlays.

---

## 20. Breadcrumb & Context Rules

Breadcrumbs are rendered on sub-pages to maintain visual spatial orientation:

```text
Home  →  Destinations  →  Japan  →  Kyoto
Home  →  Stays  →  Indonesia  →  Boutique Villa Bali
Home  →  Trips  →  Summer in Paris  →  Itinerary (Day 2)
```

### Usage Rules
* Render breadcrumbs on detail pages (`/destinations/[slug]`, `/stays/[slug]`, `/experiences/[slug]`) and deep trip sub-views.
* Do not render breadcrumbs on primary top-level routes (`/`, `/destinations`, `/trips`, `/saved`).

---

## 21. Page Hierarchy

| Page Route | Page Purpose | Access Level | Parent Route |
| :--- | :--- | :---: | :--- |
| `/` | Product landing & editorial discovery | Public | Root |
| `/destinations` | Global destination directory & filtering | Public | Home (`/`) |
| `/destinations/[slug]` | Deep-dive profile for a destination | Public | `/destinations` |
| `/stays` | Lodging directory & accommodation filter | Public | Home (`/`) |
| `/stays/[slug]` | Deep-dive property details & amenities | Public | `/stays` |
| `/experiences` | Activity & tours catalog | Public | Home (`/`) |
| `/experiences/[slug]` | Activity specifications & location details | Public | `/experiences` |
| `/search` | Global cross-product search results | Public | Root |
| `/saved` | Central saved bookmarks dashboard | Auth Required | Account (`/account`) |
| `/trips` | User trip management dashboard | Auth Required | Account (`/account`) |
| `/trips/new` | Trip creation wizard | Auth Required | `/trips` |
| `/trips/[tripId]` | Single trip summary & overview | Auth Required | `/trips` |
| `/trips/[tripId]/itinerary` | Interactive day-by-day planner | Auth Required | `/trips/[tripId]` |
| `/account` | Account hub & personal overview | Auth Required | Root |
| `/account/profile` | Manage user name, avatar, bio | Auth Required | `/account` |
| `/account/preferences` | Travel interests & style preferences | Auth Required | `/account` |
| `/account/history` | Travel history archive | Auth Required | `/account` |
| `/account/settings` | Email, password, security options | Auth Required | `/account` |
| `/sign-in` | User sign-in page | Public | Root |
| `/sign-up` | User registration page | Public | Root |

---

## 22. Scalability Rules

The information architecture is designed to support future feature expansions without breaking existing navigation or route structures:

* **Interactive Maps**: Accessible as an alternative layout toggle on `/destinations`, `/stays`, and `/experiences` routes without changing underlying paths.
* **Collaborative Trips**: Shared trip routes (`/trips/shared/[shareToken]`) map cleanly into the `/trips` namespace.
* **Travel Budgets**: Added as a tab node under `/trips/[tripId]/budget` parallel to `/itinerary`.
* **Travel Journals / Memories**: Accessible under `/account/history/[tripId]/journal`.

---

## 23. Final Information Architecture

Consolidated structural map representing the completed application hierarchy:

```text
GO WITH US (Application Root)
│
├── PUBLIC DISCOVERY AREA
│   ├── Home (/)
│   ├── Destinations (/destinations)
│   │   └── Destination Details (/destinations/[slug])
│   ├── Stays (/stays)
│   │   └── Stay Details (/stays/[slug])
│   ├── Experiences (/experiences)
│   │   └── Experience Details (/experiences/[slug])
│   └── Search (/search)
│
├── AUTHENTICATION AREA
│   ├── Sign In (/sign-in)
│   ├── Sign Up (/sign-up)
│   ├── Forgot Password (/forgot-password)
│   └── Reset Password (/reset-password)
│
└── PROTECTED USER AREA (Requires Authentication)
    ├── Saved Places (/saved)
    │   ├── Saved Destinations
    │   ├── Saved Stays
    │   └── Saved Experiences
    │
    ├── Trips Dashboard (/trips)
    │   ├── Create Trip (/trips/new)
    │   ├── Trip Overview (/trips/[tripId])
    │   └── Trip Itinerary Workspace (/trips/[tripId]/itinerary)
    │
    └── Account Hub (/account)
        ├── Profile (/account/profile)
        ├── Preferences (/account/preferences)
        ├── Travel History (/account/history)
        └── Settings (/account/settings)
```
