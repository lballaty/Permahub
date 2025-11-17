# i18n Translation Keys Reference

**File:** `/Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/docs/i18n-keys-reference.md`
**Description:** Complete reference of all translation keys in wiki-i18n.js
**Author:** Claude Code
**Created:** 2025-11-17
**Last Updated:** 2025-11-17

---

## Overview

This document provides a complete reference of all **758 translation keys** used in the Permahub Community Wiki i18n system.

**Total Keys by Language:**
- English (EN): 758 keys (baseline)
- Portuguese (PT): 880 keys (100% + 122 extras)
- Spanish (ES): 761 keys (100% + 3 extras)
- Czech (CS): 760 keys (100% + 2 extras)
- German (DE): 761 keys (100% + 3 extras)

---

## Key Structure

All keys follow the pattern: `wiki.{section}.{element}`

Example: `wiki.nav.home` → Navigation section, Home link

---

## Translation Keys by Section

### 1. Navigation (wiki.nav.*) - 11 keys

| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.nav.logo` | Site logo text | "Community Wiki" |
| `wiki.nav.home` | Home navigation link | "Home" |
| `wiki.nav.guides` | Guides navigation link | "Guides" |
| `wiki.nav.events` | Events navigation link | "Events" |
| `wiki.nav.locations` | Locations navigation link | "Locations" |
| `wiki.nav.about` | About navigation link | "About" |
| `wiki.nav.login` | Login navigation link | "Login" |
| `wiki.nav.signup` | Sign up button | "Sign Up" |
| `wiki.nav.create` | Create page button | "Create Page" |
| `wiki.nav.my_content` | My Content link | "My Content" |
| `wiki.nav.favorites` | Favorites link | "Favorites" |

**Usage Example:**
```html
<a href="wiki-home.html" data-i18n="wiki.nav.home">Home</a>
```

---

### 2. Home Page (wiki.home.*) - 23 keys

| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.home.page_title` | Browser tab title | "Community Wiki - Home" |
| `wiki.home.title` | Page heading | "Welcome to Community Wiki" |
| `wiki.home.subtitle` | Page subtitle | "Discover guides, events, and locations" |
| `wiki.home.search_placeholder` | Search box placeholder | "Search guides, events, locations..." |
| `wiki.home.latest_guides` | Latest guides section heading | "Latest Guides" |
| `wiki.home.upcoming_events` | Upcoming events section heading | "Upcoming Events" |
| `wiki.home.featured_locations` | Featured locations section heading | "Featured Locations" |
| `wiki.home.view_all_guides` | View all guides link | "View All Guides" |
| `wiki.home.view_all_events` | View all events link | "View All Events" |
| `wiki.home.view_all_locations` | View all locations link | "View All Locations" |
| `wiki.home.no_guides` | No guides message | "No guides found" |
| `wiki.home.no_events` | No events message | "No upcoming events" |
| `wiki.home.no_locations` | No locations message | "No locations found" |
| `wiki.home.browse_categories` | Browse categories heading | "Browse by Category" |
| `wiki.home.all_categories` | All categories filter | "All Categories" |
| `wiki.home.filter_by_category` | Filter dropdown label | "Filter by Category" |
| `wiki.home.loading_categories` | Loading categories message | "Loading categories..." |
| `wiki.home.showing_all` | Showing all guides message | "Showing all guides" |
| `wiki.home.loading_guides` | Loading guides message | "Loading guides..." |
| `wiki.home.loading_events` | Loading events message | "Loading upcoming events..." |
| `wiki.home.loading_locations` | Loading locations message | "Loading featured locations..." |
| `wiki.home.read_more` | Read more link | "Read More" |
| `wiki.home.learn_more` | Learn more link | "Learn More" |

**Usage Example:**
```html
<h1 data-i18n="wiki.home.title">Welcome to Community Wiki</h1>
<span data-i18n="wiki.home.loading_guides">Loading guides...</span>
```

---

### 3. Editor (wiki.editor.*) - 109 keys

