# Wiki System Architecture

**File:** `/docs/architecture/WIKI_SYSTEM_ARCHITECTURE.md`

**Description:** System-level architecture diagrams and integration patterns for the Permahub Wiki

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-21

---

## Overview

This document contains system-level architecture diagrams showing:
- Layered system architecture
- Frontend-Backend integration
- Authentication and authorization flows
- External service dependencies
- Request-response patterns

---

## Diagram 1: Layered System Architecture

```mermaid
graph TB
    User["👤 User Browser"]

    subgraph Presentation["Presentation Layer (Browser)"]
        HTML["HTML<br/>21 Pages"]
        CSS["CSS Styling<br/>Design System"]
        JS["JavaScript<br/>25 Modules"]
    end

    subgraph BusinessLogic["Business Logic Layer"]
        WikiAPI["Wiki API Wrapper<br/>wiki-supabase.js"]
        Auth["Authentication<br/>Manager"]
        I18n["Translation<br/>System"]
        Utils["Utilities<br/>Location, PWA"]
    end

    subgraph DataAccess["Data Access Layer"]
        SupabaseClient["Supabase<br/>REST Client"]
        LocalStorage["Browser<br/>LocalStorage<br/>(Tokens, Prefs)"]
        Cache["In-Memory<br/>Cache"]
    end

    subgraph Backend["Backend Layer (Supabase)"]
        Auth_Service["Authentication<br/>Service"]
        REST_API["REST API<br/>v1"]
        RLS_Engine["Row-Level<br/>Security"]
    end

    subgraph Database["Database Layer"]
        Content["Content Tables<br/>guides, events, locations"]
        Relationships["Relationship Tables<br/>favorites, categories"]
        Translations["Translation Tables<br/>i18n content"]
        PostGIS["PostGIS<br/>Location index"]
    end

    ExternalServices["🌐 External Services<br/>Font Awesome, Quill.js<br/>Leaflet.js, CDNs"]

    User --> Presentation
    Presentation --> BusinessLogic
    BusinessLogic --> DataAccess
    DataAccess --> Backend
    Backend --> Database
    Database -.RLS Policies.-> Backend
    Presentation --> ExternalServices
    DataAccess --> LocalStorage
    DataAccess --> Cache

    style Presentation fill:#e1f5ff
    style BusinessLogic fill:#fff3e0
    style DataAccess fill:#f3e5f5
    style Backend fill:#e8f5e9
    style Database fill:#fce4ec
    style User fill:#fff9c4
    style ExternalServices fill:#eceff1
```

---

## Diagram 2: Frontend-Backend Integration

```mermaid
graph LR
    subgraph Frontend["Frontend (Browser)"]
        Page["Page<br/>wiki-*.html"]
        Module["Page Module<br/>wiki-*.js"]
        WikiAPI["WikiSupabaseAPI<br/>Wrapper"]
    end

    subgraph Network["HTTP/HTTPS"]
        Request["REST Request"]
        Response["JSON Response"]
    end

    subgraph Backend["Supabase Backend"]
        Auth_Check["Auth Token<br/>Validation"]
        RLS["Row-Level<br/>Security<br/>Evaluation"]
        Query["SQL Query<br/>Execution"]
    end

    subgraph Database["PostgreSQL"]
        Tables["Tables"]
        PostGIS["PostGIS"]
    end

    Page -->|"Initialize"| Module
    Module -->|"Call API"| WikiAPI
    WikiAPI -->|"GET/POST/PATCH"| Request
    Request -->|"HTTP"| Auth_Check
    Auth_Check -->|"Valid Token?"| RLS
    RLS -->|"Check Policies"| Query
    Query -->|"Execute"| Tables
    Tables -->|"Results"| Response
    Response -->|"JSON"| WikiAPI
    WikiAPI -->|"Parse & Render"| Page

    style Frontend fill:#e1f5ff
    style Network fill:#f0f0f0
    style Backend fill:#e8f5e9
    style Database fill:#fce4ec
```

---

## Diagram 3: Authentication & Authorization Flow

