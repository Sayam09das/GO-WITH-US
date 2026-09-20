# GO WITH US — User Flows

This document details the complete user interaction flows and navigational journeys for **GO WITH US**, defining how users explore, save, plan, organize, and revisit their travel experiences across the platform.

---

## 1. User Flow Principles

All interaction flows within GO WITH US adhere to the following UX principles:

1. **Minimal Friction**: Eliminate unnecessary steps or form fields to keep interactions swift and effortless.
2. **Clear Next Actions**: Every screen must communicate a clear primary action or next logical step.
3. **Natural Discovery**: Browsing destinations, stays, and activities should feel intuitive and visually engaging.
4. **Simple Planning**: Converting saved items or inspiration into day-by-day itineraries must be straightforward.
5. **Contextual Awareness**: Users should always know where they are within the application hierarchy.
6. **Immediate Visual Feedback**: Button states, save toggles, and form submissions must instantly update visually.
7. **Graceful Mistake Recovery**: Destructive or incorrect actions must support easy reversal or undo options.
8. **Mobile and Desktop Optimization**: User flows must be tailored specifically to desktop mice/keyboards and mobile touch gestures alike.
9. **Non-Intrusive Authentication**: Exploration and discovery remain accessible without forced login walls.

---

## 2. Primary Product Journey

The high-level user progression spans seven sequential phases:

```text
Discover ──► Explore ──► Save ──► Plan ──► Organize ──► Travel ──► Remember
```

* **Discover**: Discovering destinations, curated stays, and trending activities on public landing views.
* **Explore**: Inspecting detailed destination highlights, stay amenity specs, and experience guides.
* **Save**: Bookmarking interesting destinations, stays, or experiences into user collections.
* **Plan**: Creating structured trip containers with destination targets and trip dates.
* **Organize**: Structuring saved items and activities into day-by-day itinerary time blocks.
* **Travel**: Referencing active mobile itineraries while traveling.
* **Remember**: Retaining completed trips and past itineraries in user travel history for future reference.

---

## 3. First-Time Visitor Flow

Unauthenticated visitors can freely explore the platform before being prompted to log in for persistent personal actions.

```text
Landing Page (Home)
        │
        ▼
Browse & Discover Destinations
        │
        ▼
Destination Details View
        │
        ▼
Explore Stays / Experiences
        │
        ▼
Click "Save Place" OR "Create Trip"
        │
        ▼
Authentication Required Modal
        │
        ▼
Sign Up / Sign In
        │
        ▼
Return to Original Context & Complete Action
```

### Key Requirement
Public users can freely browse destinations, inspect stays, search, filter, and read reviews **without creating an account**. Account creation is only requested when persistent state (saving items, creating trips, writing reviews) is initiated.

---

## 4. Destination Discovery Flow

```text
Home Page
   │
   ▼
Destination Discovery Page
   │
   ▼
Apply Search / Filters (Category, Region, Style)
   │
   ▼
View Filtered Destination Results
   │
   ▼
Select Destination Card
   │
   ▼
Navigate to Destination Details Page
```

### Flow Details
1. User enters search term or selects category tags on the discovery page.
2. Filter drawer allows narrowing results by travel style or region.
3. User selects a destination card to enter its detailed profile.
4. Breadcrumb navigation allows one-click return to filtered discovery results.

---

## 5. Destination Exploration Flow

```text
Destination Details Page
├── Overview Section ──► Read Highlights & Travel Tips
├── Things To Do Section ──► Inspect Local Sights
├── Recommended Stays ──► Click Stay Card for Stay Details
├── Experiences Section ──► Click Experience Card for Details
├── Save Destination Button ──► Trigger Save Flow
└── Add Destination to Trip Button ──► Trigger Trip Creation / Addition Flow
```

---

## 6. Search Flow

Unified search handling across destinations, stays, and experiences:

```text
Search Input Field (Header or Hero)
        │
        ▼
Type Search Query (Auto-complete dropdown updates)
        │
        ▼
Press Enter / Submit
        │
        ▼
Search Results Page (Tabs: All | Destinations | Stays | Experiences)
        │
     ┌──┴────────────────────────┬────────────────────────┐
     ▼                           ▼                        ▼
Filter Results               Sort Results            Clear Search
     │                           │                        │
     ▼                           ▼                        ▼
Updated Grid View          Reordered Grid View     Reset to Default State
```

