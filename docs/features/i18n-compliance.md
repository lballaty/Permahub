# Multi-Language Compliance Guide

**File:** /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/I18N_COMPLIANCE.md

**Description:** Ensuring NO hardcoded text - all UI is multi-lingual from day one

**Author:** Libor Ballaty <libor@arionetworks.com>

**Created:** 2025-11-07

**Last Updated:** 2025-11-07

---

## 🌍 CORE PRINCIPLE

**NO HARDCODED TEXT IN THE USER INTERFACE**

Every word visible to users must be:
- Defined in `/src/js/i18n-translations.js`
- Loaded via `data-i18n` attributes in HTML
- Switchable via the language selector
- Available in at least English (with Spanish & Portuguese)

---

## ✅ CURRENT STATUS

### Already Using i18n
- **98 data-i18n attributes** found in HTML pages
- **200+ translation keys** defined
- **3 languages complete** (English, Portuguese, Spanish)
- **11 language templates ready** for translation

### What's Already Done
- [x] Landing page headers & navigation
- [x] Authentication labels & buttons
- [x] Form placeholders & validation messages
- [x] Dashboard section titles
- [x] Resource marketplace terms
- [x] Legal page headings
- [x] Navigation menus
- [x] Error messages

---

## 📝 HOW TO USE i18n

### In HTML Files

**Correct Way (with i18n):**
```html
<h1 data-i18n="landing.title">Welcome to Permahub</h1>
<button data-i18n="auth.login">Login</button>
<input type="email" placeholder="email.placeholder" data-i18n-placeholder="auth.email">
```

**Wrong Way (hardcoded):**
```html
<h1>Welcome to Permahub</h1>  ❌ HARDCODED
<button>Login</button>          ❌ HARDCODED
<input placeholder="Enter email">  ❌ HARDCODED
```

### In JavaScript Files

**Correct Way:**
```javascript
const title = i18n.t('landing.title');
console.log(title);  // Outputs: "Welcome to Permahub" (or translated)
```

**Wrong Way:**
```javascript
const title = "Welcome to Permahub";  ❌ HARDCODED
console.log(title);
```

---

## 🔍 AUDIT CHECKLIST

### Before Committing Code

1. **Check all visible text**
   - [ ] Page headings use `data-i18n`
   - [ ] Button labels use `data-i18n`
   - [ ] Input placeholders use `data-i18n-placeholder`
   - [ ] Error messages use i18n.t()
   - [ ] Navigation items use `data-i18n`

2. **Check all new strings**
   - [ ] Added to `/src/js/i18n-translations.js`
   - [ ] Translated to at least English, Portuguese, Spanish
   - [ ] Key name is descriptive (e.g., `auth.login` not `btn1`)

3. **Check dynamic text**
   - [ ] Page titles use `data-i18n`
   - [ ] Form validation messages use i18n.t()
   - [ ] User-facing errors use i18n.t()
   - [ ] Success messages use i18n.t()

---

## 📚 TRANSLATION KEY STRUCTURE

### Naming Convention

```
[section].[feature].[element]
```

**Examples:**
- `landing.title` - Landing page title
- `landing.subtitle` - Landing page subtitle
- `auth.login` - Auth page login button
- `auth.email.label` - Email input label
- `auth.email.placeholder` - Email input placeholder
- `auth.password.label` - Password input label
- `auth.error.invalid_email` - Invalid email error
- `dashboard.projects.title` - Dashboard projects heading
- `dashboard.projects.empty` - No projects message

