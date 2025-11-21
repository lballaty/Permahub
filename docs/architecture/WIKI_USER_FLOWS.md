# Wiki User Flows & Interactions

**File:** `/docs/architecture/WIKI_USER_FLOWS.md`

**Description:** Detailed user journey diagrams, interaction flows, and use case scenarios for the Permahub Wiki

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-21

---

## Overview

This document contains detailed user flow diagrams showing:
- Main user journeys
- Content discovery flows
- Creation and editing workflows
- Authentication flows
- Personalization and collection features

---

## Diagram 1: User Journey Overview

```mermaid
graph LR
    Landing["User Lands<br/>on Wiki"]

    Discover["Content Discovery<br/>- Search<br/>- Browse<br/>- Filter<br/>- Map"]

    Read["Read Content<br/>- View guide<br/>- Check event<br/>- Explore location"]

    Decide{Interested in<br/>Contributing?}

    No["Continue Browsing<br/>as Guest"]

    Yes["Register or<br/>Login"]

    Create["Create Content<br/>- Write guide<br/>- Add event<br/>- List location"]

    Share["Share & Collaborate<br/>- Publish<br/>- Promote<br/>- Collect feedback"]

    Manage["Manage Content<br/>- View analytics<br/>- Edit<br/>- Organize"]

    Landing --> Discover
    Discover --> Read
    Read --> Decide
    Decide -->|No| No
    Decide -->|Yes| Yes
    Yes --> Create
    Create --> Share
    Share --> Manage
    No --> Discover

    style Landing fill:#fff9c4
    style Discover fill:#e1f5ff
    style Read fill#e8f5e9
    style Decide fill#fff3e0
    style Create fill#f3e5f5
    style Share fill#c8e6c9
    style Manage fill#bbdefb
```

---

## Diagram 2: First-Time User Onboarding

```mermaid
graph TD
    A["User Arrives<br/>at wiki-home.html"]
    B["See Featured<br/>Content & Categories"]
    C["Explore Options"]

    D{Action?}

    E["Browse Guides<br/>wiki-guides.html"]
    F["View Events<br/>wiki-events.html"]
    G["Explore Map<br/>wiki-map.html"]
    H["Read About<br/>wiki-about.html"]

    I["Found Interesting<br/>Content"]
    J["Want to<br/>Share Knowledge?"]

    K{Yes?}

    L["Click 'Create<br/>Account'"]
    M["wiki-signup.html<br/>or<br/>wiki-login.html"]

    N["Choose Auth:<br/>Email/Password<br/>or<br/>Magic Link"]

    O["Verify Email"]

    P["Complete Profile<br/>- Name<br/>- Location<br/>- Bio<br/>- Skills"]

    Q["Ready to<br/>Contribute!"]

    R["Click Create<br/>Guide/Event"]

    S["wiki-editor.html<br/>Rich Editor<br/>with Categories"]

    T["Publish or<br/>Save Draft"]

    U["Success!<br/>Content Published"]

    A --> B
    B --> C
    C --> D
    D -->|Guides| E
    D -->|Events| F
    D -->|Map| G
    D -->|Learn More| H
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J
    J --> K
    K -->|Yes| L
    K -->|No| C
    L --> M
    M --> N
    N --> O
    O --> P
    P --> Q
    Q --> R
    R --> S
    S --> T
    T --> U

    style A fill:#fff9c4
    style M fill#f3e5f5
    style O fill#fff3e0
    style P fill#e8f5e9
    style Q fill#c8e6c9
    style S fill#bbdefb
    style U fill#f8bbd0
```

---

## Diagram 3: Content Discovery Flow