```mermaid
graph TD
    User["User"]

    subgraph Auth["Authentication (Supabase Auth)"]
        Login["Login/Signup<br/>email + password<br/>or magic link"]
        Session["Session Token<br/>Generated"]
        Store["Token stored in<br/>localStorage"]
    end

    subgraph Request["API Request"]
        TokenCheck["Include token<br/>in header"]
        Validate["Validate<br/>signature"]
    end

    subgraph Authorization["Authorization (RLS)"]
        RLS_Check["RLS Policies<br/>Evaluate"]
        Public["Public?<br/>status=published"]
        Owner["Owner?<br/>auth.uid()=author_id"]
        Allow["ALLOW"]
        Deny["DENY"]
    end

    Response["Return Data<br/>or Error 403"]

    User -->|"1. Authenticate"| Login
    Login -->|"Success"| Session
    Session --> Store
    Store -->|"2. Next API Call"| TokenCheck
    TokenCheck -->|"3. Send Request"| Validate
    Validate -->|"4. Evaluate Policies"| RLS_Check
    RLS_Check -->|"Is public?"| Public
    RLS_Check -->|"Am I owner?"| Owner
    Public -->|"Yes"| Allow
    Owner -->|"Yes"| Allow
    Public -->|"No"| Deny
    Owner -->|"No"| Deny
    Allow --> Response
    Deny --> Response

    style Auth fill:#c8e6c9
    style Request fill:#bbdefb
    style Authorization fill:#ffe0b2
    style Response fill:#f8bbd0
```

---

## Diagram 4: Data Flow - Content Discovery

```mermaid
graph LR
    User["User<br/>Browser"]

    subgraph Frontend["Frontend"]
        Home["wiki-home.html"]
        HomeJS["wiki-home.js<br/>- Initialize page<br/>- Load categories<br/>- Load featured guides"]
    end

    subgraph API["Wiki API Layer"]
        GetCategories["getCategories()"]
        GetGuides["getGuidesPublished()"]
        GetStats["getContentStats()"]
    end

    subgraph SupabaseREST["Supabase REST API"]
        CatQuery["GET /wiki_categories"]
        GuideQuery["GET /wiki_guides<br/>?status=eq.published"]
        StatsQuery["SELECT COUNT(*)..."]
    end

    subgraph Database["Database"]
        CatTable["wiki_categories<br/>Table"]
        GuideTable["wiki_guides<br/>Table"]
        RelTable["wiki_guide_categories<br/>Table"]
    end

    User -->|"Load"| Home
    Home --> HomeJS
    HomeJS -->|"Call"| GetCategories
    HomeJS -->|"Call"| GetGuides
    HomeJS -->|"Call"| GetStats
    GetCategories -->|"REST"| CatQuery
    GetGuides -->|"REST"| GuideQuery
    GetStats -->|"REST"| StatsQuery
    CatQuery --> CatTable
    GuideQuery --> GuideTable
    StatsQuery --> RelTable
    CatTable -->|"JSON"| GetCategories
    GuideTable -->|"JSON"| GetGuides
    RelTable -->|"JSON"| GetStats
    GetCategories -->|"Render"| Home
    GetGuides -->|"Render"| Home
    GetStats -->|"Render"| Home

    style Frontend fill:#e1f5ff
    style API fill:#fff3e0
    style SupabaseREST fill:#e8f5e9
    style Database fill:#fce4ec
```

---

## Diagram 5: Module Dependency Chain

```mermaid
graph TB
    subgraph HTML["HTML Pages"]
        Home["wiki-home.html"]
        Editor["wiki-editor.html"]
        Page["wiki-page.html"]
    end

    subgraph Core["Core Modules"]
        WikiJS["wiki.js<br/>(Initialization)"]
        Config["config.js<br/>(Configuration)"]
        I18n["wiki-i18n.js<br/>(Translations)"]
    end

    subgraph APILayer["API & Auth"]
        SupabaseClient["supabase-client.js<br/>(HTTP wrapper)"]
        WikiSupabase["wiki-supabase.js<br/>(Domain API)"]
        AuthHeader["auth-header.js<br/>(UI component)"]
    end

    subgraph PageModules["Page Modules"]
        HomeJS["wiki-home.js"]
        EditorJS["wiki-editor.js"]
        PageJS["wiki-page.js"]
    end

    subgraph Utilities["Utilities"]
        LocationUtils["wiki-location-utils.js"]
        Newsletter["subscribe-newsletter.js"]
        PWA["pwa-register.js"]
    end

    subgraph External["External Libraries"]
        FontAwesome["Font Awesome 6.4"]
        Quill["Quill.js"]
        Leaflet["Leaflet.js"]
    end

    Home --> WikiJS
    Editor --> WikiJS
    Page --> WikiJS
    WikiJS --> Config
    WikiJS --> I18n
    WikiJS --> AuthHeader
    HomeJS --> WikiSupabase
    HomeJS --> LocationUtils
    EditorJS --> WikiSupabase
    EditorJS --> Quill
    PageJS --> WikiSupabase
    PageJS --> Leaflet
    WikiSupabase --> SupabaseClient
    SupabaseClient --> Config

    style HTML fill:#e1f5ff
    style Core fill:#fff3e0
    style APILayer fill:#f3e5f5
    style PageModules fill:#e8f5e9
    style Utilities fill:#eceff1
    style External fill:#ffe0e6
```