**Bad Examples (Don't Use):**
- ❌ `text1`, `header2` - Not descriptive
- ❌ `button_login_screen` - Too long
- ❌ `LandingPageTitle` - Should be snake_case.lower
- ❌ `BUTTON_LOGIN` - Should be lowercase

---

## 🎯 COMMON PATTERNS

### Pattern 1: Simple Text
```html
<h1 data-i18n="landing.title">Welcome to Permahub</h1>
```

In JavaScript:
```javascript
i18n.translations.en.landing.title = "Welcome to Permahub";
i18n.translations.pt.landing.title = "Bem-vindo ao Permahub";
i18n.translations.es.landing.title = "Bienvenido a Permahub";
```

### Pattern 2: Button Labels
```html
<button data-i18n="auth.login">Login</button>
```

In JavaScript:
```javascript
i18n.translations.en.auth.login = "Login";
i18n.translations.pt.auth.login = "Fazer Login";
i18n.translations.es.auth.login = "Iniciar sesión";
```

### Pattern 3: Form Placeholders
```html
<input type="email" data-i18n-placeholder="auth.email.placeholder">
```

In JavaScript:
```javascript
i18n.translations.en.auth.email.placeholder = "Enter your email";
i18n.translations.pt.auth.email.placeholder = "Insira seu email";
i18n.translations.es.auth.email.placeholder = "Ingrese su correo";
```

### Pattern 4: Dynamic Messages (JavaScript)
```javascript
function showMessage(type) {
  const message = i18n.t(`messages.${type}`);
  console.log(message);
}

showMessage('success');  // Outputs translated success message
```

In JavaScript translations:
```javascript
i18n.translations.en.messages.success = "Operation successful!";
i18n.translations.pt.messages.success = "Operação bem-sucedida!";
i18n.translations.es.messages.success = "¡Operación exitosa!";
```

---

## 🚨 COMMON MISTAKES TO AVOID

### Mistake 1: Hardcoding Text
```javascript
// ❌ WRONG
function login() {
  alert("Login successful!");  // Hardcoded!
}

// ✅ CORRECT
function login() {
  alert(i18n.t('auth.success'));  // Translated!
}
```

### Mistake 2: Mixing English in Code
```javascript
// ❌ WRONG
const err = "Invalid email. Please try again.";

// ✅ CORRECT
const err = i18n.t('auth.error.invalid_email');
```

### Mistake 3: User Input in i18n
```javascript
// ❌ WRONG
const message = `User ${username} logged in`;

// ✅ CORRECT
const message = i18n.t('auth.login_success', { username });
```

### Mistake 4: Numbers & Dates
```javascript
// ❌ WRONG
const date = new Date().toLocaleDateString('en-US');

// ✅ CORRECT
const date = i18n.formatDate(new Date());  // Once implemented
```

### Mistake 5: Conditional Text
```javascript
// ❌ WRONG
const status = isActive ? "Active" : "Inactive";

// ✅ CORRECT
const status = i18n.t(isActive ? 'status.active' : 'status.inactive');
```

---

## 🔧 IMPLEMENTING NEW FEATURES

### Step 1: Plan the Text
List all visible text needed:
- Page title
- Headings
- Button labels
- Form labels
- Placeholders
- Error messages
- Success messages
- Empty state messages

### Step 2: Create Translation Keys
Organize by section and feature:
```javascript
// In i18n-translations.js
i18n.translations.en.newfeature = {
  title: "New Feature Title",
  button: "Click me",
  email: {
    label: "Email",
    placeholder: "Enter email",
    error: "Invalid email"
  },
  empty_state: "No items found"
};
```

### Step 3: Add to HTML
```html
<h1 data-i18n="newfeature.title">New Feature Title</h1>
<label data-i18n="newfeature.email.label">Email</label>
<input data-i18n-placeholder="newfeature.email.placeholder">
<button data-i18n="newfeature.button">Click me</button>
<p data-i18n="newfeature.empty_state">No items found</p>
```

### Step 4: Add JavaScript Logic
```javascript
function handleError() {
  const message = i18n.t('newfeature.email.error');
  showErrorMessage(message);
}
```

### Step 5: Translate to Other Languages
```javascript
i18n.translations.pt.newfeature = {
  title: "Título do Novo Recurso",
  button: "Clique em mim",
  email: {
    label: "Email",
    placeholder: "Insira e-mail",
    error: "Email inválido"
  },
  empty_state: "Nenhum item encontrado"
};

i18n.translations.es.newfeature = {
  title: "Título de Nueva Función",
  button: "Haz clic en mí",
  email: {
    label: "Correo electrónico",
    placeholder: "Ingresa correo",
    error: "Correo inválido"
  },
  empty_state: "No se encontraron elementos"
};
```

---

## ✨ BEST PRACTICES

### 1. Use Descriptive Key Names
```javascript
// Good
i18n.t('dashboard.projects.empty_state')
i18n.t('auth.password.requirements')
i18n.t('resources.filter.by_category')

// Bad
i18n.t('text1')
i18n.t('msg')
i18n.t('btn')
```

### 2. Organize by Section
```javascript
i18n.translations.en = {
  // Section 1: Landing
  landing: {
    title: "...",
    subtitle: "..."
  },
  // Section 2: Auth
  auth: {
    login: "...",
    register: "..."
  },
  // Section 3: Dashboard
  dashboard: {
    title: "..."
  }
};
```

### 3. Group Related Strings
```javascript
// Good - grouped by feature
auth: {
  email: {
    label: "Email",
    placeholder: "Enter email",
    error: "Invalid email"
  }
}

// Bad - scattered
auth: {
  email_label: "Email",
  email_placeholder: "Enter email",
  email_error: "Invalid email"
}
```

### 4. Keep Messages Concise
```javascript
// Good - clear and short
i18n.t('auth.error.invalid_email')

// Bad - too long and specific
i18n.t('auth.form.email.validation.error.format.invalid')
```

### 5. Use Consistent Terminology
```javascript
// Good - consistent terms
{
  action: "Create",
  button: "Create Project",
  success: "Project created"
}

// Bad - inconsistent
{
  action: "Add",
  button: "Make New",
  success: "Generated"
}
```

---

## 🔍 AUDIT SCRIPT

Run this to check for hardcoded text:

```bash
# Find any English text in HTML without i18n
grep -r "English\|Login\|Register\|Password" src/pages/*.html | grep -v "data-i18n"

# Check for console.log with hardcoded text
grep -r "console.log.*['\"]" src/js/ | grep -v "i18n.t"

# Find direct HTML element text (not via i18n)
grep -r "textContent.*=" src/js/ | grep -v "i18n.t"
```

---

## 📊 CURRENT i18n STATUS

### Languages Implemented
- ✅ **English** (en) - 200+ keys
- ✅ **Portuguese** (pt) - 200+ keys
- ✅ **Spanish** (es) - 200+ keys

### Languages Ready for Translation
- 🔲 **French** (fr) - template ready
- 🔲 **German** (de) - template ready
- 🔲 **Italian** (it) - template ready
- 🔲 **Dutch** (nl) - template ready
- 🔲 **Polish** (pl) - template ready
- 🔲 **Japanese** (ja) - template ready
- 🔲 **Chinese** (zh) - template ready
- 🔲 **Korean** (ko) - template ready

### Translation Coverage
- Landing page: 100% ✓
- Authentication: 100% ✓
- Dashboard: 100% ✓
- Resources: 100% ✓
- Navigation: 100% ✓
- Errors: 100% ✓

---

## 🎯 FOR TRANSLATORS

### Adding a New Language

1. **Copy English template:**
```javascript
i18n.translations.fr = JSON.parse(JSON.stringify(i18n.translations.en));
```

2. **Translate each key:**
```javascript
i18n.translations.fr.landing.title = "Bienvenue à Permahub";
i18n.translations.fr.landing.subtitle = "Connectez les praticiens de la permaculture du monde entier";
// ... continue for all keys
```

3. **Test switching:**
```javascript
i18n.setLanguage('fr');
// All UI should update to French
```

4. **Verify completeness:**
- Check every page in new language
- Verify no English text showing
- Test all buttons and forms
- Check error messages

---

## ⚠️ ENFORCEMENT POLICY

### Code Review Checklist
- [ ] No hardcoded visible text in HTML
- [ ] No hardcoded visible text in JavaScript
- [ ] All visible text has i18n key
- [ ] Key name is descriptive
- [ ] Key is defined in all 3 languages
- [ ] Key structure follows naming convention

### Pre-Commit Hook (Recommended)
```bash
#!/bin/bash
# Check for hardcoded English text
if grep -r "['\"]Login['\"]" src/ || grep -r "['\"]Register['\"]" src/; then
  echo "ERROR: Hardcoded English text found!"
  exit 1
fi
```

---

## 📖 REFERENCE FILES

- **Translations:** `/src/js/i18n-translations.js`
- **HTML Pages:** `/src/pages/*.html` (98 data-i18n attributes)
- **Testing:** `/tests/unit/i18n.test.js` (29 tests)
- **Documentation:** `I18N_COMPLIANCE.md` (this file)

---

## 🚀 IMPLEMENTATION TIMELINE

### Week 1: Core Features
- Landing page (complete ✓)
- Authentication (complete ✓)
- Dashboard (complete ✓)

### Week 2: Additional Features
- Resources marketplace
- Map features
- User profiles

### Week 3+: Scale
- Add new languages
- Expand translation keys
- Community translations

---

## 🎓 TRAINING FOR TEAM

### For Developers
1. Read this file
2. Review i18n-translations.js
3. Check existing HTML pages for patterns
4. Practice by adding new feature with translations

### For Translators
1. Understand key structure
2. Learn to add new language
3. Translate one section at a time
4. Test in app by switching language

### For Product Managers
1. Review feature text before dev
2. Ensure all strings have i18n keys
3. Plan translations for new languages
4. Track translation progress

---

## ✅ VERIFICATION CHECKLIST

Before launching any feature:
- [ ] All visible text uses i18n
- [ ] Translation keys are descriptive
- [ ] Translations exist in en, pt, es
- [ ] Text is tested in all 3 languages
- [ ] No placeholders or Lorem Ipsum text
- [ ] Error messages are translated
- [ ] Empty states are translated
- [ ] Loading states are translated

---

## 🌱 REMEMBER

**Every language is as important as English.**

Users worldwide should feel like the app was built for their language specifically. We support 11 languages from day one - that's how we show respect to every community using Permahub.

---

**Multi-lingual by design. Quality for everyone.** 🌍

---

**Last Reviewed:** 2025-11-07
**Status:** Compliant - 98 i18n attributes in use
**Next Review:** After each major feature addition