```mermaid
graph TD
    Home["wiki-home.html<br/>Homepage"]

    Search["Search Bar"]
    Categories["Browse Categories"]
    Featured["View Featured"]
    Map["View Map"]

    SearchInput["Enter keyword"]
    Results["Search Results<br/>wiki-guides.html"]

    CatSelect["Select Category"]
    CatResults["Filtered Guides"]

    MapOpen["Click 'Map View'<br/>wiki-map.html"]
    MapBrowse["Explore Locations"]
    LocationClick["Click Marker"]
    LocationDetail["wiki-page.html"]

    FeatClick["Click Featured"]
    FeatDetail["wiki-page.html"]

    ReadContent["Read Guide/<br/>Event/<br/>Location"]

    Save["Click Bookmark"]
    Saved["✓ Added to<br/>Favorites"]

    Share["Share Link"]
    Contact["Message Author"]

    More["Explore<br/>Related"]

    Home --> Search
    Home --> Categories
    Home --> Featured
    Home --> Map

    Search --> SearchInput
    SearchInput --> Results

    Categories --> CatSelect
    CatSelect --> CatResults

    Map --> MapOpen
    MapOpen --> MapBrowse
    MapBrowse --> LocationClick
    LocationClick --> LocationDetail

    Featured --> FeatClick
    FeatClick --> FeatDetail

    Results --> ReadContent
    CatResults --> ReadContent
    LocationDetail --> ReadContent
    FeatDetail --> ReadContent

    ReadContent --> Save
    Save --> Saved

    Saved --> Share
    Saved --> Contact
    Saved --> More

    style Home fill:#fff9c4
    style Search fill#e1f5ff
    style SearchInput fill#fff3e0
    style Results fill#e8f5e9
    style ReadContent fill#c8e6c9
    style Saved fill#f8bbd0
```

---

## Diagram 4: Content Creation Workflow

```mermaid
graph TD
    User["Authenticated User"]
    Click["Click 'Create'<br/>in Header"]
    Modal["Modal Menu<br/>- New Guide<br/>- New Event<br/>- New Location"]

    Guide["Create Guide"]
    Event["Create Event"]
    Location["Create Location"]

    EditorPage["wiki-editor.html<br/>Rich Text Editor<br/>Quill.js"]

    Title["Fill Title<br/>Slug auto-generated"]
    Content["Write Content<br/>Rich editor"]
    Category["Select Category<br/>Multi-select"]
    Featured["Add Featured Image<br/>Optional"]
    Metadata["Add Metadata<br/>Event date/time<br/>Location details"]

    SaveDraft["Click 'Save Draft'"]
    DraftSaved["✓ Saved as Draft<br/>Private, only you see"]
    ViewDraft["View in<br/>wiki-my-content.html"]
    EditDraft["Make more edits"]

    Publish["Click 'Publish'"]
    Review["Review before<br/>publishing<br/>- Preview<br/>- Check content<br/>- Verify metadata"]

    Confirm["Confirm Publish"]
    Live["✓ Live on Wiki!<br/>Visible to all"]

    Share["Copy Link"]
    Promote["Promote on<br/>Social Media"]

    User --> Click
    Click --> Modal
    Modal --> Guide
    Modal --> Event
    Modal --> Location

    Guide --> EditorPage
    Event --> EditorPage
    Location --> EditorPage

    EditorPage --> Title
    Title --> Content
    Content --> Category
    Category --> Featured
    Featured --> Metadata

    Metadata --> SaveDraft
    SaveDraft --> DraftSaved
    DraftSaved --> ViewDraft
    ViewDraft --> EditDraft
    EditDraft --> Content
    Content --> Publish
    Publish --> Review
    Review --> Confirm
    Confirm --> Live
    Live --> Share
    Share --> Promote

    style User fill:#fff9c4
    style EditorPage fill#f3e5f5
    style Content fill#e1f5ff
    style DraftSaved fill#fff3e0
    style Publish fill#e8f5e9
    style Live fill#c8e6c9
    style Promote fill#f8bbd0
```

---

## Diagram 5: Authentication Flow

