# Permaculture Network - Deployment & Setup Guide

**Last Updated:** January 2025  
**Status:** Ready for deployment

---

## 🚀 Quick Start

### **What You Have**
- ✅ Complete frontend with 4 working pages
- ✅ Supabase integration configured
- ✅ Multi-language system ready
- ✅ Authentication system implemented
- ✅ Project discovery & browsing
- ✅ Legal compliance documentation

### **Next Steps**
1. Set up your Supabase project (you have it!)
2. Create database tables
3. Deploy pages to hosting
4. Configure environment
5. Test thoroughly
6. Launch!

---

## 📦 Files You Have

### **Frontend Pages (4 complete)**
```
1. auth-pages.html          (Splashscreen, login, register, password reset, profile)
2. dashboard.html            (Main project discovery page)
3. project-detail.html       (Individual project view with map)
4. legal-pages.html          (Privacy, Terms, Cookies viewer)
```

### **Supabase Integration**
```
supabase-client.js           (Complete Supabase client for all operations)
```

### **i18n System**
```
i18n-translations.js         (200+ translated strings, 11 languages, 3 complete)
```

### **Documentation**
```
- Authentication & Security Guide
- Data Model Guide
- i18n Implementation Guide
- Pages & Navigation Guide
- Project Overview
- This Deployment Guide
```

---

## 🔧 Configuration

### **Your Supabase Details**
```
URL:              https://mcbxbaggjaxqfdvmrqsc.supabase.co
Anon Key:         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Status:** ✅ Already configured in `supabase-client.js`

### **Verification**
- [ ] Visit Supabase console
- [ ] Check database is created
- [ ] Verify tables exist
- [ ] Check authentication settings

---

## 📊 Database Setup

### **Required Tables**

Your database needs these 6 tables:

1. **auth.users** (auto-created by Supabase)
   - Handles user authentication
   - Auto-managed by Supabase Auth

2. **public.users** (create this)
   ```sql
   id (UUID, PK)
   email (TEXT, unique)
   full_name (TEXT)
   bio (TEXT)
   location (TEXT)
   latitude, longitude (DECIMAL)
   skills, interests, looking_for (TEXT[])
   is_public_profile (BOOLEAN)
   created_at, updated_at (TIMESTAMP)
   ```

3. **public.projects** (create this)
   ```sql
   id (UUID, PK)
   name, description (TEXT)
   project_type (TEXT)
   latitude, longitude (DECIMAL)
   region, country (TEXT)
   plants_species, techniques, ecological_focus (TEXT[])
   status, created_at, updated_at (TIMESTAMP)
   created_by (UUID, FK to users)
   contact_email, website (TEXT)
   ```

4. **public.resources** (create this)
5. **public.project_user_connections** (create this)
6. **public.favorites** (create this)

### **Creating Tables in Supabase**

1. Go to Supabase Dashboard
2. SQL Editor
3. Copy schema from `platform-data-model-guide.md`
4. Run each table creation SQL
5. Verify tables appear in "Tables" section

---

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Your site deployed to: https://yourproject.vercel.app
```

**Pros:**
- Free tier available
- Auto-deployed from GitHub
- Perfect for static sites + API
- Global CDN
- Easy environment variables

### **Option 2: Netlify**
```bash
# Connect your GitHub repo
# Netlify auto-deploys on push

# Or drag & drop folder:
netlify deploy --prod --dir=./
```

**Pros:**
- Very user-friendly
- Free tier generous
- Great for static sites
- Built-in forms

### **Option 3: GitHub Pages**
```bash
# Push HTML files to GitHub
# Enable Pages in settings
# Site auto-deployed to: https://username.github.io
```

**Pros:**
- Completely free
- No build needed

### **Option 4: Self-hosted**
```bash
# Using Node.js simple server
npm install -g http-server
http-server .

# Visit: http://localhost:8080
```

---

## 📁 Project Structure for Deployment

