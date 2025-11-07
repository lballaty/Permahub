# Internationalization (i18n) Implementation Guide
## Permaculture Network - Global Multi-Language Support

---

## 1. Overview

The Permaculture Network platform is designed to be **truly global** from day one. This guide ensures that all text, labels, buttons, messages, and dynamic content can be easily translated into any language.

**Key Principles:**
- **No Hard-Coded Text:** All UI text uses translation keys
- **Centralized Translations:** All strings in one place (`i18n-translations.js`)
- **User Preference Persistence:** Language choice saved to localStorage
- **Browser Detection:** Auto-detect user's language preference
- **Fallback Chain:** Default to English if language not found
- **Easy to Add Languages:** Simple pattern to add new languages

---

## 2. Translation System Architecture

### 2.1 Structure

```
i18n-translations.js
├── supportedLanguages: { 'en', 'pt', 'es', 'fr', ... }
├── currentLanguage: 'en'
├── defaultLanguage: 'en'
└── translations: {
    en: { 'key': 'English text' },
    pt: { 'key': 'Portuguese text' },
    es: { 'key': 'Spanish text' },
    ...
}
```

### 2.2 Key Naming Convention

All translation keys follow a hierarchical namespace pattern:

```
namespace.key

Examples:
- auth.login_welcome      // Auth section, login welcome
- alert.error             // Alert section, error message
- btn.submit              // Button section, submit button
- common.email            // Common section, email field
- legal.privacy_policy    // Legal section, privacy policy
```

### 2.3 Namespaces

| Namespace | Purpose | Examples |
|-----------|---------|----------|
| `splash` | Splash screen | title, subtitle, loading |
| `auth` | Authentication & forms | login, register, reset |
| `alert` | Alert messages | success, error, info |
| `validation` | Form validation | required, invalid_email |
| `btn` | Button labels | submit, cancel, save |
| `legal` | Legal documents | privacy_policy, terms |
| `lang` | Language selector | select, current, change |
| `common` | Reusable terms | email, password, profile |
| `a11y` | Accessibility | skip_to_content, required_field |

---

## 3. Using Translations in Code

### 3.1 JavaScript (HTML/React/Vue)

**Basic Usage:**
```javascript
// Get a simple translation
const welcomeText = i18n.t('auth.login_welcome');
console.log(welcomeText); // "Welcome Back" (in English)

// With parameters (coming later)
const errorMsg = i18n.t('alert.error_message', { code: 'E001' });
```

**Set Element Text:**
```javascript
document.getElementById('welcome-title').textContent = i18n.t('auth.login_welcome');
document.getElementById('email-label').textContent = i18n.t('auth.email');
```

### 3.2 HTML (Using data-i18n Attributes)

For declarative translations, use `data-i18n` attributes:

```html
<!-- Simple text -->
<h1 data-i18n="auth.login_welcome">Welcome Back</h1>

<!-- Button label -->
<button data-i18n="btn.submit">Submit</button>

<!-- Placeholder text (requires JavaScript) -->
<input type="email" data-i18n-placeholder="auth.email_placeholder" placeholder="you@example.com">

<!-- Aria-label for accessibility -->
<button data-i18n-aria="a11y.skip_to_content" aria-label="Skip to main content">Skip</button>
```

**HTML Processor (JavaScript to run on page load):**
```javascript
function updateTranslationsInDOM() {
  // Update data-i18n elements (textContent)
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = i18n.t(key);
  });

  // Update data-i18n-placeholder elements
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = i18n.t(key);
  });

  // Update data-i18n-title elements
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    element.title = i18n.t(key);
  });

  // Update data-i18n-aria elements (aria-label)
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria');
    element.setAttribute('aria-label', i18n.t(key));
  });
}

// Run on page load
window.addEventListener('languageChanged', updateTranslationsInDOM);
window.addEventListener('DOMContentLoaded', updateTranslationsInDOM);
```

### 3.3 React Components

```jsx
import i18n from './i18n-translations';

function LoginPage() {
  const [language, setLanguage] = React.useState(i18n.getLanguage());

  React.useEffect(() => {
    const handleLanguageChange = (e) => {
      setLanguage(e.detail.language);
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  return (
    <div>
      <h1>{i18n.t('auth.login_welcome')}</h1>
      <label>{i18n.t('auth.email')}</label>
      <input placeholder={i18n.t('auth.email_placeholder')} />
      <button>{i18n.t('btn.submit')}</button>
    </div>
  );
}
```

### 3.4 Vue Components

```vue
<template>
  <div>
    <h1>{{ $t('auth.login_welcome') }}</h1>
    <label>{{ $t('auth.email') }}</label>
    <input :placeholder="$t('auth.email_placeholder')" />
    <button>{{ $t('btn.submit') }}</button>
  </div>
</template>

<script>
import i18n from './i18n-translations';

export default {
  methods: {
    $t(key) {
      return i18n.t(key);
    }
  }
}
</script>
```

---

## 4. Adding a New Language