### Edge & State Handling
* **Empty Query**: Displays popular trending search terms and categories.
* **No Results**: Displays "No results found matching your query" with a single-click "Clear All Filters" button.
* **Loading State**: Displays animated skeleton cards while fetching API results.
* **Error State**: Displays a friendly error banner with a "Retry Search" button.

---

## 7. Stay Discovery Flow

```text
Stay Listing Page
        │
        ▼
Apply Filters (Property Type, Price Range, Amenities)
        │
        ▼
View Filtered Stay Cards
        │
        ▼
Click Stay Card
        │
        ▼
Stay Details Page (Gallery, Amenities, Location, Reviews)
        │
     ┌──┴────────────────────────────────┐
     ▼                                   ▼
Click "Save Stay"             Click "Add Stay to Trip"
     │                                   │
     ▼                                   ▼
Save Item Flow                  Add to Trip Flow
```

---

## 8. Experience Discovery Flow

```text
Experience Listing Page
        │
        ▼
Filter / Sort (Category, Duration, Rating)
        │
        ▼
Experience Details Page (Duration, Location, Highlights, Price Tier)
        │
     ┌──┴────────────────────────────────┐
     ▼                                   ▼
Click "Save Experience"        Click "Add Experience to Trip"
     │                                   │
     ▼                                   ▼
Save Item Flow                  Add to Trip Flow
```

---

## 9. Save / Favorite Flow

### Flow Logic

```text
User Clicks Save (Heart Icon) on Item Card
                  │
        Is User Authenticated?
        ┌─────────┴─────────┐
       YES                 NO
        │                   │
        ▼                   ▼
Item Saved Immediately    Trigger Auth Modal
(Heart turns filled)        │
                            ▼
                     User Signs In / Signs Up
                            │
                            ▼
                     Return to Context & Complete Save
```

### Unsave & Management
* Clicking a filled heart icon immediately unsaves the item and updates UI state.
* Users can view all saved items on their central **Saved Places** page, organized under *Destinations*, *Stays*, and *Experiences* tabs.

---

## 10. Authentication Flow

### Sign Up Flow

```text
Sign Up Form
     │
     ▼
Enter Name, Email, Password
     │
     ▼
Form Client-Side Validation
     │
     ▼
Submit Credentials ──► (Error? Display Inline Alert)
     │
     ▼
Account Created & Token Stored
     │
     ▼
Redirect to Intended Destination / Dashboard
```

### Sign In Flow

```text
Sign In Form ──► Enter Email & Password ──► Submit
     │
  Valid?
  ┌──┴──┐
 YES    NO ──► Display "Invalid email or password" Error
  │
  ▼
Authenticated Session Started ──► Return to Previous Page Context
```

### Sign Out Flow

```text
User Menu ──► Click "Sign Out" ──► Clear Session Tokens ──► Redirect to Public Home Page
```

---

## 11. Trip Creation Flow

```text
Trigger: "Create Trip" (Header, Destination Page, or Saved Places)
                           │
                           ▼
                   Create Trip Modal
                           │
                           ▼
          Enter Trip Name (e.g., "Tokyo Autumn Tour")
                           │
                           ▼
             Select Destination Target
                           │
                           ▼
            Set Start Date & End Date
                           │
                           ▼
               Click "Create Trip"
                           │
                           ▼
     Redirect to Newly Created Trip Itinerary Workspace
```

---

## 12. Add to Existing Trip Flow

```text
User Browsing Destination / Stay / Experience
                     │
                     ▼
        Click "Add to Trip" Button
                     │
                     ▼
             Select Trip Modal
                     │
     ┌───────────────┴───────────────┐
     ▼                               ▼
Select Existing Trip          Click "Create New Trip"
     │                               │
     ▼                               ▼
Select Itinerary Day           New Trip Flow ──► Select Day
     │                               │
     └───────────────┬───────────────┘
                     │
                     ▼
          Assign to Time Slot / Day
                     │
                     ▼
        Success Toast Notification ("Item added to Day 2")
```