#### Basic Editor Controls
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.editor.page_title` | Browser tab title | "Create/Edit - Community Wiki" |
| `wiki.editor.create_guide` | Create guide heading | "Create New Guide" |
| `wiki.editor.create_event` | Create event heading | "Create New Event" |
| `wiki.editor.create_location` | Create location heading | "Create New Location" |
| `wiki.editor.edit_guide` | Edit guide heading | "Edit Guide" |
| `wiki.editor.edit_event` | Edit event heading | "Edit Event" |
| `wiki.editor.edit_location` | Edit location heading | "Edit Location" |
| `wiki.editor.save` | Save button | "Save" |
| `wiki.editor.delete` | Delete button | "Delete" |
| `wiki.editor.preview` | Preview button | "Preview" |
| `wiki.editor.cancel` | Cancel button | "Cancel" |

#### Status & Publishing
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.editor.status_draft` | Draft status option | "Draft" |
| `wiki.editor.status_published` | Published status option | "Published" |
| `wiki.editor.status_archived` | Archived status option | "Archived" |
| `wiki.editor.settings` | Publishing settings heading | "Publishing Settings" |

#### Form Fields
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.editor.title_label` | Title field label | "Title" |
| `wiki.editor.title_placeholder` | Title placeholder | "Enter a descriptive title..." |
| `wiki.editor.content_label` | Content field label | "Content" |
| `wiki.editor.categories_label` | Categories field label | "Categories" |
| `wiki.editor.loading_categories` | Loading categories message | "Loading categories..." |
| `wiki.editor.image_label` | Featured image label | "Featured Image" |

#### Content Editor
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.editor.formatting_tip` | Formatting tip text | "💡 Tip: Format text using the toolbar above. What you see is what you get!" |
| `wiki.editor.char_count_zero` | Character count (zero) | "0 characters" |

#### Image Upload
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.editor.click_upload` | Click to upload text | "Click to upload" |
| `wiki.editor.drag_drop` | Drag and drop text | "or drag and drop" |
| `wiki.editor.upload_limit` | Upload limit text | "PNG, JPG, GIF up to 5MB" |
| `wiki.editor.remove_image` | Remove image button | "Remove Image" |

#### Wikipedia Reference Section
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.editor.wikipedia_section` | Wikipedia section heading | "Wikipedia Reference" |
| `wiki.editor.wikipedia_label` | Wikipedia link label | "Wikipedia Link (optional)" |
| `wiki.editor.wikipedia_placeholder` | Wikipedia URL placeholder | "https://en.wikipedia.org/wiki/Permaculture" |
| `wiki.editor.wikipedia_hint` | Wikipedia help text | "Add a Wikipedia link for fact-checking and additional information" |
| `wiki.editor.verification_required` | Verification required heading | "Verification Required" |
| `wiki.editor.verification_text` | Verification message | "Please verify that the Wikipedia article is relevant and accurate for this guide." |
| `wiki.editor.verify_link` | Verify link button | "Verify Link" |
| `wiki.editor.fetch_summary` | Fetch summary button | "Fetch Summary" |
| `wiki.editor.wikipedia_summary_label` | Summary field label | "Wikipedia Summary" |
| `wiki.editor.wikipedia_summary_placeholder` | Summary placeholder | "Brief summary from Wikipedia article..." |
| `wiki.editor.verified` | Verified status heading | "Verified" |
| `wiki.editor.verified_text` | Verified status message | "This Wikipedia link has been verified as accurate and relevant." |

