/**
 * Add Newsletter/Subscribe Section Translations
 * Adds missing wiki.home newsletter translations to all 5 languages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const i18nPath = path.join(__dirname, '../src/wiki/js/wiki-i18n.js');
let content = fs.readFileSync(i18nPath, 'utf-8');

// Translations to add
const translations = {
  en: {
    after: "'wiki.home.guide': 'guide',",
    insert: `
      'wiki.home.stay_connected': 'Stay Connected',
      'wiki.home.newsletter_desc': 'Get updates on new guides, events, and community news delivered to your inbox',
      'wiki.home.email_placeholder': 'Enter your email address',
      'wiki.home.subscribe': 'Subscribe',`
  },
  pt: {
    after: "'wiki.home.guide': 'guia',",
    insert: `
      'wiki.home.stay_connected': 'Mantenha-se Conectado',
      'wiki.home.newsletter_desc': 'Receba atualizações sobre novos guias, eventos e notícias da comunidade na sua caixa de entrada',
      'wiki.home.email_placeholder': 'Digite seu endereço de e-mail',
      'wiki.home.subscribe': 'Inscrever-se',`
  },
  es: {
    after: "'wiki.home.guide': 'guía',",
    insert: `
      'wiki.home.stay_connected': 'Mantente Conectado',
      'wiki.home.newsletter_desc': 'Recibe actualizaciones sobre nuevas guías, eventos y noticias de la comunidad en tu bandeja de entrada',
      'wiki.home.email_placeholder': 'Ingresa tu dirección de correo electrónico',
      'wiki.home.subscribe': 'Suscribirse',`
  },
  cs: {
    after: "'wiki.home.guide': 'průvodce',",
    insert: `
      'wiki.home.stay_connected': 'Zůstaňte ve Spojení',
      'wiki.home.newsletter_desc': 'Získejte aktualizace o nových průvodcích, událostech a zprávách z komunity do vaší schránky',
      'wiki.home.email_placeholder': 'Zadejte svou e-mailovou adresu',
      'wiki.home.subscribe': 'Přihlásit se k odběru',`
  },
  de: {
    after: "'wiki.home.guide': 'Leitfaden',",
    insert: `
      'wiki.home.stay_connected': 'In Verbindung bleiben',
      'wiki.home.newsletter_desc': 'Erhalten Sie Updates zu neuen Leitfäden, Veranstaltungen und Community-Nachrichten in Ihrem Posteingang',
      'wiki.home.email_placeholder': 'Geben Sie Ihre E-Mail-Adresse ein',
      'wiki.home.subscribe': 'Abonnieren',`
  }
};

// Add translations for each language
Object.entries(translations).forEach(([lang, { after, insert }]) => {
  const lines = content.split('\n');
  let found = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(after)) {
      // Insert after this line
      lines.splice(i + 1, 0, insert);
      found = true;
      console.log(`✅ Added newsletter translations for ${lang.toUpperCase()}`);
      break;
    }
  }

  if (!found) {
    console.log(`⚠️  Could not find insertion point for ${lang.toUpperCase()}: ${after}`);
  }

  content = lines.join('\n');
});

// Write back
fs.writeFileSync(i18nPath, content, 'utf-8');

console.log(`\n✅ Newsletter translations added successfully!`);
console.log(`📝 File updated: ${i18nPath}`);
