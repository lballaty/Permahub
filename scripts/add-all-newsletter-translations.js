/**
 * Add ALL Missing Newsletter/Subscribe Translations
 * Adds newsletter translations for about, map, and page sections
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const i18nPath = path.join(__dirname, '../src/wiki/js/wiki-i18n.js');
let content = fs.readFileSync(i18nPath, 'utf-8');

// Translations to add - organized by section and language
const sections = {
  about: {
    en: {
      after: "'wiki.about.privacy_link': 'Privacy Policy',",
      insert: `
      'wiki.about.stay_connected': 'Stay Connected',
      'wiki.about.newsletter_desc': 'Get updates on new guides, events, and community news',
      'wiki.about.email_placeholder': 'Enter your email address',
      'wiki.about.subscribe': 'Subscribe',`
    },
    pt: {
      after: "'wiki.about.privacy_link': 'Política de Privacidade',",
      insert: `
      'wiki.about.stay_connected': 'Mantenha-se Conectado',
      'wiki.about.newsletter_desc': 'Receba atualizações sobre novos guias, eventos e notícias da comunidade',
      'wiki.about.email_placeholder': 'Digite seu endereço de e-mail',
      'wiki.about.subscribe': 'Inscrever-se',`
    },
    es: {
      after: "'wiki.about.privacy_link': 'Política de Privacidad',",
      insert: `
      'wiki.about.stay_connected': 'Mantente Conectado',
      'wiki.about.newsletter_desc': 'Recibe actualizaciones sobre nuevas guías, eventos y noticias de la comunidad',
      'wiki.about.email_placeholder': 'Ingresa tu dirección de correo electrónico',
      'wiki.about.subscribe': 'Suscribirse',`
    },
    cs: {
      after: "'wiki.about.privacy_link': 'Zásady ochrany osobních údajů',",
      insert: `
      'wiki.about.stay_connected': 'Zůstaňte ve Spojení',
      'wiki.about.newsletter_desc': 'Získejte aktualizace o nových průvodcích, událostech a zprávách z komunity',
      'wiki.about.email_placeholder': 'Zadejte svou e-mailovou adresu',
      'wiki.about.subscribe': 'Přihlásit se k odběru',`
    },
    de: {
      after: "'wiki.about.privacy_link': 'Datenschutzrichtlinie',",
      insert: `
      'wiki.about.stay_connected': 'In Verbindung bleiben',
      'wiki.about.newsletter_desc': 'Erhalten Sie Updates zu neuen Leitfäden, Veranstaltungen und Community-Nachrichten',
      'wiki.about.email_placeholder': 'Geben Sie Ihre E-Mail-Adresse ein',
      'wiki.about.subscribe': 'Abonnieren',`
    }
  },
  map: {
    en: {
      after: "'wiki.map.showing_all': 'Showing all locations',",
      insert: `
      'wiki.map.newsletter_desc': 'Subscribe to get updates on new locations and community projects',
      'wiki.map.email_placeholder': 'Enter your email address',
      'wiki.map.subscribe': 'Subscribe',`
    },
    pt: {
      after: "'wiki.map.showing_all': 'Mostrando todos os locais',",
      insert: `
      'wiki.map.newsletter_desc': 'Inscreva-se para receber atualizações sobre novos locais e projetos da comunidade',
      'wiki.map.email_placeholder': 'Digite seu endereço de e-mail',
      'wiki.map.subscribe': 'Inscrever-se',`
    },
    es: {
      after: "'wiki.map.showing_all': 'Mostrando todas las ubicaciones',",
      insert: `
      'wiki.map.newsletter_desc': 'Suscríbete para recibir actualizaciones sobre nuevas ubicaciones y proyectos comunitarios',
      'wiki.map.email_placeholder': 'Ingresa tu dirección de correo electrónico',
      'wiki.map.subscribe': 'Suscribirse',`
    },
    cs: {
      after: "'wiki.map.showing_all': 'Zobrazují se všechna místa',",
      insert: `
      'wiki.map.newsletter_desc': 'Přihlaste se k odběru, abyste dostávali aktualizace o nových místech a komunitních projektech',
      'wiki.map.email_placeholder': 'Zadejte svou e-mailovou adresu',
      'wiki.map.subscribe': 'Přihlásit se k odběru',`
    },
    de: {
      after: "'wiki.map.showing_all': 'Alle Standorte werden angezeigt',",
      insert: `
      'wiki.map.newsletter_desc': 'Abonnieren Sie Updates zu neuen Standorten und Community-Projekten',
      'wiki.map.email_placeholder': 'Geben Sie Ihre E-Mail-Adresse ein',
      'wiki.map.subscribe': 'Abonnieren',`
    }
  },
  page: {
    en: {
      after: "'wiki.page.print': 'Print',",
      insert: `
      'wiki.page.newsletter_desc': 'Subscribe for more guides and community updates',
      'wiki.page.email_placeholder': 'Enter your email address',
      'wiki.page.subscribe': 'Subscribe',`
    },
    pt: {
      after: "'wiki.page.print': 'Imprimir',",
      insert: `
      'wiki.page.newsletter_desc': 'Inscreva-se para mais guias e atualizações da comunidade',
      'wiki.page.email_placeholder': 'Digite seu endereço de e-mail',
      'wiki.page.subscribe': 'Inscrever-se',`
    },
    es: {
      after: "'wiki.page.print': 'Imprimir',",
      insert: `
      'wiki.page.newsletter_desc': 'Suscríbete para más guías y actualizaciones de la comunidad',
      'wiki.page.email_placeholder': 'Ingresa tu dirección de correo electrónico',
      'wiki.page.subscribe': 'Suscribirse',`
    },
    cs: {
      after: "'wiki.page.print': 'Tisk',",
      insert: `
      'wiki.page.newsletter_desc': 'Přihlaste se k odběru dalších průvodců a aktualizací komunity',
      'wiki.page.email_placeholder': 'Zadejte svou e-mailovou adresu',
      'wiki.page.subscribe': 'Přihlásit se k odběru',`
    },
    de: {
      after: "'wiki.page.print': 'Drucken',",
      insert: `
      'wiki.page.newsletter_desc': 'Abonnieren Sie weitere Leitfäden und Community-Updates',
      'wiki.page.email_placeholder': 'Geben Sie Ihre E-Mail-Adresse ein',
      'wiki.page.subscribe': 'Abonnieren',`
    }
  }
};

let totalAdded = 0;

// Add translations for each section and language
Object.entries(sections).forEach(([sectionName, languages]) => {
  console.log(`\n📝 Processing section: wiki.${sectionName}`);

  Object.entries(languages).forEach(([lang, { after, insert }]) => {
    const lines = content.split('\n');
    let found = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(after)) {
        // Insert after this line
        lines.splice(i + 1, 0, insert);
        found = true;
        totalAdded++;
        console.log(`  ✅ Added ${lang.toUpperCase()} translations`);
        break;
      }
    }

    if (!found) {
      console.log(`  ⚠️  Could not find insertion point for ${lang.toUpperCase()}`);
      console.log(`     Looking for: ${after}`);
    }

    content = lines.join('\n');
  });
});

// Write back
fs.writeFileSync(i18nPath, content, 'utf-8');

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Added translations for ${totalAdded} section-language combinations`);
console.log(`📝 Total new translation keys: ${totalAdded * 3} (about=4, map=3, page=3 per lang)`);
console.log(`📝 File updated: ${i18nPath}`);
console.log('='.repeat(60));