#### Event Organizer Fields
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.editor.event_location_placeholder` | Event location placeholder | "e.g., Green Valley Farm, 123 Farm Road" |
| `wiki.editor.event_organizer_section` | Organizer section heading | "Organizer & Contact Information" |
| `wiki.editor.event_organizer_help` | Organizer section help text | "Help attendees reach you! All fields are optional." |
| `wiki.editor.organizer_name` | Organizer name label | "Organizer Name" |
| `wiki.editor.organizer_name_placeholder` | Organizer name placeholder | "e.g., Sarah Chen" |
| `wiki.editor.organizer_name_hint` | Organizer name help text | "Name of the person organizing this event" |
| `wiki.editor.organizer_org` | Organization label | "Organization" |
| `wiki.editor.organizer_org_placeholder` | Organization placeholder | "e.g., Brooklyn Botanic Garden" |
| `wiki.editor.organizer_org_hint` | Organization help text | "Organization or group hosting the event" |
| `wiki.editor.contact_email` | Contact email label | "Contact Email" |
| `wiki.editor.contact_email_placeholder` | Contact email placeholder | "e.g., info@organization.org" |
| `wiki.editor.contact_email_hint` | Contact email help text | "Email address for event inquiries" |
| `wiki.editor.contact_phone` | Contact phone label | "Contact Phone" |
| `wiki.editor.contact_phone_placeholder` | Contact phone placeholder | "e.g., +1 555 123 4567" |
| `wiki.editor.contact_phone_hint` | Contact phone help text | "Phone number for event inquiries" |
| `wiki.editor.contact_website` | Contact website label | "Contact Website" |
| `wiki.editor.contact_website_placeholder` | Contact website placeholder | "e.g., https://www.organization.org" |
| `wiki.editor.contact_website_hint` | Contact website help text | "Event-specific website (if different from registration URL)" |

#### Location Contact Fields
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.editor.location_details` | Location details heading | "Location Details" |
| `wiki.editor.address` | Address label | "Address" |
| `wiki.editor.address_placeholder` | Address placeholder | "123 Farm Road, City, Country" |
| `wiki.editor.latitude` | Latitude label | "Latitude" |
| `wiki.editor.latitude_placeholder` | Latitude placeholder | "e.g., 40.7128" |
| `wiki.editor.longitude` | Longitude label | "Longitude" |
| `wiki.editor.longitude_placeholder` | Longitude placeholder | "e.g., -74.0060" |
| `wiki.editor.coordinates_help` | Coordinates help text | "You can find coordinates by clicking on the location in Google Maps" |
| `wiki.editor.location_contact_section` | Location contact heading | "Contact Information" |
| `wiki.editor.location_contact_help` | Location contact help text | "Help visitors connect with this location! All fields are optional." |
| `wiki.editor.location_contact_name` | Contact name label | "Contact Name" |
| `wiki.editor.location_contact_name_placeholder` | Contact name placeholder | "e.g., John Smith" |
| `wiki.editor.location_contact_name_hint` | Contact name help text | "Name of primary contact person for this location" |
| `wiki.editor.location_contact_email` | Contact email label | "Contact Email" |
| `wiki.editor.location_contact_email_placeholder` | Contact email placeholder | "e.g., contact@location.org" |
| `wiki.editor.location_contact_email_hint` | Contact email help text | "Email address for location inquiries" |
| `wiki.editor.location_contact_phone` | Contact phone label | "Contact Phone" |
| `wiki.editor.location_contact_phone_placeholder` | Contact phone placeholder | "e.g., +1 555 123 4567" |
| `wiki.editor.location_contact_phone_hint` | Contact phone help text | "Phone number for location inquiries" |
| `wiki.editor.location_website` | Website label | "Website" |
| `wiki.editor.location_website_placeholder` | Website placeholder | "e.g., https://www.location.org" |
| `wiki.editor.location_website_hint` | Website help text | "Location's official website" |
| `wiki.editor.location_hours` | Operating hours label | "Operating Hours" |
| `wiki.editor.location_hours_placeholder` | Operating hours placeholder | "e.g., Monday-Friday 9am-5pm..." |
| `wiki.editor.location_hours_hint` | Operating hours help text | "When is this location open to visitors?" |

**Total wiki.editor.* keys: 109**

---

### 4. Settings (wiki.settings.*) - 51 keys

#### Page Header
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.settings.page_title` | Browser tab title | "Account Settings - Community Wiki" |
| `wiki.settings.title` | Page heading | "Account Settings" |
| `wiki.settings.subtitle` | Page subtitle | "Manage your profile, privacy preferences, and contact information visibility" |

#### Profile Information Section
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.settings.profile_section` | Profile section heading | "Profile Information" |
| `wiki.settings.profile_desc` | Profile section description | "Update your basic profile information" |
| `wiki.settings.label_full_name` | Full name label | "Full Name" |
| `wiki.settings.placeholder_full_name` | Full name placeholder | "Your full name" |
| `wiki.settings.label_username` | Username label | "Username" |
| `wiki.settings.placeholder_username` | Username placeholder | "your-username" |
| `wiki.settings.help_username` | Username help text | "Username cannot be changed after account creation" |
| `wiki.settings.label_email` | Email label | "Email Address" |
| `wiki.settings.placeholder_email` | Email placeholder | "you@example.com" |
| `wiki.settings.help_email` | Email help text | "Email is managed through your account authentication" |
| `wiki.settings.label_phone` | Phone label | "Phone Number" |
| `wiki.settings.placeholder_phone` | Phone placeholder | "+1 (555) 123-4567" |
| `wiki.settings.help_phone` | Phone help text | "Optional. Only visible if you choose to share it below." |
| `wiki.settings.label_website` | Website label | "Website" |
| `wiki.settings.placeholder_website` | Website placeholder | "https://your-website.com" |
| `wiki.settings.help_website` | Website help text | "Your personal or business website" |

