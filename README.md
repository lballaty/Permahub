# 🌱 Permahub

> A global platform connecting permaculture practitioners, projects, and sustainable living communities

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Overview

Permahub is a production-ready web platform designed to connect permaculture enthusiasts, sustainable living practitioners, and regenerative agriculture projects worldwide. The platform enables users to discover projects, share resources, connect with like-minded individuals, and build a thriving global permaculture community.

## ✨ Features

- **🗺️ Interactive Map Discovery** - Find permaculture projects worldwide using an interactive Leaflet.js map
- **📋 Project Showcase** - Browse and discover permaculture projects with detailed information
- **🛠️ Resource Marketplace** - Share and discover tools, seeds, materials, and knowledge
- **👤 User Profiles** - Create profiles highlighting skills, interests, and permaculture experience
- **🔐 Secure Authentication** - Multiple auth methods including magic links and email/password
- **🌍 Multi-language Support** - Interface available in 11 languages (3 fully translated)
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **🔒 Privacy-First** - GDPR-compliant with comprehensive privacy policies

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- A Supabase account (for database and authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lballaty/Permahub.git
   cd Permahub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp config/.env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**

   Run the migrations in order:
   ```bash
   # In your Supabase SQL Editor, run these files:
   # 1. database/migrations/001_initial_schema.sql
   # 2. database/migrations/002_analytics.sql
   # 3. database/migrations/003_items_pubsub.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
permahub/
├── src/
│   ├── pages/          # HTML pages
│   │   ├── index.html           # Landing page
│   │   ├── auth.html            # Authentication
│   │   ├── dashboard.html       # Project discovery
│   │   ├── project.html         # Project details
│   │   ├── map.html             # Map view
│   │   ├── resources.html       # Resource marketplace
│   │   ├── add-item.html        # Create items
│   │   └── legal.html           # Legal documents
│   ├── js/             # JavaScript modules
│   │   ├── config.js            # Environment config
│   │   ├── supabase-client.js   # Supabase API wrapper
│   │   └── i18n-translations.js # i18n system
│   ├── css/            # Stylesheets (to be extracted)
│   └── assets/         # Static assets
├── database/
│   └── migrations/     # SQL migration files
├── docs/
│   ├── QUICKSTART.md            # Quick start guide
│   ├── guides/                  # How-to guides
│   ├── architecture/            # Technical documentation
│   └── legal/                   # Privacy, terms, cookies
├── config/
│   └── .env.example             # Environment variables template
├── tests/              # Test files (to be added)
├── .github/            # GitHub workflows
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint JavaScript files
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Local CI/CD with Taskfile

Permahub uses a local CI/CD pipeline that runs entirely on your Mac, with no external dependencies:

```bash
task                 # List all available tasks
task dev             # Start development server
task lint            # Run ESLint
task test:smoke      # Run quick smoke tests
task test:ci         # Run full CI test suite
task build           # Build production bundle
task deploy          # Deploy to GitHub Pages (lint → test → build → deploy)
```

**Git Hooks (Automatic):**
- **Pre-commit**: Runs `lint` and `test:smoke` before every commit
- **Pre-push**: Runs `test:ci` before every push

**Tools Used:**
- [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) - Lightweight git hooks (2KB)
- [go-task](https://taskfile.dev) - Modern task runner (YAML-based)
- [gh-pages](https://github.com/tschaub/gh-pages) - GitHub Pages deployment

All tools are free, open-source, and run locally on your machine.

### Technology Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript (ES6+)
- Vite (build tool)
- Leaflet.js (interactive maps)
- Font Awesome (icons)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth (authentication)
- PostGIS (geospatial queries)
- Row Level Security (RLS)

**Hosting:**
- Vercel, Netlify, or GitHub Pages (static hosting)

## 📖 Documentation

**New to Permahub?** Start here:
- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Complete setup in 30 minutes
- **[Documentation Index](docs/INDEX.md)** - Find everything you need

**Quick Links:**
- [Quick Start](docs/QUICKSTART.md) - 5-minute overview
- [Database Setup](docs/database/supabase-cloud-setup.md) - Set up Supabase
- [Troubleshooting](docs/database/troubleshooting.md) - Common issues and solutions
- [Deployment Guide](docs/guides/deployment.md) - Deploy to production
- [Security Guide](docs/guides/security.md) - Authentication and security best practices
- [i18n Guide](docs/guides/i18n-implementation.md) - Multi-language implementation
- [Architecture Overview](docs/architecture/project-overview.md) - System architecture
- [Data Model](docs/architecture/data-model.md) - Database schema documentation
- [Roadmap](ROADMAP.md) - Project roadmap and future plans

## 🌍 Internationalization

Permahub supports 11 languages:

**Fully Translated:**
- 🇬🇧 English
- 🇵🇹 Portuguese
- 🇪🇸 Spanish

**Template Ready:**
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- 🇳🇱 Dutch
- 🇵🇱 Polish
- 🇯🇵 Japanese
- 🇨🇳 Chinese
- 🇰🇷 Korean

See the [i18n implementation guide](docs/guides/i18n-implementation.md) for details.

## 🔒 Security

- Environment variables for sensitive configuration
- Row Level Security (RLS) on all database tables
- GDPR-compliant privacy policy
- Secure authentication with Supabase Auth
- Input validation and sanitization

**⚠️ Important:** Never commit `.env` files to version control. Always use `.env.example` as a template.

## 🧪 Testing

Tests are coming soon! Planned testing includes:
- Unit tests with Jest
- Integration tests
- E2E tests with Cypress

## 🚀 Deployment

The platform can be deployed to various hosting providers:

- **Vercel** (Recommended) - See [deployment guide](docs/guides/deployment.md)
- **Netlify** - Full instructions in docs
- **GitHub Pages** - For static hosting

See the [deployment guide](docs/guides/deployment.md) for step-by-step instructions.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before getting started.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com) - The open source Firebase alternative
- Maps powered by [Leaflet.js](https://leafletjs.com) and [OpenStreetMap](https://www.openstreetmap.org)
- Icons by [Font Awesome](https://fontawesome.com)

## 📧 Contact

For questions, suggestions, or issues, please [open an issue](https://github.com/lballaty/Permahub/issues) on GitHub.

---

**Made with 🌱 for the global permaculture community**
