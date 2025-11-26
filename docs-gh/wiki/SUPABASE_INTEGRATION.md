## Supabase Integration Guide

This guide walks you through connecting the Community Wiki to your Supabase database.

## Step 1: Run Database Migrations

1. Open your Supabase Dashboard: https://app.supabase.com/project/mcbxbaggjaxqfdvmrqsc

2. Go to **SQL Editor** (left sidebar)

3. Create a new query and paste the contents of `/database/migrations/004_wiki_schema.sql`

4. Click **Run** to execute the migration

This will create all the necessary tables, indexes, RLS policies, and functions.

## Step 2: Seed Initial Data

1. In the SQL Editor, create another new query

2. Paste the contents of `/database/seeds/001_wiki_seed_data.sql`

3. Click **Run** to populate the database with sample content

This adds:
- 10 categories (Gardening, Water Management, etc.)
- 6 guides with realistic content
- 6 upcoming events
- 8 locations with coordinates

## Step 3: Verify the Data

Run these queries in SQL Editor to verify:

```sql
-- Check categories
SELECT COUNT(*) as categories FROM wiki_categories;

-- Check guides
SELECT title, status, view_count FROM wiki_guides;

-- Check events
SELECT title, event_date, location_name FROM wiki_events ORDER BY event_date;

-- Check locations
SELECT name, location_type, latitude, longitude FROM wiki_locations;
```

## Step 4: Update Pages to Use Real Data

The wiki pages are currently mockups. Here's how to connect them to Supabase:

### Example: Loading Guides on Home Page

Replace the static HTML in `wiki-home.html` with:

```html
<!-- In the <head> add: -->
<script type="module">
  import { wikiAPI } from './js/wiki-supabase.js';

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Load recent guides
      const guides = await wikiAPI.getGuides({ limit: 6 });
      renderGuides(guides);

      // Load upcoming events
      const events = await wikiAPI.getEvents({ limit: 3 });
      renderEvents(events);

      // Load locations
      const locations = await wikiAPI.getLocations({ limit: 6 });
      renderLocations(locations);

      // Load stats
      const stats = await wikiAPI.getStats();
      document.querySelector('#guidesCount').textContent = stats.guides;
      document.querySelector('#locationsCount').textContent = stats.locations;
      document.querySelector('#eventsCount').textContent = stats.events;

    } catch (error) {
      console.error('Error loading data:', error);
    }
  });

  function renderGuides(guides) {
    const container = document.querySelector('#guidesGrid');
    container.innerHTML = guides.map(guide => `
      <div class="card">
        <div class="card-meta">
          <span><i class="fas fa-calendar"></i> ${formatDate(guide.created_at)}</span>
          <span><i class="fas fa-eye"></i> ${guide.view_count} views</span>
        </div>
        <h3 class="card-title">
          <a href="wiki-page.html?slug=${guide.slug}">${guide.title}</a>
        </h3>
        <p class="text-muted">${guide.summary}</p>
      </div>
    `).join('');
  }

  function renderEvents(events) {
    const container = document.querySelector('#eventsGrid');
    container.innerHTML = events.map(event => `
      <div class="event-card">
        <div class="event-date">
          <div class="event-day">${new Date(event.event_date).getDate()}</div>
          <div class="event-month">${new Date(event.event_date).toLocaleDateString('en-US', {month: 'short'})}</div>
        </div>
        <div class="event-details">
          <h3 class="event-title">${event.title}</h3>
          <div class="event-info">
            <span><i class="fas fa-clock"></i> ${event.start_time} - ${event.end_time}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${event.location_name}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderLocations(locations) {
    const container = document.querySelector('#locationsGrid');
    container.innerHTML = locations.map(loc => `
      <div class="card">
        <h3>${loc.name}</h3>
        <p class="text-muted">${loc.description}</p>
        <a href="wiki-map.html?location=${loc.slug}" class="btn btn-outline btn-small">View on Map</a>
      </div>
    `).join('');
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
</script>
```

### Example: Article Page with Real Data

For `wiki-page.html`, add URL parameter handling:

```html
<script type="module">
  import { wikiAPI } from './js/wiki-supabase.js';

  document.addEventListener('DOMContentLoaded', async () => {
    // Get slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
      window.location.href = 'wiki-home.html';
      return;
    }

    try {
      // Load guide
      const guide = await wikiAPI.getGuide(slug);
      if (!guide) {
        alert('Guide not found');
        window.location.href = 'wiki-home.html';
        return;
      }

      // Render guide
      document.querySelector('#guideTitle').textContent = guide.title;
      document.querySelector('#guideSummary').textContent = guide.summary;
      document.querySelector('#guideContent').innerHTML = marked.parse(guide.content); // Use marked.js for markdown
      document.querySelector('#viewCount').textContent = guide.view_count;

      // Load categories
      const categories = await wikiAPI.getGuideCategories(guide.id);
      renderCategories(categories);

      // Check if favorited
      const isFav = await wikiAPI.isFavorite('guide', guide.id);
      updateFavoriteButton(isFav);

    } catch (error) {
      console.error('Error loading guide:', error);
    }
  });