#### Privacy & Visibility Section
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.settings.privacy_section` | Privacy section heading | "Privacy & Visibility" |
| `wiki.settings.privacy_desc` | Privacy section description | "Control who can see your profile and contact information" |
| `wiki.settings.public_profile` | Public profile toggle | "Make my profile public" |
| `wiki.settings.public_profile_desc` | Public profile description | "When unchecked, your profile will be completely hidden from other users. When checked, you can control which specific contact details to show." |
| `wiki.settings.privacy_warning_title` | Privacy warning title | "Privacy first:" |
| `wiki.settings.privacy_warning_text` | Privacy warning text | "Your profile is currently private. Enable \"Make my profile public\" above to control individual contact information visibility." |

#### Contact Visibility Controls
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.settings.email_visibility` | Email visibility heading | "Email Address Visibility" |
| `wiki.settings.show_email` | Show email toggle | "Show my email address" |
| `wiki.settings.show_email_desc` | Show email description | "Allow others to see your email address on your public profile" |
| `wiki.settings.phone_visibility` | Phone visibility heading | "Phone Number Visibility" |
| `wiki.settings.show_phone` | Show phone toggle | "Show my phone number" |
| `wiki.settings.show_phone_desc` | Show phone description | "Allow others to see your phone number on your public profile" |
| `wiki.settings.website_visibility` | Website visibility heading | "Website Visibility" |
| `wiki.settings.show_website` | Show website toggle | "Show my website" |
| `wiki.settings.show_website_desc` | Show website description | "Allow others to see your website link on your public profile" |
| `wiki.settings.social_visibility` | Social media visibility heading | "Social Media Visibility" |
| `wiki.settings.show_social` | Show social media toggle | "Show my social media links" |
| `wiki.settings.show_social_desc` | Show social description | "Allow others to see your social media profiles (Instagram, Facebook, YouTube, etc.)" |

#### Location Precision Settings
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.settings.location_precision` | Location precision heading | "Location Precision" |
| `wiki.settings.location_precision_desc` | Location precision description | "Choose how much location detail to show on your public profile" |
| `wiki.settings.location_exact` | Exact location option | "Exact location" |
| `wiki.settings.location_exact_desc` | Exact location description | "Show precise coordinates and full address" |
| `wiki.settings.location_city` | City level option | "City level (recommended)" |
| `wiki.settings.location_city_desc` | City level description | "Show only city and country, hide exact coordinates" |
| `wiki.settings.location_country` | Country only option | "Country only" |
| `wiki.settings.location_country_desc` | Country only description | "Show only country, hide city and coordinates" |
| `wiki.settings.location_hidden` | Hidden option | "Hidden" |
| `wiki.settings.location_hidden_desc` | Hidden description | "Don't show any location information" |

#### Contact Options
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.settings.contact_options` | Contact options heading | "Contact Options" |
| `wiki.settings.show_contact_button` | Show contact button toggle | "Show \"Contact Me\" button" |
| `wiki.settings.show_contact_button_desc` | Contact button description | "Display a button on your profile allowing others to send you messages through the platform (protects your email)" |

#### Actions
| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.settings.save_button` | Save settings button | "Save Settings" |

**Total wiki.settings.* keys: 51**

---

### 5. Authentication (wiki.auth.* & wiki.login.*) - 119 keys

*Includes login, signup, password reset, magic link authentication*

---

### 6. Guides (wiki.guides.*) - 20 keys

*Guide listing, filtering, sorting*

---

### 7. Events (wiki.events.*) - 44 keys

*Event listing, filtering, calendar view*

---

### 8. Map/Locations (wiki.map.*) - 24 keys

*Interactive map, location pins, location details*

---

### 9. Favorites (wiki.favorites.*) - 68 keys

*Favorites management, filtering, sorting*

---

### 10. About (wiki.about.*) - 43 keys

*About page content*

---

### 11. Admin (wiki.admin.*) - 40 keys

*Admin dashboard and controls*

---

### 12. Issues (wiki.issues.*) - 64 keys

*Issue reporting and tracking*

---

### 13. Categories (wiki.categories.*) - 45 keys

*Category definitions and names*

---

### 14. Common UI (wiki.common.*) - 21 keys

| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.common.loading` | Loading message | "Loading..." |
| `wiki.common.error` | Error message | "Error" |
| `wiki.common.success` | Success message | "Success" |
| `wiki.common.save` | Save button | "Save" |
| `wiki.common.cancel` | Cancel button | "Cancel" |
| `wiki.common.delete` | Delete button | "Delete" |
| `wiki.common.edit` | Edit button | "Edit" |
| `wiki.common.close` | Close button | "Close" |
| `wiki.common.back` | Back button | "Back" |
| `wiki.common.next` | Next button | "Next" |
| `wiki.common.previous` | Previous button | "Previous" |
| `wiki.common.search` | Search placeholder | "Search..." |
| `wiki.common.filter` | Filter label | "Filter" |
| `wiki.common.sort` | Sort label | "Sort" |
| `wiki.common.view` | View button | "View" |
| `wiki.common.share` | Share button | "Share" |
| `wiki.common.download` | Download button | "Download" |
| `wiki.common.upload` | Upload button | "Upload" |
| `wiki.common.required` | Required field indicator | "Required" |
| `wiki.common.optional` | Optional field indicator | "Optional" |
| `wiki.common.yes` | Yes option | "Yes" |
| `wiki.common.no` | No option | "No" |

