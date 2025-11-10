# Community Wiki - Mockup Documentation

## Overview

This is a lightweight community wiki system designed for small groups (initially <50 users) to share knowledge, events, and locations. It's built as a part of the Permahub project and focuses on permaculture, agroforestry, ecology, and circular economy topics.

## Pages

### 1. **Home** (`wiki-home.html`)
- Hero section with search
- Quick stats (guides, locations, events, contributors)
- Category browsing
- Recent guides grid
- Upcoming events preview
- Featured locations
- Call-to-action section

### 2. **View Page** (`wiki-page.html`)
- Full article display with rich content
- Breadcrumb navigation
- Author information
- Table of contents sidebar
- Related content
- Edit capabilities for registered users
- Meta information (views, last edited, contributors)

### 3. **Editor** (`wiki-editor.html`)
- Content type selection (Guide/Event/Location)
- Rich text editor with toolbar
- Markdown support
- Image upload
- Category/tag selection
- Publishing settings
- Event-specific fields (date, time, location)
- Location-specific fields (address, coordinates)

### 4. **Events Calendar** (`wiki-events.html`)
- Monthly event listings
- Event cards with key details
- Filter by event type
- Registration capabilities
- Recurring events section
- Email subscription

### 5. **Location Map** (`wiki-map.html`)
- Interactive Leaflet.js map
- Location markers with custom icons
- Filter by location type
- Sidebar list with distance
- Location statistics
- Search functionality

### 6. **Login** (`wiki-login.html`)
- Email/password authentication
- Magic link authentication
- Social login options (Google, GitHub)
- Benefits of creating an account
- Privacy and security information

## Features

### Current (Mockup Stage)
- ✅ Clean, modern UI with green/nature color scheme
- ✅ Fully responsive design
- ✅ Realistic seeded data (permaculture-focused)
- ✅ Interactive elements (tabs, filters, search)
- ✅ Accessible markup
- ✅ Mobile-friendly navigation

### Planned (Implementation Stage)
- 🔄 Supabase backend integration
- 🔄 Real authentication
- 🔄 CRUD operations for content
- 🔄 Image storage (Supabase Storage)
- 🔄 Search functionality
- 🔄 Comments system
- 🔄 Notifications
- 🔄 Health check monitoring

## Content Types

### Guides/Articles
- Text content with rich formatting
- Images and embeds
- Categories and tags
- Author attribution
- View counts
- Edit history

### Events
- Title and description
- Date, time, location
- Registration/RSVP
- Event types (workshop, meetup, tour, course)
- Recurring events support

### Locations
- Name and description
- Address and coordinates
- Map integration
- Types (farm, garden, education center, etc.)
- Distance calculation

## User Roles

### Public (Anonymous)
- Read all content
- View events and locations
- Search and filter

### Registered Users
- All public permissions
- Create and edit content
- Comment on articles
- Register for events
- Save favorites
- Get notifications

### Admins (Future)
- Moderate content
- Manage users
- Access analytics

## Technology Stack

### Frontend
- HTML5, CSS3 (Custom design system)
- Vanilla JavaScript (ES6+)
- Leaflet.js (maps)
- Font Awesome (icons)

### Backend (Planned)
- Supabase PostgreSQL (database)
- Supabase Auth (authentication)
- Supabase Storage (images)
- Supabase Real-time (future: live updates)

### Deployment
- Static hosting on Verpex
- Supabase free tier (sufficient for small communities)

## Directory Structure

```
src/wiki/
├── css/
│   └── wiki.css           # Shared styles
├── js/
│   └── wiki.js            # Shared JavaScript
├── assets/                # Images, icons (future)
├── wiki-home.html         # Landing page
├── wiki-page.html         # Article view
├── wiki-editor.html       # Content editor
├── wiki-events.html       # Events calendar
├── wiki-map.html          # Location map
├── wiki-login.html        # Authentication
└── README.md              # This file
```

## Design System

### Colors
- **Primary**: `#2d6a4f` (Forest Green)
- **Primary Dark**: `#1b4332`
- **Secondary**: `#52b788` (Light Green)
- **Accent**: `#95d5b2` (Mint)
- **Background**: `#f8f9fa` (Light Gray)
- **White**: `#ffffff`
- **Text**: `#212529`
- **Text Muted**: `#6c757d`

### Typography
- **Font**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Line Height**: 1.6
- **Headings**: Bold, color primary

### Components
- Cards with shadow and border-radius
- Buttons (primary, secondary, outline)
- Tags/pills for categories
- Form inputs with focus states
- Event cards with date badges
- Responsive grid layouts

## Integration with Existing Permahub

The wiki is designed to:
1. Reuse existing Supabase configuration
2. Share authentication system
3. Potentially integrate with existing projects/resources features
4. Maintain separate but compatible data models

## Next Steps

1. **Gather User Feedback**
   - Share mockups with WhatsApp group
   - Iterate on design based on feedback

2. **Database Schema**
   - Design tables for guides, events, locations
   - Set up Row Level Security (RLS)
   - Create indexes for search

3. **Authentication Integration**
   - Connect to existing Supabase auth
   - Implement login/logout flows
   - Add user session management

4. **CRUD Operations**
   - Create content API endpoints
   - Implement rich text editor (TinyMCE or similar)
   - Add image upload to Supabase Storage

5. **Search & Filters**
   - Full-text search with PostgreSQL
   - Category/tag filtering
   - Location-based search

6. **Health Monitoring**
   - Backend health check endpoint
   - Periodic pings from frontend
   - Error logging and alerts

## Cost Estimate

**Monthly Costs:**
- Supabase: $0 (free tier: 500MB DB, 1GB storage, 50K users)
- Verpex: Existing hosting (no additional cost)
- **Total: $0/month** (for communities under 50 users)

Scales to Supabase Pro ($25/mo) only if you exceed free tier limits.

## Notes

- All mockup pages use placeholder data
- JavaScript interactions are basic demos
- Forms submit to console.log (no backend yet)
- Images use gradient placeholders
- Map uses sample coordinates (NYC area)

## Questions for Implementation

1. Do you want versioning/edit history for articles?
2. Should events automatically archive after they pass?
3. Do you need moderation/approval workflow?
4. Should there be a notification system (email/in-app)?
5. Do you want WhatsApp integration for new content alerts?

---

**Created**: November 2025
**Status**: Mockup Phase
**Maintainer**: Community-driven
