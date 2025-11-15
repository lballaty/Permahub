# Permahub Documentation Index

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/INDEX.md

**Description:** Complete map of all Permahub documentation

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-01-15

**Last Updated:** 2025-01-15

---

## 🚀 New Users Start Here

**If you're new to Permahub**, follow this path:

1. **[../README.md](../README.md)** - Project overview and vision
2. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Complete setup in 30 minutes
3. **[architecture/project-overview.md](architecture/project-overview.md)** - Understanding Permahub's architecture

---

## 📦 Setup & Installation

### Quick Setup (5-30 minutes)
- **[database/quickstart.md](database/quickstart.md)** - 5-minute database quickstart
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Complete getting started guide

### Database Setup
- **[database/supabase-cloud-setup.md](database/supabase-cloud-setup.md)** - Production cloud setup
- **[database/supabase-local-setup.md](database/supabase-local-setup.md)** - Local development with Docker/Colima
- **[database/migration-guide.md](database/migration-guide.md)** - Comprehensive migration plan
- **[database/migration-summary.md](database/migration-summary.md)** - Migration overview
- **[database/migration-notes.md](database/migration-notes.md)** - Migration compatibility notes
- **[database/seed-compliance.md](database/seed-compliance.md)** - Seed data compliance report
- **[database/supabase-setup-reference.md](database/supabase-setup-reference.md)** - Additional setup reference

### Troubleshooting
- **[database/troubleshooting.md](database/troubleshooting.md)** - Common issues and solutions

---

## 💻 Development Guides

### Getting Started with Development
- **[development/quick-reference.md](development/quick-reference.md)** - Development quick start
- **[development/vite-guide.md](development/vite-guide.md)** - Understanding the Vite build system

### Feature Development
- **[guides/i18n-implementation.md](guides/i18n-implementation.md)** - Multi-language system implementation
- **[guides/i18n-reference.md](guides/i18n-reference.md)** - i18n API reference
- **[guides/security.md](guides/security.md)** - Security best practices
- **[guides/deployment.md](guides/deployment.md)** - Deployment guide
- **[guides/landing-page.md](guides/landing-page.md)** - Landing page guide

---

## 🏗️ Architecture & Design

### System Architecture
- **[architecture/project-overview.md](architecture/project-overview.md)** - Vision, goals, and technical architecture
- **[architecture/data-model.md](architecture/data-model.md)** - Complete database schema
- **[architecture/pages-navigation.md](architecture/pages-navigation.md)** - Page structure and navigation flow

---

## 🎨 Features

### Core Features
- **[features/eco-themes-design.md](features/eco-themes-design.md)** - Eco themes design system
- **[features/eco-themes-implementation.md](features/eco-themes-implementation.md)** - Eco themes implementation
- **[features/eco-themes-summary.md](features/eco-themes-summary.md)** - Eco themes summary

### Wiki System
- **[features/wiki-content-guide.md](features/wiki-content-guide.md)** - Complete wiki content creation guide (4,394 lines!)
- **[features/wiki-translation.md](features/wiki-translation.md)** - Wiki translation system design
- **[features/wiki-verification.md](features/wiki-verification.md)** - Wiki content verification
- **[features/wiki-schema-compliance.md](features/wiki-schema-compliance.md)** - Wiki schema compliance check

### i18n (Internationalization)
- **[features/i18n-compliance.md](features/i18n-compliance.md)** - i18n compliance documentation
- **[features/translation-visual-guide.md](features/translation-visual-guide.md)** - Visual guide to translation system

---

## 🔧 Operations & Maintenance

### Safety & Security
- **[operations/database-safety.md](operations/database-safety.md)** - Critical database safety procedures
- **[operations/safety-quick-reference.md](operations/safety-quick-reference.md)** - Quick safety reference card
- **[operations/safety-hooks.md](operations/safety-hooks.md)** - Programmatic safety hooks implementation
- **[operations/destructive-operations.md](operations/destructive-operations.md)** - Comprehensive catalog of destructive operations
- **[operations/docker-operations.md](operations/docker-operations.md)** - Docker-specific destructive operations

### Backup & Recovery
- **[operations/backup-guide.md](operations/backup-guide.md)** - Automated backup system guide

---

## ⚙️ Setup & Configuration

### Environment Setup
- **[setup/email-testing.md](setup/email-testing.md)** - Mailpit email testing setup
- **[setup/colima-docker-fix.md](setup/colima-docker-fix.md)** - Colima Docker integration fix

---

## 🤝 Contributing

