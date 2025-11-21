# Permahub Wiki Application - Architecture Documentation

**File:** `/docs/architecture/WIKI_ARCHITECTURE.md`

**Description:** Comprehensive architecture documentation for the Permahub Wiki application, including functional and non-functional system design

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-21

**Last Updated:** 2025-11-21

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Component Architecture](#component-architecture)
4. [Data Model Architecture](#data-model-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Non-Functional Requirements](#non-functional-requirements)
7. [Deployment Architecture](#deployment-architecture)
8. [Related Documents](#related-documents)

---

## Executive Summary

The Permahub Wiki is a comprehensive, multi-language community knowledge platform built on a modern web stack. It combines vanilla JavaScript frontend with a PostgreSQL backend via Supabase, featuring rich content management, geographic discovery, user personalization, and real-time collaboration capabilities.

**Key Statistics:**
- **21 HTML pages** serving distinct user workflows
- **25 JavaScript modules** providing functionality
- **12 database tables** supporting content, users, and relationships
- **11 supported languages** with 5 fully translated
- **3 main content types:** Guides (articles), Events (workshops/meetings), Locations (physical places)

**Technology Stack:**
- Frontend: HTML5, CSS3, Vanilla ES6+ JavaScript
- Editor: Quill.js rich text editor
- Maps: Leaflet.js with PostGIS spatial queries
- Backend: Supabase (PostgreSQL + Auth)
- Hosting: Vercel/Netlify/GitHub Pages
- Build: Vite

---

## System Architecture Overview

See [WIKI_SYSTEM_ARCHITECTURE.md](./WIKI_SYSTEM_ARCHITECTURE.md) for detailed diagrams showing:
- System layering and boundaries
- Frontend-Backend integration points
- Database integration patterns
- Authentication and authorization flows
- External service dependencies

Key concepts:
- **Layered architecture:** Presentation → Business Logic → Data Access → Database
- **Client-Server model:** Thin client (browser) + Supabase backend
- **REST API integration:** Direct REST calls to Supabase from frontend
- **RLS-based security:** Row-Level Security enforces data access rules at database level

---

## Component Architecture

See [WIKI_COMPONENT_ARCHITECTURE.md](./WIKI_COMPONENT_ARCHITECTURE.md) for detailed diagrams showing:
- Frontend module organization
- Component hierarchies
- Module dependencies and imports
- Page structure and navigation
- Shared utilities and services

**Frontend Modules (25 files):**
- **Core:** `wiki.js`, `wiki-i18n.js`, `wiki-supabase.js`
- **Auth:** `auth-header.js`, `auth-callback.js`, `wiki-login.js`, `wiki-signup.js`, etc.
- **Pages:** `wiki-home.js`, `wiki-guides.js`, `wiki-page.js`, `wiki-events.js`, `wiki-map.js`, `wiki-editor.js`, etc.
- **Utilities:** `wiki-location-utils.js`, `subscribe-newsletter.js`, `pwa-register.js`

---

## Data Model Architecture

See [WIKI_DATA_MODEL.md](./WIKI_DATA_MODEL.md) for detailed diagrams showing:
- Entity-Relationship (ER) models for all tables
- Table relationships and cardinality
- Data flow through the system
- Multi-language content structure

**Core Tables:**
- `wiki_guides` - Educational articles
- `wiki_events` - Events and workshops
- `wiki_locations` - Physical places
- `wiki_categories` - Topic classification
- `wiki_favorites` - User bookmarks
- `wiki_collections` - User-created collections

---

## Frontend Architecture

See [WIKI_FRONTEND_DESIGN.md](./WIKI_FRONTEND_DESIGN.md) for detailed diagrams showing:
- Page structure and component layout
- CSS organization and design system
- State management patterns
- Form and validation flows
- Navigation and routing patterns

**Key Frontend Patterns:**
- Module-per-page initialization
- Shared component templates
- CSS variable-based theming
- Event-driven state updates
- Responsive mobile-first design

---

## Non-Functional Requirements

See [WIKI_NONFUNCTIONAL_ARCHITECTURE.md](./WIKI_NONFUNCTIONAL_ARCHITECTURE.md) for diagrams and specification of:
- Performance requirements and optimization strategies
- Security model and threat mitigation
- Scalability characteristics
- Reliability and availability patterns
- Internationalization (i18n) system
- Offline capabilities (PWA)

**Key Quality Attributes:**
- **Performance:** <2s page load, cached translations, optimized queries
- **Security:** RLS-based access control, HTTPS-only, CSRF protection
- **Scalability:** Stateless frontend, horizontal scaling via Supabase
- **Availability:** 99%+ uptime target, offline support via service worker
- **Internationalization:** 11 languages, client-side rendering
- **Accessibility:** WCAG 2.1 AA target (CSS work ongoing)

---

## Deployment Architecture

See [WIKI_DEPLOYMENT_ARCHITECTURE.md](./WIKI_DEPLOYMENT_ARCHITECTURE.md) for diagrams showing:
- Deployment topology (staging/production)
- CI/CD pipeline
- Database migration and backup strategy
- Monitoring and alerting architecture
- Environment configuration management

**Deployment Targets:**
- Primary: Vercel (recommended)
- Secondary: Netlify
- Tertiary: GitHub Pages

---

## Related Documents

### Architecture Diagrams
- [WIKI_SYSTEM_ARCHITECTURE.md](./WIKI_SYSTEM_ARCHITECTURE.md) - System design diagrams
- [WIKI_COMPONENT_ARCHITECTURE.md](./WIKI_COMPONENT_ARCHITECTURE.md) - Component hierarchies
- [WIKI_DATA_MODEL.md](./WIKI_DATA_MODEL.md) - Database and data flow diagrams
- [WIKI_FRONTEND_DESIGN.md](./WIKI_FRONTEND_DESIGN.md) - Frontend structure and patterns
- [WIKI_NONFUNCTIONAL_ARCHITECTURE.md](./WIKI_NONFUNCTIONAL_ARCHITECTURE.md) - NFR diagrams
- [WIKI_DEPLOYMENT_ARCHITECTURE.md](./WIKI_DEPLOYMENT_ARCHITECTURE.md) - Deployment architecture

### Feature Documentation
- [/docs/features/wiki-content-guide.md](../features/wiki-content-guide.md) - Content creation guide
- [/docs/features/wiki-translation.md](../features/wiki-translation.md) - Translation system
- [/docs/features/wiki-schema-compliance.md](../features/wiki-schema-compliance.md) - Schema compliance guide

### Testing Documentation
- [/docs/testing/WIKI_EDITOR_TEST_PLAN.md](../testing/WIKI_EDITOR_TEST_PLAN.md) - Editor test plan
- [/docs/testing/WIKI_UI_REGRESSION_TESTING_CHECKLIST.md](../testing/WIKI_UI_REGRESSION_TESTING_CHECKLIST.md) - UI regression tests

### Code Reference
- [/src/wiki/js/wiki-i18n.js](../../src/wiki/js/wiki-i18n.js) - Translation implementation
- [/src/wiki/js/wiki-supabase.js](../../src/wiki/js/wiki-supabase.js) - API wrapper
- [/src/js/supabase-client.js](../../src/js/supabase-client.js) - Supabase client
- [/supabase/wiki-complete-schema.sql](../../supabase/wiki-complete-schema.sql) - Database schema

---

## Quick Navigation

**For System Understanding:**
1. Start here (this document) for overview
2. Read [WIKI_SYSTEM_ARCHITECTURE.md](./WIKI_SYSTEM_ARCHITECTURE.md) for overall design
3. Read [WIKI_DATA_MODEL.md](./WIKI_DATA_MODEL.md) for data structures
4. Read [WIKI_FRONTEND_DESIGN.md](./WIKI_FRONTEND_DESIGN.md) for UI implementation

**For Development:**
1. Review [WIKI_COMPONENT_ARCHITECTURE.md](./WIKI_COMPONENT_ARCHITECTURE.md) for module organization
2. Check [WIKI_NONFUNCTIONAL_ARCHITECTURE.md](./WIKI_NONFUNCTIONAL_ARCHITECTURE.md) for design patterns
3. Refer to feature docs for specific implementations

**For Deployment:**
1. Read [WIKI_DEPLOYMENT_ARCHITECTURE.md](./WIKI_DEPLOYMENT_ARCHITECTURE.md)
2. Check environment configuration in [/src/js/config.js](../../src/js/config.js)
3. Review [SUPABASE_SETUP_GUIDE.md](../../SUPABASE_SETUP_GUIDE.md) for database setup

---

**Status:** Complete and maintained

**Next Review:** 2025-12-21