```mermaid
sequenceDiagram
    participant User as User<br/>Browser
    participant Wiki as Wiki Frontend<br/>wiki-login.html
    participant Auth as Supabase<br/>Auth Service
    participant DB as PostgreSQL<br/>Users Table

    User->>Wiki: 1. Click 'Login'
    Wiki->>Wiki: Load login page
    Wiki->>Wiki: Show auth options

    User->>Wiki: 2a. Choose<br/>Email/Password
    Wiki->>Wiki: Show email/password form
    User->>Wiki: Enter credentials
    Wiki->>Auth: POST /auth/v1/token<br/>(email, password)

    Auth->>DB: Look up user
    DB-->>Auth: User found
    Auth->>Auth: Compare password hash
    Auth-->>Wiki: 200 OK<br/>(access_token, refresh_token)

    Wiki->>Wiki: Store token in<br/>localStorage
    Wiki->>Wiki: Redirect to<br/>wiki-home.html
    Wiki-->>User: ✓ Login successful

    User->>Wiki: 2b. Choose<br/>Magic Link
    Wiki->>Wiki: Show email form
    User->>Wiki: Enter email
    Wiki->>Auth: POST /auth/v1/otp<br/>(email)
    Auth->>Auth: Generate one-time<br/>link
    Auth->>User: Email with<br/>magic link
    User->>User: Click link in email
    Wiki->>Auth: /auth/v1/verify (token)
    Auth-->>Wiki: 200 OK<br/>(session created)
    Wiki-->>User: ✓ Authenticated!

    note over Wiki,DB
        Token stored for future requests
        Automatic token refresh on expiry
    end
```

---

## Diagram 6: Favorites & Collections Flow

```mermaid
graph TD
    ViewContent["View Guide/<br/>Event/<br/>Location"]

    Bookmark["Click<br/>Bookmark<br/>Icon"]

    AddFav["Add to Favorites"]

    FavAdded["✓ Added<br/>to Favorites"]

    ViewFav["Go to<br/>wiki-favorites.html"]

    AllFav["View All<br/>Favorites<br/>- Guides<br/>- Events<br/>- Locations"]

    CreateColl["Click<br/>'New Collection'"]

    CollName["Enter Name<br/>& Description"]

    CollCreated["✓ Collection<br/>Created"]

    AddItems["Select Items<br/>to Add<br/>- Guides<br/>- Events<br/>- Locations"]

    ItemsAdded["✓ Items Added<br/>to Collection"]

    Share["Mark Collection<br/>as Public"]

    ShareLink["Get Shareable<br/>Link"]

    Edit["Edit Collection<br/>- Add more items<br/>- Reorder<br/>- Remove items"]

    ViewContent --> Bookmark
    Bookmark --> AddFav
    AddFav --> FavAdded
    FavAdded --> ViewFav

    ViewFav --> AllFav
    AllFav --> CreateColl
    CreateColl --> CollName
    CollName --> CollCreated
    CollCreated --> AddItems
    AddItems --> ItemsAdded
    ItemsAdded --> Share
    Share --> ShareLink
    ItemsAdded --> Edit

    style ViewContent fill:#e1f5ff
    style Bookmark fill#fff3e0
    style FavAdded fill#c8e6c9
    style ViewFav fill#e8f5e9
    style CreateColl fill#f3e5f5
    style CollCreated fill#c8e6c9
    style ItemsAdded fill#f8bbd0
    style Edit fill#bbdefb
```

---

## Diagram 7: Event Participation Flow

```mermaid
graph TD
    Home["User on<br/>wiki-home.html"]

    Events["Click 'Events'<br/>or 'Explore Events'"]

    EventList["wiki-events.html<br/>Event Browser"]

    Filter["Filter Events<br/>- Time<br/>- Type<br/>- Location"]

    CalendarView["View Calendar<br/>or List"]

    Click["Click Event"]

    EventDetail["wiki-page.html<br/>?slug=event"]

    Details["View Details<br/>- Date & Time<br/>- Location<br/>- Description<br/>- Organizer<br/>- Contact info"]

    Interested["Click 'Register'<br/>or<br/>'Learn More'"]

    External["Go to<br/>Registration URL<br/>(external site)"]

    Back["Return to Wiki"]

    Bookmark["Click<br/>'Bookmark'"]

    Saved["✓ Added to<br/>Favorites"]

    Home --> Events
    Events --> EventList
    EventList --> Filter
    Filter --> CalendarView
    CalendarView --> Click
    Click --> EventDetail
    EventDetail --> Details
    Details --> Interested
    Interested --> External
    External --> Back
    Back --> Home
    Details --> Bookmark
    Bookmark --> Saved

    style Home fill:#fff9c4
    style EventList fill#e1f5ff
    style EventDetail fill#e8f5e9
    style Details fill#fff3e0
    style Interested fill#f3e5f5
    style Saved fill#c8e6c9
```