```
your-project/
├── index.html              (Redirect to /auth)
├── auth/
│   └── index.html          (Copy of auth-pages.html)
├── dashboard/
│   └── index.html          (Copy of dashboard.html)
├── project/
│   └── index.html          (Copy of project-detail.html)
├── legal/
│   ├── privacy.html
│   ├── terms.html
│   ├── cookies.html
│   └── index.html          (Copy of legal-pages.html)
├── js/
│   ├── i18n-translations.js
│   ├── supabase-client.js
│   └── app.js
├── css/
│   └── style.css           (Global styles)
├── images/                 (Project images)
├── .env.local             (Local only, git ignored)
├── .env.example           (Template)
├── .gitignore
└── README.md
```

---

## 🔐 Environment Configuration

### **Local Development (.env.local)**
```
VITE_SUPABASE_URL=https://mcbxbaggjaxqfdvmrqsc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_URL=http://localhost:3000
VITE_ENV=development
```

### **Production Deployment**
Set these environment variables in your hosting:

**Vercel:**
1. Project Settings
2. Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL`

**Netlify:**
1. Site Settings
2. Build & Deploy
3. Environment
4. Add same variables

**GitHub Pages:**
Use `.env.local` file (not in repo)

---

## 🧪 Testing Checklist

### **Before Going Live**

**Authentication**
- [ ] Sign up works
- [ ] Login works (password)
- [ ] Magic link works
- [ ] Password reset works
- [ ] Profile completion works
- [ ] Logout works

**Dashboard**
- [ ] Projects load
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Projects display correctly
- [ ] Cards are responsive

**Project Detail**
- [ ] Projects load with ID
- [ ] Map displays
- [ ] Contact info shows
- [ ] Share button works
- [ ] Related content shows

**Legal Pages**
- [ ] Privacy Policy readable
- [ ] Terms of Service readable
- [ ] Cookies Policy readable
- [ ] Print functionality works

**Mobile**
- [ ] All pages responsive
- [ ] Touch controls work
- [ ] Navigation works
- [ ] Forms are usable

**Internationalization**
- [ ] Language selector works
- [ ] Language changes apply
- [ ] Text translates correctly
- [ ] Preference persists

**Security**
- [ ] No console errors
- [ ] Auth tokens secure
- [ ] URLs are HTTPS
- [ ] XSS protections work
- [ ] CSRF tokens present

---

## 🚢 Deployment Process

### **Step 1: Prepare Repository**
```bash
# Create git repo
git init
git add .
git commit -m "Initial commit"

# Create .gitignore
echo ".env.local
node_modules/
.DS_Store" > .gitignore
```

### **Step 2: Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/permaculture-network.git
git branch -M main
git push -u origin main
```

### **Step 3: Set Up Hosting**

**For Vercel:**
```bash
npm i -g vercel
vercel
# Follow prompts, connects to GitHub
```

**For Netlify:**
1. Go to netlify.com
2. Click "New site from Git"
3. Connect GitHub
4. Select repository
5. Deploy!

**For GitHub Pages:**
1. Go to repo Settings
2. Pages section
3. Enable GitHub Pages
4. Select `main` branch, `/root` folder

### **Step 4: Configure Custom Domain**
```
Your domain registrar:
- Point to hosting nameservers
OR
- Set CNAME records

In hosting dashboard:
- Add custom domain
- Wait for DNS propagation (up to 48 hours)
```

### **Step 5: Launch!**
```
Test live URL
- Visit: https://yourdomain.com/auth
- Try logging in
- Browse projects
- Check all pages work
```

---

## 📱 Testing URLs After Deployment

### **Main Pages**
- [ ] `https://yourdomain.com/` - Should redirect to /auth
- [ ] `https://yourdomain.com/auth` - Login/Register page
- [ ] `https://yourdomain.com/dashboard` - Main dashboard
- [ ] `https://yourdomain.com/project?id=xxx` - Project detail
- [ ] `https://yourdomain.com/legal/privacy` - Privacy policy

### **Test User Creation**
```
Email: test@example.com
Password: TestPass123!

Expected:
1. Sign up succeeds
2. Profile creation page shows
3. Complete profile
4. Redirects to dashboard
5. Can see projects
```

