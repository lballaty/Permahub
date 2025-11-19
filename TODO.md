# Permahub Master TODO List

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/TODO.md

**Description:** Master task tracking for Permahub project

**Last Updated:** 2025-11-16

---

## 🚀 High Priority

### Contact Information Feature - Testing & Validation
**Status:** Implementation Complete - Awaiting Testing
**Estimated Time:** 1-2 hours testing + 2-3 hours URL validation
**Priority:** Critical - Must test before deployment

**Completed Implementation:**
- ✅ Database migration 008: Contact fields added to wiki_events and wiki_locations
- ✅ UI implementation for event contact display (cards + modals)
- ✅ UI implementation for location contact display (popups + list)
- ✅ Contact form fields in event/location editor
- ✅ Save/load functionality for contact data
- ✅ Commits: e8e1714, 21cba0a, 26c14de, c4c2c8d

**Testing Tasks:**
- [ ] **Test Events Page** (http://localhost:5173/src/wiki/wiki-events.html)
  - [ ] Verify contact icons (📧 📞) appear on event cards
  - [ ] Verify "by [Organization]" text displays
  - [ ] Test mailto: and tel: links are clickable
  - [ ] Click "Details" button and verify full contact section

- [ ] **Test Event Details Modal**
  - [ ] Verify "Contact Information" section appears
  - [ ] Check organizer name/organization display
  - [ ] Test email, phone, website links work
  - [ ] Verify links open correctly (mailto:, tel:, new tab for websites)

- [ ] **Test Event Editor** (http://localhost:5173/src/wiki/wiki-editor.html)
  - [ ] Select "Event" content type
  - [ ] Verify 5 contact fields present (organizer name, organization, email, phone, website)
  - [ ] Create new event with contact information
  - [ ] Edit existing event - verify contact fields pre-populate
  - [ ] Save and verify data persists in database

- [ ] **Test Location Map** (http://localhost:5173/src/wiki/wiki-map.html)
  - [ ] Click location markers - verify contact section in popups
  - [ ] Check location list shows contact icons
  - [ ] Test mailto:, tel:, website links work

- [ ] **Test Location Editor**
  - [ ] Select "Location" content type
  - [ ] Verify 5 contact fields present (contact name, email, phone, website, hours)
  - [ ] Create new location with contact data
  - [ ] Edit existing location - verify fields pre-populate

- [ ] **Mobile Responsiveness**
  - [ ] Test on mobile viewport (< 768px)
  - [ ] Verify contact icons/sections stack properly
  - [ ] Check touch targets are adequate

**URL Validation Follow-up:**
- [ ] **Create URL Validation Script** (scripts/validate-urls.js)
  - [ ] Read JSON files from docs/verification/
  - [ ] Test each URL (HTTP status, redirects)
  - [ ] Check for keyword relevance (organization name in content)
  - [ ] Generate markdown validation report

- [ ] **Run Automated Validation**
  - [ ] Identify all 404s, redirects, invalid URLs
  - [ ] Flag suspicious URLs (domain changes, parked domains)
  - [ ] Document findings in report

- [ ] **Manual Review & Fixes**
  - [ ] Review flagged URLs (starting with Growing Power)
  - [ ] Research replacement URLs for defunct organizations
  - [ ] Create database migration to fix invalid URLs
  - [ ] Update seed files with corrected URLs

**Files for URL Validation:**
- [Event URLs CSV](docs/verification/event-urls-for-validation.csv) (45 events)
- [Event URLs JSON](docs/verification/event-urls-for-validation.json)
- [Location URLs CSV](docs/verification/location-urls-for-validation.csv) (31 locations)
- [Location URLs JSON](docs/verification/location-urls-for-validation.json)
- [Validation Summary](docs/verification/url-validation-summary.md)

**Known Issues:**
- ❌ Growing Power: https://www.growingpower.org/education → Redirects to UK loan company

---

### WhatsApp Group Notification Integration
**Status:** Planning Complete - Awaiting Implementation
**Estimated Time:** 2-3 hours
**Dependencies:** Verpex VPS access information

**Documentation:**
- ✅ [Integration Plan](docs/whatsapp-integration-plan.md) - Complete architecture and steps
- ✅ [Deployment Guide](docs/verpex-remote-deployment-guide.md) - SSH and remote deployment
- ✅ [Deployment Script](scripts/deploy-whatsapp.sh) - Automated deployment

**Required Information from User:**
1. Verpex account type (Shared/VPS/Cloud)
2. SSH connection details (hostname, port, username)
3. Which domain/site to associate with service
4. Isolation preferences (given multiple sites on account)

**Implementation Tasks:**
- [ ] Get Verpex account details from user
- [ ] Set up SSH access to Verpex VPS
- [ ] Create database migration (`017_whatsapp_notifications.sql`)
  - [ ] `whatsapp_group_settings` table
  - [ ] `whatsapp_notification_queue` table
  - [ ] `whatsapp_notifications` table
  - [ ] Database triggers for wiki_guides, wiki_events, wiki_locations
- [ ] Build Node.js notification service
  - [ ] Queue processor
  - [ ] Message formatter
  - [ ] WAHA API integration
  - [ ] Error handling and retry logic
- [ ] Deploy WAHA on VPS (Docker or Node.js)
  - [ ] Install and configure
  - [ ] Connect WhatsApp account
  - [ ] Get WhatsApp group ID
- [ ] Deploy notification service to VPS
  - [ ] Transfer code via deployment script
  - [ ] Configure environment variables
  - [ ] Set up PM2 process management
  - [ ] Configure cron job or continuous service
- [ ] Create admin UI for configuration
  - [ ] WhatsApp settings management page
  - [ ] Notification history viewer
  - [ ] Manual retry interface
- [ ] Testing
  - [ ] Test with sample guide creation
  - [ ] Test with sample event creation
  - [ ] Test with sample location creation
  - [ ] Verify notification delivery
  - [ ] Test error handling

**Estimated Cost:** $0/month (100% free solution)

---

## 📋 Medium Priority

### Database & Backend
- [ ] Review and optimize database indexes
- [ ] Set up automated database backups
- [ ] Implement rate limiting for API endpoints
- [ ] Add database connection pooling optimization

### Content & Wiki
- [ ] Complete wiki content verification process
- [ ] Add more verified guides (target: 20+)
- [ ] Translate existing guides to all 11 languages
- [ ] Create content moderation workflow

### Testing & Quality
- [ ] Expand E2E test coverage
- [ ] Add integration tests for all API endpoints
- [ ] Implement visual regression testing
- [ ] Set up continuous integration pipeline

---

## 🔄 Low Priority / Future Enhancements

### WhatsApp Integration Phase 2
- [ ] Support multiple WhatsApp groups (different groups for guides/events/locations)
- [ ] Add rich media support (send featured images)
- [ ] User preference management (subscribe/unsubscribe)
- [ ] Message open rate analytics
- [ ] Telegram/Discord integration using same architecture

### User Experience
- [ ] Progressive Web App (PWA) support
- [ ] Offline mode functionality
- [ ] Push notifications for web
- [ ] Dark mode theme

### Admin & Moderation
- [ ] Content approval workflow
- [ ] User role management system
- [ ] Analytics dashboard
- [ ] Automated content quality checks

### Performance
- [ ] Image optimization and CDN
- [ ] Code splitting and lazy loading
- [ ] Service worker implementation
- [ ] Database query optimization

---

## ✅ Completed

### 2025-11-16
- ✅ **Contact Information Feature Implementation**
  - ✅ Database migration 008: Added contact fields to wiki_events and wiki_locations
  - ✅ Event contact display (cards with compact icons + detailed modal section)
  - ✅ Location contact display (map popups + list items)
  - ✅ Event/location editor forms with 5 contact input fields each
  - ✅ Save/load functionality for contact data persistence
  - ✅ Incremental git commits (e8e1714, 21cba0a, 26c14de, c4c2c8d)
- ✅ **URL Validation Data Export**
  - ✅ Exported 76 URLs from database (45 events + 31 locations)
  - ✅ Created CSV and JSON exports for programmatic validation
  - ✅ Documented validation process and known issues
  - ✅ Identified invalid Growing Power URL
- ✅ WhatsApp integration planning and documentation
- ✅ Remote deployment infrastructure
- ✅ Verpex VPS deployment guide
- ✅ Automated deployment script

### Earlier
- ✅ Wiki schema implementation
- ✅ Multi-language support (11 languages)
- ✅ User authentication system
- ✅ Map integration with Leaflet
- ✅ Event and location management
- ✅ Guide creation and editing
- ✅ Favorites and collections

---

## 📝 Notes

### WhatsApp Integration
- Architecture finalized: Database → Queue → Node.js → WAHA → WhatsApp
- Non-destructive migrations ensured
- Docker optional (can use direct Node.js installation)
- Awaiting user confirmation on Verpex account details before proceeding

---

**Last Review:** 2025-11-16
**Next Review:** After WhatsApp integration implementation