---

## Diagram 8: Geographic Discovery Flow

```mermaid
graph TD
    Home["wiki-home.html"]
    MapBtn["Click 'View Map'<br/>or go to<br/>wiki-map.html"]

    MapLoad["Map Initializes<br/>- Center on user<br/>location (if allowed)<br/>- Or center on world"]

    AllMarkers["Load All<br/>Locations<br/>- Farms<br/>- Gardens<br/>- Businesses<br/>- Education<br/>- Community"]

    Display["Display Markers<br/>with icons<br/>by type"]

    Filter["Click Type<br/>Filter"]

    Filtered["Show only<br/>selected type"]

    Search["Use Search<br/>to find by name"]

    Results["Filter by<br/>name search"]

    Hover["Hover over<br/>Marker"]

    Tooltip["Show Popup<br/>- Name<br/>- Type<br/>- Contact"]

    Click["Click Marker"]

    Details["Open<br/>wiki-page.html<br/>Full Details<br/>- Address<br/>- Hours<br/>- Website<br/>- Contact"]

    Navigate["Click<br/>'Get Directions'"]

    Maps["Open<br/>Google Maps/<br/>Apple Maps"]

    Contact["Click Email<br/>or Phone"]

    Email["Send Email/<br/>Make Call"]

    Bookmark["Bookmark<br/>Location"]

    Home --> MapBtn
    MapBtn --> MapLoad
    MapLoad --> AllMarkers
    AllMarkers --> Display
    Display --> Filter
    Filter --> Filtered
    Filtered --> Search
    Search --> Results
    Results --> Hover
    Hover --> Tooltip
    Tooltip --> Click
    Click --> Details
    Details --> Navigate
    Navigate --> Maps
    Details --> Contact
    Contact --> Email
    Details --> Bookmark

    style Home fill:#fff9c4
    style MapLoad fill#e1f5ff
    style Display fill#e8f5e9
    style Details fill#f3e5f5
    style Maps fill#fff3e0
    style Bookmark fill#c8e6c9
```

---

## Diagram 9: Content Management Workflow

```mermaid
graph TD
    User["Authenticated User"]
    MyContent["Click Profile<br/>→ 'My Content'"]

    Page["wiki-my-content.html<br/>Content Dashboard"]

    View["View All<br/>Content:<br/>- Drafts<br/>- Published<br/>- Archived"]

    Tabs["Switch Tabs:<br/>Guides | Events<br/>| Locations"]

    Select["Select a<br/>Content Item"]

    Options["Options Menu"]

    Edit["Click 'Edit'"]
    EditPage["wiki-editor.html<br/>Pre-filled<br/>with content"]
    Save["Save Changes"]
    Updated["✓ Updated"]

    View_["Click 'View'"]
    ViewPage["wiki-page.html<br/>Read-only preview"]
    Back["Go back"]

    Duplicate["Click 'Duplicate'"]
    DupForm["New editor<br/>with copied content<br/>as draft"]
    Modify["Make changes"]
    Publish["Publish"]

    Archive["Click 'Archive'"]
    ConfirmArch["Confirm archive"]
    Archived["✓ Archived<br/>Hidden from public<br/>Can restore"]

    Delete["Click 'Delete'"]
    ConfirmDel["Confirm delete"]
    Deleted["✓ Deleted<br/>Moved to<br/>deleted_content"]

    Stats["View Stats<br/>- View count<br/>- Created date<br/>- Comments"]

    User --> MyContent
    MyContent --> Page
    Page --> View
    View --> Tabs
    Tabs --> Select
    Select --> Options
    Options --> Edit
    Options --> View_
    Options --> Duplicate
    Options --> Archive
    Options --> Delete
    Options --> Stats

    Edit --> EditPage
    EditPage --> Save
    Save --> Updated

    View_ --> ViewPage
    ViewPage --> Back
    Back --> Page

    Duplicate --> DupForm
    DupForm --> Modify
    Modify --> Publish

    Archive --> ConfirmArch
    ConfirmArch --> Archived

    Delete --> ConfirmDel
    ConfirmDel --> Deleted

    style User fill:#fff9c4
    style Page fill#e8f5e9
    style Edit fill#f3e5f5
    style EditPage fill#bbdefb
    style Updated fill#c8e6c9
    style Deleted fill#ffcdd2
```