### 4.1 Step 1: Add to Supported Languages

```javascript
// In i18n-translations.js, add to supportedLanguages:
supportedLanguages: {
  'en': { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  // ADD NEW LANGUAGE HERE:
  'ja': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
}
```

### 4.2 Step 2: Add Translation Object

```javascript
// In translations object, add new language:
translations: {
  en: { /* ... */ },
  pt: { /* ... */ },
  // ADD NEW LANGUAGE HERE:
  ja: {
    'splash.title': 'パーマカルチャーネットワーク',
    'splash.subtitle': '持続可能な生活のためのつながりを育てる',
    'splash.loading': 'グローバルパーマカルチャーコミュニティに接続中...',
    'auth.login_welcome': 'ようこそ',
    'auth.email': 'メールアドレス',
    // ... all other keys
  }
}
```

### 4.3 Step 3: Update Language Selector

Add to your UI language selector dropdown:
```html
<select onchange="i18n.setLanguage(this.value)">
  <option value="en">English</option>
  <option value="pt">Português</option>
  <option value="ja">日本語</option>
</select>
```

---

## 5. Key Naming Patterns

### 5.1 Naming Conventions

**Good key names are:**
- **Descriptive:** `auth.login_welcome` not `auth.text1`
- **Lowercase with underscores:** `auth.send_magic_link` not `auth.SendMagicLink`
- **Namespace.action pattern:** `btn.submit` not `submit_button_text`
- **Consistent:** Use same term consistently (`email` not `e-mail`, `email_address`, `mail`)

### 5.2 Key Examples by Category

**Authentication:**
```
auth.login_welcome
auth.email
auth.password
auth.send_magic_link
auth.forgot_password
```

**Buttons:**
```
btn.submit
btn.cancel
btn.save
btn.delete
btn.logout
```

**Alerts:**
```
alert.success
alert.error
alert.invalid_credentials
alert.passwords_match
```

**Common Terms (reusable):**
```
common.email
common.password
common.name
common.location
common.profile
```

---

## 6. Handling Dynamic Content

### 6.1 With Parameters

```javascript
// Define key with placeholder:
'alert.error_code': 'Error occurred: {code}'

// Use with parameters:
i18n.t('alert.error_code', { code: 'E404' });
// Returns: "Error occurred: E404"
```

### 6.2 For Names/Locations

```javascript
// Define with parameter:
'common.welcome_user': 'Welcome, {name}!'

// Use in code:
i18n.t('common.welcome_user', { name: 'Maria' });
// Returns: "Welcome, Maria!" (in current language)
```

---

## 7. Pluralization (Future Enhancement)

While not currently implemented, future versions can support pluralization:

```javascript
// Example for future implementation:
i18n.t('project.count', { count: 5 });
// Returns: "5 projects" (or appropriate plural form in that language)
```

---

## 8. Language-Specific Considerations

### 8.1 Date Formatting

```javascript
// Different languages format dates differently
const date = new Date();

// English: 1/15/2025
// Portuguese: 15/1/2025
// German: 15.1.2025

// Solution: Use Intl.DateTimeFormat
new Intl.DateTimeFormat(i18n.currentLanguage).format(date);
```

### 8.2 Number Formatting

```javascript
// Different languages use different separators
// English: 1,234.56
// Portuguese: 1.234,56
// German: 1.234,56

// Solution: Use Intl.NumberFormat
new Intl.NumberFormat(i18n.currentLanguage).format(1234.56);
```

### 8.3 Text Direction (RTL)

For right-to-left languages (Arabic, Hebrew, etc.):

```javascript
// Add to i18n.setLanguage():
const isRTL = ['ar', 'he'].includes(lang);
document.dir = isRTL ? 'rtl' : 'ltr';
```

### 8.4 Gender-Specific Terms (Future)

```javascript
// For languages with grammatical gender:
i18n.t('greeting.hello', { gender: 'female' });
// May return different form depending on gender
```

---

## 9. Translating the Platform

### 9.1 Translation Workflow

**Phase 1: Core Languages (Priority)**
- English (en) - Base language ✓
- Portuguese (pt) - Madeira/Portugal ✓
- Spanish (es) - Latin America & Spain ✓

**Phase 2: European Languages**
- French (fr)
- German (de)
- Italian (it)
- Dutch (nl)
- Polish (pl)

**Phase 3: Global Languages**
- Japanese (ja)
- Chinese (zh)
- Korean (ko)
- And more...

### 9.2 Translation Tools