---

## 13. Itinerary Building Flow

```text
Trip Itinerary Workspace
        │
        ▼
Select Target Day (e.g., "Day 1 — Oct 12")
        │
        ▼
Click "Add Activity / Place"
        │
     ┌──┴──────────────────────────────┐
     ▼                                 ▼
Select Saved Place / Item         Add Custom Note Activity
     │                                 │
     └────────────────┬────────────────┘
                      │
                      ▼
        Configure Time Slot & Notes
                      │
                      ▼
         Save Activity to Timeline
```

### Timeline Visual Structure Example

```text
Day 1 (Friday, Oct 12)
├── 09:00 AM — Morning Coffee & Pastry (Custom Activity)
├── 10:30 AM — Tsukiji Outer Market Experience (Experience Item)
├── 02:00 PM — Hotel Check-in (Stay Item)
└── 07:00 PM — Shibuya Night Food Tour (Experience Item)
```

### Interaction Actions
* **Reorder**: Drag-and-drop or move up/down buttons to reorder items within a day.
* **Move Day**: Shift an activity from Day 1 to Day 2 via item edit modal.
* **Remove**: Click trash/remove icon to delete item from itinerary after brief confirmation.

---

## 14. Trip Management Flow

```text
User Dashboard ──► Trips Section
                        │
    ┌───────────────────┼───────────────────┬───────────────────┐
    ▼                   ▼                   ▼                   ▼
Draft Trips      Upcoming Trips       Active Trips       Completed Trips
    │                   │                   │                   │
    └───────────────────┴─────────┬─────────┴───────────────────┘
                                  │
                                  ▼
                         Select Trip Action
                        ┌─────────┼─────────┐
                        ▼         ▼         ▼
                    Edit Trip  View Day  Delete Trip
                    Metadata   Itinerary (Confirm Prompt)
```

---

## 15. Review Flow

```text
Item Detail Page (Stay / Experience / Destination)
                       │
                       ▼
            Click "Write a Review"
                       │
             Is User Authenticated?
             ┌─────────┴─────────┐
            YES                 NO ──► Trigger Auth Modal
             │
             ▼
      Review Form Modal
      ├── Select Star Rating (1 to 5 Stars)
      ├── Enter Written Review Text
      └── Click "Submit Review"
             │
             ▼
     Client Validation Pass?
     ┌───────┴───────┐
    YES             NO ──► Highlight missing fields
     │
     ▼
API Submission ──► Display Toast "Review submitted successfully" ──► Render Review Inline
```

---

## 16. Travel History Flow

```text
Account Dashboard ──► Travel History Tab
                            │
                            ▼
              Browse Past Completed Trips
                            │
                            ▼
              Select Completed Trip Card
                            │
                            ▼
          View Read-Only Past Itinerary & Notes
```

---

## 17. Notification Flow

```text
System Trigger (e.g., Trip starting in 2 days)
                    │
                    ▼
 Notification Banner / Badge Counter Updates
                    │
                    ▼
 User Opens Notification Menu
                    │
                    ▼
 Select Notification Item ──► Redirect to Specific Trip Itinerary Page
```

---

## 18. Account Flow

```text
Account Dashboard
├── Profile Settings ──► Edit Name, Avatar, Bio, Preferences
├── Saved Places Tab ──► Manage Saved Destinations/Stays/Experiences
├── Trips Tab ──► View & Manage Draft, Upcoming, and Active Trips
├── Travel History ──► Revisit Completed Trips
└── Account Security ──► Update Password & Authentication Settings
```

---

## 19. Mobile Navigation Flow

Mobile users navigate via touch-optimized elements tailored for small screens:

```text
Top Navigation Bar (Logo + Search Icon + Notifications)
───────────────────────────────────────────────────────
Main Content View (Single-column layout)
───────────────────────────────────────────────────────
Sticky Bottom Navigation Bar:
[ Home ]  [ Discover ]  [ Saved ]  [ Trips ]  [ Account ]
```