---

## Diagram 10: Multi-Language Content Experience

```mermaid
graph TD
    PageLoad["User Loads<br/>wiki-page.html"]

    CheckLang["Check<br/>localStorage<br/>language"]

    UserLang["Get user<br/>selected language<br/>Default: English"]

    FetchContent["Fetch content<br/>from database"]

    HasTranslation{Translation<br/>exists for<br/>user language?}

    Yes["✓ Yes"]
    No["❌ No"]

    LoadTrans["Load translated<br/>version<br/>- Title<br/>- Content<br/>- Categories"]

    LoadDefault["Fall back to<br/>English/Original"]

    Display["Display to<br/>User"]

    UserSwitches["User clicks<br/>Language<br/>Selector"]

    NewLang["Select<br/>New Language"]

    SavePref["Save to<br/>localStorage"]

    Refresh["Page<br/>re-renders<br/>in new language"]

    NewDisplay["Display updated<br/>content"]

    PageLoad --> CheckLang
    CheckLang --> UserLang
    UserLang --> FetchContent
    FetchContent --> HasTranslation
    HasTranslation --> Yes
    HasTranslation --> No
    Yes --> LoadTrans
    No --> LoadDefault
    LoadTrans --> Display
    LoadDefault --> Display
    Display --> UserSwitches
    UserSwitches --> NewLang
    NewLang --> SavePref
    SavePref --> Refresh
    Refresh --> NewDisplay

    style PageLoad fill:#fff9c4
    style UserLang fill#e1f5ff
    style FetchContent fill#fff3e0
    style HasTranslation fill#f3e5f5
    style LoadTrans fill#c8e6c9
    style Display fill#bbdefb
    style NewDisplay fill#f8bbd0
```

---

## Use Cases Summary

| Use Case | Actor | Goal | Steps |
|----------|-------|------|-------|
| Browse Content | Anonymous User | Find useful guides and events | Home → Search/Filter → Read → Save/Share |
| Create Guide | Authenticated User | Share knowledge | Login → Create → Write → Publish |
| Discover Locations | Any User | Find permaculture projects nearby | View Map → Filter → Explore Details |
| Organize Content | Authenticated User | Curate content collections | Favorites → Create Collection → Add Items |
| Participate in Event | Any User | Register for workshop/meetup | View Events → Select → Register via link |
| Manage Content | Content Creator | Maintain published content | My Content → Select → Edit/Archive/Delete |
| Provide Feedback | Any User | Report issues with content | Click Report → Submit Form |
| Access Offline | Any User | Use app without internet | Browser caches PWA → View cached content |

---

## Related Documents

- [WIKI_SYSTEM_ARCHITECTURE.md](./WIKI_SYSTEM_ARCHITECTURE.md) - Technical implementation of flows
- [WIKI_FRONTEND_DESIGN.md](./WIKI_FRONTEND_DESIGN.md) - UI components for flows
- [WIKI_DATA_MODEL.md](./WIKI_DATA_MODEL.md) - Data structures involved

---

**Status:** Complete

**Last Review:** 2025-11-21