---

## Diagram 6: Content Creation & Editing Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser as Browser
    participant Wiki_API as wiki-supabase.js
    participant REST as Supabase REST API
    participant Auth as Supabase Auth
    participant DB as PostgreSQL

    User->>Browser: Click "Create Guide"
    Browser->>Browser: Load wiki-editor.html
    Browser->>Browser: Initialize Quill editor

    User->>Browser: Fill form (title, content, category)
    Browser->>Browser: User clicks "Save as Draft"

    Browser->>Wiki_API: createGuide({title, content, status:'draft'})
    Wiki_API->>Wiki_API: Add auth token from localStorage
    Wiki_API->>REST: POST /wiki_guides<br/>(with Authorization header)

    REST->>Auth: Validate token signature
    Auth-->>REST: Token valid, user_id=123

    REST->>DB: Check RLS policy<br/>auth.uid() can insert
    DB-->>REST: Policy allows

    DB->>DB: INSERT into wiki_guides<br/>(author_id=123, status='draft')
    DB-->>REST: id=abc123

    REST-->>Wiki_API: {id, title, status, created_at}
    Wiki_API-->>Browser: {id, title, status}
    Browser->>Browser: Redirect to wiki-page.html?id=abc123
    Browser-->>User: ✓ Draft saved

    User->>Browser: Click "Publish"
    Browser->>Wiki_API: updateGuide(abc123, {status:'published'})
    Wiki_API->>REST: PATCH /wiki_guides?id=eq.abc123
    REST->>DB: UPDATE with RLS check
    DB-->>REST: Updated
    REST-->>Browser: Success
    Browser-->>User: ✓ Published
```

---

## Diagram 7: Translation & Localization Architecture

```mermaid
graph LR
    Browser["Browser<br/>localStorage<br/>language: 'pt'"]

    subgraph I18n_System["i18n System"]
        I18nJS["wiki-i18n.js<br/>- Load translations<br/>- Swap language<br/>- Translate text"]
    end

    subgraph Translation_Data["Translation Data"]
        LocalTrans["In-memory<br/>translations object<br/>~4500 keys"]
    end

    subgraph Database["Database"]
        Guides["wiki_guides<br/>+ translations"]
        Events["wiki_events<br/>+ translations"]
        Locs["wiki_locations<br/>+ translations"]
    end

    subgraph HTML["HTML Elements"]
        Element["<h1 data-i18n='key'>Default</h1>"]
    end

    Browser -->|"Check language"| I18nJS
    I18nJS -->|"Get translations"| LocalTrans
    I18nJS -->|"For content"| Browser

    LocalTrans -->|"UI strings"| Element
    Element -->|"Render in:<br/>Portuguese"| Browser

    I18nJS -->|"Load content"| Database
    Database -->|"language_code<br/>='pt'"| Guides
    Guides -->|"Translated title<br/>& content"| I18nJS
    I18nJS -->|"Merge with UI"| Browser

    style I18n_System fill:#fff3e0
    style Translation_Data fill:#f3e5f5
    style Database fill:#fce4ec
    style HTML fill:#e1f5ff
    style Browser fill:#fff9c4
```

---

## Diagram 8: Session & Token Management

```mermaid
graph TD
    User["User"]
    Browser["Browser"]
    LS["localStorage"]
    Supabase["Supabase Auth"]
    DB["PostgreSQL"]

    subgraph Login["Login Flow"]
        L1["User enters email/password"]
        L2["Send to wiki-login.js"]
        L3["Call supabase.auth.signInWithPassword()"]
        L4["Supabase validates"]
        L5["Returns session token"]
        L6["Store token in localStorage<br/>+ expiry time"]
    end

    subgraph APIRequest["API Request with Token"]
        R1["Page needs data"]
        R2["wiki-supabase.js reads token<br/>from localStorage"]
        R3["Add to Authorization header<br/>Bearer {token}"]
        R4["POST/GET to Supabase REST API"]
        R5["Supabase validates signature"]
        R6["Extract user_id from token"]
        R7["Pass user_id to RLS policies"]
    end

    subgraph Expiry["Token Expiry"]
        E1["Check token expiry time"]
        E2["If expired, try refresh"]
        E3["Supabase refresh endpoint"]
        E4["Success? Update token"]
        E5["Fail? Sign out, go to login"]
    end

    User -->|"Email/Password"| L1
    L1 --> L2
    L2 --> L3
    L3 --> Supabase
    Supabase -->|"Valid"| L4
    L4 --> L5
    L5 --> L6
    L6 --> LS

    Browser -->|"User navigates"| R1
    R1 --> R2
    R2 --> LS
    LS -->|"token"| R2
    R2 --> R3
    R3 --> R4
    R4 --> R5
    R5 --> R6
    R6 --> R7
    R7 --> DB
    DB -->|"Filtered results"| R4

    R5 --> E1
    E1 -->|"Soon"| E2
    E2 --> E3
    E3 -->|"Success"| E4
    E3 -->|"Fail"| E5
    E4 --> LS
    E5 -->|"Redirect"| Browser

    style Login fill:#c8e6c9
    style APIRequest fill:#bbdefb
    style Expiry fill:#ffe0b2