### Mobile UX Guidelines
* Search drawer opens full-screen on mobile when search icon is tapped.
* Filters open in a slide-up **Bottom Sheet** overlay.
* Floating action buttons (e.g., "+ Create Trip") sit sticky near bottom corners.
* Back navigation uses standard browser back behavior and top-left arrow headers.

---

## 20. Error Recovery Flows

Every error state presents clear guidance on what went wrong and how to recover:

```text
Action Triggered (e.g., Save Place / Fetch Trips)
                        │
                        ▼
                 Network / API Failure
                        │
                        ▼
            Display Contextual Error Banner
            "Unable to connect to service."
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
   Click "Retry" Button     Click "Dismiss"
            │                       │
            ▼                       ▼
   Re-attempt Operation     Clear Alert State
```

---

## 21. Loading & Empty Flows

### Loading Flow
Data-fetching components display visual layout skeletons during network requests to minimize layout shift.

### Empty State Flows

```text
No Saved Items
     └─► Display Illustration ──► "Your saved list is empty" ──► CTA: [ Explore Destinations ]
```

```text
No Trips Created
     └─► Display Illustration ──► "You have no upcoming trips" ──► CTA: [ Create Your First Trip ]
```

```text
No Search Results
     └─► Display Illustration ──► "No matches for your search" ──► CTA: [ Reset All Filters ]
```

---

## 22. Protected Action Rules

The system maintains a strict separation between public discovery and authenticated state mutation:

| Action | Public (Guest) | Authenticated User | Action on Unauthenticated Trigger |
| :--- | :---: | :---: | :--- |
| Browse Home & Destinations | **Allowed** | **Allowed** | Direct access |
| Search & Filter Content | **Allowed** | **Allowed** | Direct access |
| View Stay & Experience Details | **Allowed** | **Allowed** | Direct access |
| Read Reviews & Ratings | **Allowed** | **Allowed** | Direct access |
| Save Place / Favorite | Blocked | **Allowed** | Prompt Authentication Modal |
| Create / Edit Trip | Blocked | **Allowed** | Prompt Authentication Modal |
| Add Item to Itinerary | Blocked | **Allowed** | Prompt Authentication Modal |
| Submit Review & Rating | Blocked | **Allowed** | Prompt Authentication Modal |
| Manage Account Settings | Blocked | **Allowed** | Redirect to Sign In Page |

---

## 23. Cross-Feature Relationships

```text
[ Destination Detail ]
        │
        ├───────────────────────┬───────────────────────┐
        ▼                       ▼                       ▼
  Save Destination       Explore Stay           Explore Experience
        │                       │                       │
        ▼                       ▼                       ▼
  Saved Places            Save Stay              Save Experience
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
                       Create / Select Trip
                                │
                                ▼
                        Itinerary Builder
                                │
                                ▼
                         Completed Trip
                                │
                                ▼
                         Travel History
```

---

## 24. Flow Quality Rules

1. **Zero Dead Ends**: Every flow must conclude with a clear next action or return navigation path.
2. **Obvious Primary Actions**: Primary buttons (e.g., *Create Trip*, *Save*) must use high-contrast brand styling.
3. **Preserve User Intent**: When auth intercepts an action (e.g., Save), complete the intended action automatically post-login.
4. **Unrestricted Exploration**: Never force login to browse destinations, stays, or experiences.
5. **Immediate Feedback**: Update UI state instantly upon user interaction before network resolution where appropriate.
6. **Explicit Loading & Empty States**: Never leave a screen blank while loading or when empty.
7. **Confirmation for Destructive Actions**: Always require explicit confirmation before deleting trips or itinerary items.
8. **Simple Itinerary Assembly**: Adding items to daily itinerary slots must be achievable in 3 taps/clicks or fewer.
9. **Native-Feeling Mobile Flows**: Mobile navigation must rely on bottom bars and slide-up sheets rather than squeezed desktop elements.
10. **Smooth Motion**: Use motion purposefully; avoid flashy animations that degrade interaction speed.
11. **No Intrusive Popups**: Avoid unexpected modal popups or promotional overlays.
12. **Complete Flow Definitions**: Every interaction must account for success, failure, loading, and empty scenarios.