### How to Contribute
- **[../CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[../ROADMAP.md](../ROADMAP.md)** - Project roadmap and future plans
- **[../.claude/claude.md](../.claude/claude.md)** - Development standards for AI assistance
- **[../IMPLEMENTATION_TODO.md](../IMPLEMENTATION_TODO.md)** - Active task list

### Project Status
- **[project-status.md](project-status.md)** - Current project status
- **[deployment-quickstart.md](deployment-quickstart.md)** - Quick deployment guide

---

## ⚖️ Legal

### Policies
- **[legal/privacy-policy.md](legal/privacy-policy.md)** - Privacy policy
- **[legal/terms-of-service.md](legal/terms-of-service.md)** - Terms of service
- **[legal/cookie-policy.md](legal/cookie-policy.md)** - Cookie policy

---

## 📚 Additional Resources

### External Links
- **GitHub Repository:** [https://github.com/lballaty/Permahub](https://github.com/lballaty/Permahub)
- **Supabase Dashboard:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Supabase Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
- **Vite Documentation:** [https://vitejs.dev/](https://vitejs.dev/)

### Key Technologies
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Build Tool:** Vite
- **Database:** PostgreSQL via Supabase
- **Maps:** Leaflet.js + OpenStreetMap
- **Icons:** Font Awesome 6.4.0

---

## 📂 Documentation Structure

```
/docs
├── INDEX.md                          # This file - documentation map
├── GETTING_STARTED.md                # Comprehensive entry guide
├── QUICKSTART.md                     # Quick start guide
├── project-status.md                 # Current status
├── deployment-quickstart.md          # Deployment quick guide
│
├── architecture/                     # System architecture
│   ├── project-overview.md          # Vision and architecture
│   ├── data-model.md                # Database schema
│   └── pages-navigation.md          # Page structure
│
├── database/                         # Database setup & migrations
│   ├── quickstart.md                # 5-minute quickstart
│   ├── supabase-cloud-setup.md      # Cloud production setup
│   ├── supabase-local-setup.md      # Local development setup
│   ├── migration-guide.md           # Comprehensive migration guide
│   ├── migration-summary.md         # Migration overview
│   ├── migration-notes.md           # Compatibility notes
│   ├── seed-compliance.md           # Seed data compliance
│   ├── supabase-setup-reference.md  # Additional reference
│   └── troubleshooting.md           # Common issues
│
├── guides/                           # Feature development guides
│   ├── deployment.md                # Deployment guide
│   ├── i18n-implementation.md       # i18n system implementation
│   ├── i18n-reference.md            # i18n API reference
│   ├── landing-page.md              # Landing page guide
│   └── security.md                  # Security best practices
│
├── features/                         # Feature documentation
│   ├── eco-themes-design.md         # Eco themes design
│   ├── eco-themes-implementation.md # Eco themes implementation
│   ├── eco-themes-summary.md        # Eco themes summary
│   ├── wiki-content-guide.md        # Wiki content guide (massive!)
│   ├── wiki-translation.md          # Wiki translation system
│   ├── wiki-verification.md         # Wiki verification
│   ├── wiki-schema-compliance.md    # Wiki schema compliance
│   ├── i18n-compliance.md           # i18n compliance
│   └── translation-visual-guide.md  # Translation visual guide
│
├── development/                      # Development guides
│   ├── quick-reference.md           # Dev quick reference
│   └── vite-guide.md                # Vite build system
│
├── operations/                       # Operations & safety
│   ├── database-safety.md           # Safety procedures
│   ├── safety-quick-reference.md    # Safety quick reference
│   ├── safety-hooks.md              # Programmatic hooks
│   ├── destructive-operations.md    # Destructive ops catalog
│   ├── docker-operations.md         # Docker operations
│   └── backup-guide.md              # Backup system
│
├── setup/                            # Environment setup
│   ├── email-testing.md             # Mailpit setup
│   └── colima-docker-fix.md         # Colima Docker fix
│
└── legal/                            # Legal documents
    ├── privacy-policy.md            # Privacy policy
    ├── terms-of-service.md          # Terms of service
    └── cookie-policy.md             # Cookie policy
```

---

## 🔍 Finding What You Need

### By Task

**"I want to set up Permahub for the first time"**
→ Start with [GETTING_STARTED.md](GETTING_STARTED.md)

**"I want to quickly test the database"**
→ Use [database/quickstart.md](database/quickstart.md)

**"I want to set up local development"**
→ Follow [database/supabase-local-setup.md](database/supabase-local-setup.md)

**"I want to deploy to production"**
→ Read [guides/deployment.md](guides/deployment.md) and [database/supabase-cloud-setup.md](database/supabase-cloud-setup.md)

**"I want to understand the database schema"**
→ See [architecture/data-model.md](architecture/data-model.md)

**"I want to add translations"**
→ Read [guides/i18n-implementation.md](guides/i18n-implementation.md)

**"I want to contribute code"**
→ Check [../CONTRIBUTING.md](../CONTRIBUTING.md) and [../.claude/claude.md](../.claude/claude.md)

**"Something went wrong with the database"**
→ Check [database/troubleshooting.md](database/troubleshooting.md)

**"I want to understand safety procedures"**
→ Read [operations/safety-quick-reference.md](operations/safety-quick-reference.md)

**"I want to create wiki content"**
→ Use [features/wiki-content-guide.md](features/wiki-content-guide.md)

---

## 📊 Documentation Health

**Last Reorganization:** January 15, 2025

**Total Documentation Files:** ~35 files (down from 87!)

**Documentation Categories:** 9 categories

**Health Score:** 8/10 (excellent organization, comprehensive coverage)

---

## 🆘 Getting Help

### For Documentation Issues
- Check the specific guide for your task (see "Finding What You Need" above)
- Read troubleshooting guides in each section
- Check the project status for known issues

### For Technical Support
- Review relevant architecture documentation
- Check safety procedures before destructive operations
- Consult the contribution guidelines for development questions

### Contact
- **Project Owner:** Libor Ballaty <libor@arionetworks.com>
- **GitHub Issues:** [https://github.com/lballaty/Permahub/issues](https://github.com/lballaty/Permahub/issues)

---

**Last Updated:** January 15, 2025

**Status:** Current and actively maintained