**For managing translations, consider:**
- **Crowdin:** Collaborative translation platform (https://crowdin.com)
- **Lokalise:** Translation management SaaS (https://lokalise.com)
- **Weblate:** Open-source translation management (https://weblate.org)
- **POEditor:** Simple online translation editor (https://poeditor.com)

### 9.3 Translator Guidelines

**When hiring translators, provide:**
1. **Context document:** Explain what Permaculture Network is
2. **Key glossary:** Important terms in your field
3. **Brand voice:** How to maintain tone and style
4. **Cultural notes:** Context-specific translations

**Example glossary:**
```
Permaculture → Permacultura (PT), Permacultura (ES)
Sustainable living → Vida sustentable
Seed saving → Conservação de sementes (PT)
Water harvesting → Colheita de água (PT)
```

---

## 10. Testing Translations

### 10.1 Unit Tests

```javascript
// Test that all keys exist in all languages
describe('i18n', () => {
  it('should have all keys translated in all languages', () => {
    const enKeys = Object.keys(i18n.translations.en);
    const languages = Object.keys(i18n.translations);
    
    languages.forEach(lang => {
      const langKeys = Object.keys(i18n.translations[lang]);
      expect(langKeys.length).toBe(enKeys.length);
    });
  });

  it('should translate a key correctly', () => {
    const text = i18n.t('auth.login_welcome');
    expect(text).toBe('Welcome Back');
  });
});
```

### 10.2 Manual Testing Checklist

- [ ] All strings display correctly in each language
- [ ] Language selector works properly
- [ ] Language preference persists across sessions
- [ ] No text overflow with longer translations
- [ ] RTL languages (if added) display correctly
- [ ] Special characters display properly
- [ ] Date/number formatting is locale-specific
- [ ] Form placeholders translate
- [ ] Button labels translate
- [ ] Error messages translate

---

## 11. Performance Considerations

### 11.1 Bundle Size

Currently, all translations are in a single file:
- ~50KB for 11 languages with ~500 keys
- Not ideal for large apps with many languages

**Future optimization:**
```javascript
// Load only current language
async function loadLanguage(lang) {
  const response = await fetch(`/i18n/translations.${lang}.js`);
  return await response.json();
}
```

### 11.2 Caching

```javascript
// Cache translations in localStorage
const cached = localStorage.getItem(`i18n_${lang}`);
if (cached) {
  i18n.translations[lang] = JSON.parse(cached);
}
```

---

## 12. Accessibility & i18n

### 12.1 Language Declaration

Always declare the language in HTML:
```html
<html lang="en">
  <!-- or dynamically: -->
  <html lang={i18n.currentLanguage}>
</html>
```

### 12.2 Screen Reader Support

```html
<!-- Use appropriate aria-labels in translations -->
<button aria-label="Skip to main content">Skip</button>

<!-- Or via i18n: -->
<button data-i18n-aria="a11y.skip_to_content">Skip</button>
```

### 12.3 Language Direction (LTR/RTL)

```javascript
// For RTL languages
const rtlLanguages = ['ar', 'he', 'ur'];
const isRTL = rtlLanguages.includes(i18n.currentLanguage);
document.dir = isRTL ? 'rtl' : 'ltr';
```

---

## 13. Common Mistakes to Avoid

### ❌ DON'T:

```javascript
// Hard-coded text
document.textContent = 'Welcome Back';

// Sentence construction in code
const msg = 'Error: ' + errorCode;

// Duplicate translations
'error_message': 'Error message'
'error_msg': 'Error message'

// Inconsistent naming
'btn.ok', 'button_cancel', 'sendButton'
```

### ✅ DO:

```javascript
// Use translation system
document.textContent = i18n.t('auth.login_welcome');

// Use parameter substitution
i18n.t('alert.error_code', { code: errorCode });

// DRY principle - reuse keys
'btn.ok' and 'btn.cancel' (consistent)

// Consistent naming
'btn.submit', 'btn.cancel', 'btn.send' (all btn.*)
```

---

## 14. Future Enhancements

**Consider for future versions:**

1. **Language Auto-Detection**
   - Detect language from browser settings
   - Redirect to appropriate language version

2. **Contextual Help**
   - Tooltips and help text in multiple languages
   - Context-sensitive assistance

3. **Community Translations**
   - Allow community to contribute translations
   - Crowdsourced localization

4. **Locale-Specific Content**
   - Different project examples for different regions
   - Region-specific resources

5. **Language Switcher**
   - Persistent language selector in header
   - Quick language switching on any page

6. **Analytics by Language**
   - Track usage by language/region
   - Identify most-used languages

---

## 15. Multilingual Content Types

### 15.1 User-Generated Content

**Challenges:**
- Projects posted in one language
- Resources described in different languages
- Community discussions in multiple languages

**Solutions:**
- Optional translation fields
- Machine translation API (Google Translate, DeepL)
- Community translation reviews

### 15.2 Static Content

**Documentation, blog posts, guides:**
- Host on wiki or CMS with translation workflow
- Use same i18n keys for consistency
- Community-driven translations

---

## 16. Support Resources

**For developers implementing i18n:**
- [MDN: Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [i18next Library](https://www.i18next.com/)
- [React-i18next](https://react.i18next.com/)
- [Vue I18n](https://vue-i18n.intlify.dev/)

---

**Last Updated:** January 1, 2025

This i18n system ensures the Permaculture Network can serve a truly global audience from day one, with easy expansion to new languages as the community grows.