---

### 15. Footer (wiki.footer.*) - 10 keys

| Key | Description | Example (EN) |
|-----|-------------|--------------|
| `wiki.footer.copyright` | Copyright text | "&copy; 2025 Community Wiki. All rights reserved." |
| `wiki.footer.about` | About link | "About" |
| `wiki.footer.privacy` | Privacy link | "Privacy" |
| `wiki.footer.terms` | Terms link | "Terms" |
| `wiki.footer.contact` | Contact link | "Contact" |
| `wiki.footer.report_issue` | Report issue link | "Report Issue" |
| `wiki.footer.github` | GitHub link | "GitHub" |
| `wiki.footer.language` | Language label | "Language" |
| `wiki.footer.made_with` | Made with text | "Made with" |
| `wiki.footer.for_community` | For community text | "for the global permaculture community" |

---

### 16. Time (wiki.time.*) - 9 keys

*Time formatting and display*

---

### 17. Article/Page (wiki.article.*, wiki.page.*) - 35 keys

*Article/page viewing and management*

---

### 18. Legal (wiki.legal.*) - 5 keys

*Legal pages (privacy policy, terms of service)*

---

## Usage Guidelines

### In HTML Files

**Text content:**
```html
<h1 data-i18n="wiki.home.title">Welcome to Community Wiki</h1>
```

**Input placeholders:**
```html
<input type="text" data-i18n-placeholder="wiki.editor.title_placeholder" placeholder="Enter a descriptive title...">
```

**Button text:**
```html
<button data-i18n="wiki.common.save">Save</button>
```

### In JavaScript Files

**Get translation:**
```javascript
const welcomeText = wikiI18n.t('wiki.home.title');
```

**Set language:**
```javascript
wikiI18n.setLanguage('pt'); // Portuguese
wikiI18n.setLanguage('es'); // Spanish
wikiI18n.setLanguage('cs'); // Czech
wikiI18n.setLanguage('de'); // German
```

---

## Verification

Run verification to check translation completeness:

```bash
node scripts/verify-translations-complete.js
```

This will show:
- Total keys per language
- Coverage percentage
- Missing keys
- Extra keys
- Category breakdown

---

## Adding New Keys

1. **Add to English** (baseline) in `src/wiki/js/wiki-i18n.js`:
   ```javascript
   en: {
     'wiki.section.new_key': 'English text',
   }
   ```

2. **Add to all other languages** (PT, ES, CS, DE):
   ```javascript
   pt: {
     'wiki.section.new_key': 'Portuguese translation',
   }
   ```

3. **Run verification** to confirm:
   ```bash
   node scripts/verify-translations-complete.js
   ```

4. **Use in HTML**:
   ```html
   <span data-i18n="wiki.section.new_key">English text</span>
   ```

---

## Files Modified

- **Source:** [src/wiki/js/wiki-i18n.js](../src/wiki/js/wiki-i18n.js)
- **Verification:** [scripts/verify-translations-complete.js](../scripts/verify-translations-complete.js)
- **Documentation:**
  - [docs/i18n-final-summary.md](i18n-final-summary.md)
  - [docs/translation-completion-reports.md](translation-completion-reports.md)

---

**Last Updated:** 2025-11-17
**Total Keys:** 758 baseline (EN)
**Languages:** English, Portuguese, Spanish, Czech, German