---

## 🐛 Troubleshooting

### **Problem: "Supabase connection error"**
**Solution:**
- Check Supabase URL is correct
- Check anon key is correct
- Verify network connectivity
- Check Supabase project is active

### **Problem: "Projects not loading"**
**Solution:**
- Check database tables exist
- Verify data exists in projects table
- Check Row Level Security policies
- Check browser console for errors

### **Problem: "Authentication not working"**
**Solution:**
- Verify Supabase Auth is enabled
- Check redirect URLs configured
- Clear localStorage
- Check email is correct
- Verify magic link email is received

### **Problem: "Language not changing"**
**Solution:**
- Check i18n-translations.js is loaded
- Verify language code is correct
- Check localStorage is accessible
- Clear browser cache

### **Problem: "Map not showing on project detail"**
**Solution:**
- Check project has latitude/longitude
- Verify Leaflet.js CDN is accessible
- Check browser console for Leaflet errors
- Try different project with coordinates

### **Problem: "Images not loading"**
**Solution:**
- Check image URLs are absolute (https://)
- Verify CORS headers if cross-origin
- Check file exists at URL
- Try placeholder images first

---

## 📊 Performance Optimization

### **Already Implemented**
- ✅ Minified HTML/CSS/JS
- ✅ Lazy loading for images
- ✅ Responsive images
- ✅ Efficient queries

### **For Production**
```bash
# Enable gzip compression (hosting config)
# Set cache headers (hosting config)
# Minify CSS/JS (build step)
# Optimize images (before upload)
```

### **Monitoring**
- Set up error tracking (Sentry, LogRocket)
- Monitor database performance
- Track user analytics
- Set up uptime monitoring

---

## 📈 Analytics & Monitoring

### **Recommended Tools**
- **Google Analytics** - User tracking
- **Sentry** - Error monitoring
- **LogRocket** - Session replay
- **Supabase Logs** - Database queries
- **Uptime Robot** - Downtime alerts

### **Integration**
```html
<!-- Add to <head> of all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXX');
</script>
```

---

## 🔄 Continuous Deployment

### **GitHub Actions** (Auto-deploy on push)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## 🎯 Launch Checklist

**1 Week Before**
- [ ] All pages tested locally
- [ ] Database tables created
- [ ] Environment variables configured
- [ ] SSL certificate ready
- [ ] Custom domain configured

**1 Day Before**
- [ ] Full testing completed
- [ ] Backup database
- [ ] Monitor setup
- [ ] Support email ready
- [ ] Status page created

**Launch Day**
- [ ] Final testing
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Test all major flows
- [ ] Announce launch

**Post-Launch**
- [ ] Monitor analytics
- [ ] Fix any issues
- [ ] Gather user feedback
- [ ] Plan Phase 2 features
- [ ] Scale infrastructure if needed

---

## 🆘 Support & Maintenance

### **After Launch**
- Monitor daily for errors
- Respond to user issues quickly
- Regular backups (Supabase auto-backups)
- Security updates monthly
- Feature improvements based on feedback

### **Planned Features** (Phase 2)
- User profiles
- Create/edit projects
- Resource marketplace
- Community features
- Direct messaging
- Admin dashboard

---

## 📞 Getting Help

### **If Deployment Fails**
1. Check console errors (F12)
2. Check network tab
3. Verify environment variables
4. Check Supabase status
5. Review hosting logs

### **Common Issues**
- **CORS errors:** Check Supabase CORS config
- **404 errors:** Check file paths
- **Auth errors:** Check Supabase Auth settings
- **Blank pages:** Check HTML file references

---

## 🎉 You're Ready!

You now have:
- ✅ Complete frontend application
- ✅ Supabase backend configured
- ✅ Multi-language support
- ✅ Security & compliance built-in
- ✅ Deployment strategy
- ✅ Testing checklist

**Next:** Deploy to production and launch! 🚀

---

**Questions?** Check the other documentation files or Supabase/hosting provider docs.

**Happy deploying!** 🌱