</script>
```

### Example: Working Favorite Button

```javascript
async function toggleFavorite() {
  try {
    const slug = new URLSearchParams(window.location.search).get('slug');
    const guide = await wikiAPI.getGuide(slug);

    const isFavorited = await wikiAPI.toggleFavorite('guide', guide.id);

    updateFavoriteButton(isFavorited);

    if (isFavorited) {
      showNotification('Added to favorites!', 'success');
    } else {
      showNotification('Removed from favorites', 'info');
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    showNotification('Please log in to save favorites', 'error');
  }
}

function updateFavoriteButton(isFavorited) {
  const btn = document.getElementById('favoriteBtn');
  const icon = document.getElementById('favoriteIcon');
  const text = document.getElementById('favoriteText');

  if (isFavorited) {
    icon.classList.remove('far');
    icon.classList.add('fas');
    icon.style.color = '#ffc107';
    text.textContent = 'Remove from Favorites';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
    icon.style.color = '';
    text.textContent = 'Save to Favorites';
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary');
  }
}
```

## Step 5: Test Authentication

The wiki uses your existing Supabase auth. Test it:

1. Go to wiki-login.html
2. Sign up with an email
3. Check Supabase Dashboard → Authentication → Users
4. Try creating a guide or favoriting content

## Step 6: Deploy to GitHub Pages

Once connected, your GitHub Pages site will work with Supabase:

1. All data loads from your Supabase instance
2. Auth works across domains (configure in Supabase → Authentication → URL Configuration)
3. Add your GitHub Pages URL to "Site URL" and "Redirect URLs"

Example: `https://lballaty.github.io/Permahub`

## API Reference

### Available Methods

```javascript
// Categories
await wikiAPI.getCategories()

// Guides
await wikiAPI.getGuides({ limit: 10, order: 'created_at.desc' })
await wikiAPI.getGuide(slugOrId)
await wikiAPI.getGuideCategories(guideId)
await wikiAPI.searchGuides(query)
await wikiAPI.createGuide(guideData)
await wikiAPI.updateGuide(guideId, guideData)

// Events
await wikiAPI.getEvents({ limit: 10, includePast: false })
await wikiAPI.getEvent(slugOrId)
await wikiAPI.createEvent(eventData)

// Locations
await wikiAPI.getLocations({ limit: 100 })
await wikiAPI.getLocation(slugOrId)
await wikiAPI.getNearbyLocations(lat, lng, distanceKm)

// Favorites
await wikiAPI.getFavorites(userId)
await wikiAPI.isFavorite(contentType, contentId, userId)
await wikiAPI.addFavorite(contentType, contentId, userId)
await wikiAPI.removeFavorite(contentType, contentId, userId)
await wikiAPI.toggleFavorite(contentType, contentId, userId)

// Collections
await wikiAPI.getCollections(userId)
await wikiAPI.createCollection(collectionData, userId)
await wikiAPI.getCollectionItems(collectionId)
await wikiAPI.addToCollection(collectionId, contentType, contentId)

// Stats
await wikiAPI.getStats()
```

## Troubleshooting

### CORS Errors
- Add your domain to Supabase → Settings → API → CORS Allowed Origins
- For local development, add `http://localhost:8080`

### RLS Policies Not Working
- Check that RLS is enabled on all tables
- Verify you're logged in when creating content
- Check Supabase logs for policy errors

### Data Not Loading
- Check browser console for errors
- Verify migrations ran successfully
- Check Supabase Dashboard → Table Editor to see if data exists

## Next Steps

1. Convert all mockup pages to use real data
2. Add image upload (use Supabase Storage)
3. Implement search functionality
4. Add comments system
5. Build admin panel for moderation

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Check `/database/migrations/004_wiki_schema.sql` for table structure
- Review `/src/wiki/js/wiki-supabase.js` for API methods