```

---

## Diagram 9: Error Handling & Recovery

```mermaid
graph TD
    Request["API Request"]
    Success{Response<br/>200?}

    AuthError{401<br/>Unauthorized?}
    NotFound{404<br/>Not Found?}
    RLSError{403<br/>Forbidden?}
    ServerError{5xx<br/>Server Error?}

    RetryToken["Attempt Token<br/>Refresh"]
    RefreshOK{Refresh<br/>OK?}
    SignOut["Sign Out User<br/>Redirect to Login"]
    ShowError["Show Error<br/>404 page not found"]
    AccessDenied["Show Error<br/>Access Denied"]
    ShowNotice["Show notice<br/>Try again later"]

    Success -->|"Yes"| Continue["Continue<br/>Render data"]
    Success -->|"No"| AuthError
    AuthError -->|"Yes"| RetryToken
    AuthError -->|"No"| NotFound
    NotFound -->|"Yes"| ShowError
    NotFound -->|"No"| RLSError
    RLSError -->|"Yes"| AccessDenied
    RLSError -->|"No"| ServerError
    ServerError -->|"Yes"| ShowNotice
    ServerError -->|"No"| Continue

    RetryToken --> RefreshOK
    RefreshOK -->|"Yes"| Continue
    RefreshOK -->|"No"| SignOut

    Continue -->|"✓"| End["Page Renders"]
    ShowError -->|"✗"| End
    AccessDenied -->|"✗"| End
    ShowNotice -->|"✗"| End
    SignOut -->|"✗"| End

    style Request fill:#e1f5ff
    style Success fill:#fff3e0
    style AuthError fill:#ffcdd2
    style NotFound fill:#ffcdd2
    style RLSError fill:#ffcdd2
    style ServerError fill:#ffcdd2
    style Continue fill:#c8e6c9
    style End fill:#f8bbd0
```

---

## Key Integration Points

### 1. Supabase REST API
- **Base URL:** `https://mcbxbaggjaxqfdvmrqsc.supabase.co/rest/v1/`
- **Authentication:** Bearer token in Authorization header
- **Response Format:** JSON with optional header params (count, etc.)
- **Error Codes:** Follow HTTP standard (400, 401, 403, 404, 500, etc.)

### 2. Browser APIs Used
- **localStorage:** Persist user auth tokens and preferences
- **sessionStorage:** Temporary state during page transitions
- **fetch:** All HTTP requests to Supabase
- **EventTarget:** Custom events for component communication

### 3. Database Constraints
- All tables have RLS enabled
- Foreign key relationships maintain referential integrity
- PostGIS geography column enables location-based queries
- Cascading deletes where appropriate (e.g., guide → categories)

### 4. External Services
- **Font Awesome 6.4:** Icon library via CDN
- **Quill.js:** Rich text editor for content
- **Leaflet.js:** Map display and interaction
- **OpenStreetMap:** Tile provider for Leaflet

---

## Performance Characteristics

| Operation | Performance | Notes |
|-----------|-------------|-------|
| Page load | <2s | CSS inline, JS bundled by Vite |
| Content search | <500ms | Supabase indexes on commonly searched fields |
| Map render | <1s | Markers lazy-loaded, map tiles cached |
| Location distance | <100ms | PostGIS spatial index, haversine fallback |
| Language switch | <200ms | In-memory translation swap |
| Image load | Variable | CDN hosted, browser cached |

---

## Related Documents

- [WIKI_COMPONENT_ARCHITECTURE.md](./WIKI_COMPONENT_ARCHITECTURE.md) - Component details
- [WIKI_DATA_MODEL.md](./WIKI_DATA_MODEL.md) - Data structures
- [WIKI_FRONTEND_DESIGN.md](./WIKI_FRONTEND_DESIGN.md) - Frontend patterns
- [WIKI_NONFUNCTIONAL_ARCHITECTURE.md](./WIKI_NONFUNCTIONAL_ARCHITECTURE.md) - NFRs

---

**Status:** Complete

**Last Review:** 2025-11-21
