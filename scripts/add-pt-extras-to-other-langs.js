/**
 * File: /Users/liborballaty/LocalProjects/GitHubProjectsDocuments/Permahub/scripts/add-pt-extras-to-other-langs.js
 * Description: Add Portuguese extra keys to Spanish, Czech, and German with professional translations
 * Author: Claude Code
 * Created: 2025-01-17
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('═══════════════════════════════════════════════════════════');
console.log('🔄 ADDING PORTUGUESE EXTRAS TO OTHER LANGUAGES');
console.log('═══════════════════════════════════════════════════════════\n');

// Spanish translations for the 122 extra keys
const spanishExtras = {
  // 67 Category translations
  'wiki.categories.agroforestry-systems': 'Sistemas Agroforestales',
  'wiki.categories.animal-care': 'Cuidado Animal',
  'wiki.categories.bamboo-crafts': 'Artesanía de Bambú',
  'wiki.categories.biodiversity': 'Biodiversidad',
  'wiki.categories.biodynamics': 'Biodinámica',
  'wiki.categories.biogas': 'Biogás',
  'wiki.categories.carbon-sequestration': 'Secuestro de Carbono',
  'wiki.categories.chicken-keeping': 'Crianza de Gallinas',
  'wiki.categories.circular-economy': 'Economía Circular',
  'wiki.categories.community-building': 'Construcción Comunitaria',
  'wiki.categories.companion-planting': 'Plantación Acompañante',
  'wiki.categories.composting-systems': 'Sistemas de Compostaje',
  'wiki.categories.cover-crops': 'Cultivos de Cobertura',
  'wiki.categories.crop-rotation': 'Rotación de Cultivos',
  'wiki.categories.drip-irrigation': 'Riego por Goteo',
  'wiki.categories.dryland-farming': 'Agricultura de Secano',
  'wiki.categories.earthbag-construction': 'Construcción con Sacos de Tierra',
  'wiki.categories.ecosystem-restoration': 'Restauración de Ecosistemas',
  'wiki.categories.edible-landscaping': 'Paisajismo Comestible',
  'wiki.categories.energy-efficiency': 'Eficiencia Energética',
  'wiki.categories.food-forests': 'Bosques de Alimentos',
  'wiki.categories.food-security': 'Seguridad Alimentaria',
  'wiki.categories.genetic-diversity': 'Diversidad Genética',
  'wiki.categories.goat-keeping': 'Crianza de Cabras',
  'wiki.categories.green-building': 'Construcción Verde',
  'wiki.categories.green-manure': 'Abono Verde',
  'wiki.categories.greenhouse-growing': 'Cultivo en Invernadero',
  'wiki.categories.greywater-systems': 'Sistemas de Aguas Grises',
  'wiki.categories.habitat-creation': 'Creación de Hábitat',
  'wiki.categories.hedgerow-planting': 'Plantación de Setos',
  'wiki.categories.hügelkultur': 'Hügelkultur',
  'wiki.categories.hydroponics': 'Hidroponía',
  'wiki.categories.insect-farming': 'Cría de Insectos',
  'wiki.categories.keyhole-gardens': 'Jardines de Cerradura',
  'wiki.categories.land-regeneration': 'Regeneración de Tierras',
  'wiki.categories.livestock-integration': 'Integración Ganadera',
  'wiki.categories.mulching': 'Acolchado',
  'wiki.categories.natural-pest-control': 'Control Natural de Plagas',
  'wiki.categories.no-dig-gardening': 'Jardinería Sin Labranza',
  'wiki.categories.no-till-farming': 'Agricultura Sin Labranza',
  'wiki.categories.nutrient-cycling': 'Ciclado de Nutrientes',
  'wiki.categories.organic-farming': 'Agricultura Orgánica',
  'wiki.categories.passive-solar': 'Solar Pasivo',
  'wiki.categories.permaculture-design': 'Diseño de Permacultura',
  'wiki.categories.plant-guilds': 'Gremios de Plantas',
  'wiki.categories.rainwater-harvesting': 'Cosecha de Agua de Lluvia',
  'wiki.categories.renewable-energy-systems': 'Sistemas de Energía Renovable',
  'wiki.categories.rocket-stoves': 'Estufas Cohete',
  'wiki.categories.seed-saving': 'Guardado de Semillas',
  'wiki.categories.sheet-mulching': 'Acolchado en Capas',
  'wiki.categories.soil-building': 'Construcción de Suelo',
  'wiki.categories.soil-conservation': 'Conservación de Suelos',
  'wiki.categories.solar-cooking': 'Cocina Solar',
  'wiki.categories.straw-bale-construction': 'Construcción con Fardos de Paja',
  'wiki.categories.swales': 'Zanjas de Infiltración',
  'wiki.categories.terrace-building': 'Construcción de Terrazas',
  'wiki.categories.tool-making': 'Fabricación de Herramientas',
  'wiki.categories.traditional-crafts': 'Artesanía Tradicional',
  'wiki.categories.tree-planting': 'Plantación de Árboles',
  'wiki.categories.urban-farming': 'Agricultura Urbana',
  'wiki.categories.vermicomposting': 'Vermicompostaje',
  'wiki.categories.water-conservation': 'Conservación del Agua',
  'wiki.categories.wildlife-corridors': 'Corredores de Vida Silvestre',
  'wiki.categories.windbreak-planting': 'Plantación de Cortavientos',
  'wiki.categories.worm-farming': 'Lombricultura',
  'wiki.categories.zero-waste': 'Cero Residuos',
  'wiki.categories.zone-planning': 'Planificación por Zonas',

  // 53 Common UI translations
  'wiki.common.submit': 'Enviar',
  'wiki.common.view': 'Ver',
  'wiki.common.clear': 'Limpiar',
  'wiki.common.apply': 'Aplicar',
  'wiki.common.reset': 'Restablecer',
  'wiki.common.confirm': 'Confirmar',
  'wiki.common.are_you_sure': '¿Estás seguro?',
  'wiki.common.yes': 'Sí',
  'wiki.common.no': 'No',
  'wiki.common.ok': 'OK',
  'wiki.common.copy': 'Copiar',
  'wiki.common.copied': '¡Copiado!',
  'wiki.common.download': 'Descargar',
  'wiki.common.upload': 'Subir',
  'wiki.common.select_all': 'Seleccionar Todo',
  'wiki.common.deselect_all': 'Deseleccionar Todo',
  'wiki.common.required': 'Obligatorio',
  'wiki.common.optional': 'Opcional',
  'wiki.common.email': 'Correo',
  'wiki.common.name': 'Nombre',
  'wiki.common.description': 'Descripción',
  'wiki.common.date': 'Fecha',
  'wiki.common.time': 'Hora',
  'wiki.common.location': 'Ubicación',
  'wiki.common.category': 'Categoría',
  'wiki.common.tags': 'Etiquetas',
  'wiki.common.author': 'Autor',
  'wiki.common.created': 'Creado',
  'wiki.common.updated': 'Actualizado',
  'wiki.common.published': 'Publicado',
  'wiki.common.draft': 'Borrador',
  'wiki.common.status': 'Estado',
  'wiki.common.actions': 'Acciones',
  'wiki.common.more': 'Más',
  'wiki.common.less': 'Menos',
  'wiki.common.show_more': 'Mostrar Más',
  'wiki.common.load_more': 'Cargar Más',
  'wiki.common.no_results': 'No se encontraron resultados',
  'wiki.common.no_data': 'Sin datos disponibles',
  'wiki.common.error_occurred': 'Ocurrió un error',
  'wiki.common.try_again': 'Intentar de nuevo',
  'wiki.common.refresh': 'Actualizar',
  'wiki.common.offline': 'Sin conexión',
  'wiki.common.online': 'En línea',
  'wiki.common.connecting': 'Conectando...',
  'wiki.common.connected': 'Conectado',
  'wiki.common.disconnected': 'Desconectado',
  'wiki.common.saved': 'Guardado',
  'wiki.common.saving': 'Guardando...',
  'wiki.common.deleting': 'Eliminando...',
  'wiki.common.deleted': 'Eliminado',
  'wiki.common.updating': 'Actualizando...',
  'wiki.common.publishing': 'Publicando...',

  // 2 Other translations
  'wiki.editor.location_website_hint': 'Sitio web oficial de la ubicación',
  'wiki.settings.location_hidden_desc': 'No mostrar información de ubicación'
};

const czechExtras = {
  // 67 Category translations
  'wiki.categories.agroforestry-systems': 'Agrolesní Systémy',
  'wiki.categories.animal-care': 'Péče o Zvířata',
  'wiki.categories.bamboo-crafts': 'Bambusové Řemesla',
  'wiki.categories.biodiversity': 'Biodiverzita',
  'wiki.categories.biodynamics': 'Biodynamika',
  'wiki.categories.biogas': 'Bioplyn',
  'wiki.categories.carbon-sequestration': 'Sekvestrace Uhlíku',
  'wiki.categories.chicken-keeping': 'Chov Slepic',
  'wiki.categories.circular-economy': 'Oběhové Hospodářství',
  'wiki.categories.community-building': 'Budování Komunity',
  'wiki.categories.companion-planting': 'Společné Pěstování',
  'wiki.categories.composting-systems': 'Kompostovací Systémy',
  'wiki.categories.cover-crops': 'Krycí Plodiny',
  'wiki.categories.crop-rotation': 'Střídání Plodin',
  'wiki.categories.drip-irrigation': 'Kapková Závlaha',
  'wiki.categories.dryland-farming': 'Suchozemské Zemědělství',
  'wiki.categories.earthbag-construction': 'Stavba z Pytlů se Zeminou',
  'wiki.categories.ecosystem-restoration': 'Obnova Ekosystémů',
  'wiki.categories.edible-landscaping': 'Jedlá Krajina',
  'wiki.categories.energy-efficiency': 'Energetická Účinnost',
  'wiki.categories.food-forests': 'Potravinové Lesy',
  'wiki.categories.food-security': 'Potravinová Bezpečnost',
  'wiki.categories.genetic-diversity': 'Genetická Diverzita',
  'wiki.categories.goat-keeping': 'Chov Koz',
  'wiki.categories.green-building': 'Zelené Stavitelství',
  'wiki.categories.green-manure': 'Zelené Hnojení',
  'wiki.categories.greenhouse-growing': 'Pěstování ve Skleníku',
  'wiki.categories.greywater-systems': 'Systémy Šedé Vody',
  'wiki.categories.habitat-creation': 'Vytváření Stanovišť',
  'wiki.categories.hedgerow-planting': 'Sázení Živých Plotů',
  'wiki.categories.hügelkultur': 'Hügelkultur',
  'wiki.categories.hydroponics': 'Hydroponika',
  'wiki.categories.insect-farming': 'Chov Hmyzu',
  'wiki.categories.keyhole-gardens': 'Klíčové Zahrady',
  'wiki.categories.land-regeneration': 'Regenerace Půdy',
  'wiki.categories.livestock-integration': 'Integrace Chovu Dobytka',
  'wiki.categories.mulching': 'Mulčování',
  'wiki.categories.natural-pest-control': 'Přírodní Kontrola Škůdců',
  'wiki.categories.no-dig-gardening': 'Zahradničení bez Kopání',
  'wiki.categories.no-till-farming': 'Zemědělství bez Orání',
  'wiki.categories.nutrient-cycling': 'Cyklus Živin',
  'wiki.categories.organic-farming': 'Ekologické Zemědělství',
  'wiki.categories.passive-solar': 'Pasivní Solární',
  'wiki.categories.permaculture-design': 'Design Permakultury',
  'wiki.categories.plant-guilds': 'Rostlinné Cechy',
  'wiki.categories.rainwater-harvesting': 'Sběr Dešťové Vody',
  'wiki.categories.renewable-energy-systems': 'Systémy Obnovitelné Energie',
  'wiki.categories.rocket-stoves': 'Raketové Kamna',
  'wiki.categories.seed-saving': 'Ukládání Semen',
  'wiki.categories.sheet-mulching': 'Vrstvené Mulčování',
  'wiki.categories.soil-building': 'Budování Půdy',
  'wiki.categories.soil-conservation': 'Ochrana Půdy',
  'wiki.categories.solar-cooking': 'Solární Vaření',
  'wiki.categories.straw-bale-construction': 'Stavba ze Slaměných Balíků',
  'wiki.categories.swales': 'Zavlažovací Příkopy',
  'wiki.categories.terrace-building': 'Budování Teras',
  'wiki.categories.tool-making': 'Výroba Nástrojů',
  'wiki.categories.traditional-crafts': 'Tradiční Řemesla',
  'wiki.categories.tree-planting': 'Sázení Stromů',
  'wiki.categories.urban-farming': 'Městské Zemědělství',
  'wiki.categories.vermicomposting': 'Vermikompostování',
  'wiki.categories.water-conservation': 'Ochrana Vody',
  'wiki.categories.wildlife-corridors': 'Koridory Volně Žijících Živočichů',
  'wiki.categories.windbreak-planting': 'Sázení Větrolamů',
  'wiki.categories.worm-farming': 'Chov Žížal',
  'wiki.categories.zero-waste': 'Nulový Odpad',
  'wiki.categories.zone-planning': 'Plánování Zón',

  // 53 Common UI translations
  'wiki.common.submit': 'Odeslat',
  'wiki.common.view': 'Zobrazit',
  'wiki.common.clear': 'Vymazat',
  'wiki.common.apply': 'Použít',
  'wiki.common.reset': 'Obnovit',
  'wiki.common.confirm': 'Potvrdit',
  'wiki.common.are_you_sure': 'Jste si jisti?',
  'wiki.common.yes': 'Ano',
  'wiki.common.no': 'Ne',
  'wiki.common.ok': 'OK',
  'wiki.common.copy': 'Kopírovat',
  'wiki.common.copied': 'Zkopírováno!',
  'wiki.common.download': 'Stáhnout',
  'wiki.common.upload': 'Nahrát',
  'wiki.common.select_all': 'Vybrat Vše',
  'wiki.common.deselect_all': 'Zrušit Výběr',
  'wiki.common.required': 'Povinné',
  'wiki.common.optional': 'Volitelné',
  'wiki.common.email': 'Email',
  'wiki.common.name': 'Jméno',
  'wiki.common.description': 'Popis',
  'wiki.common.date': 'Datum',
  'wiki.common.time': 'Čas',
  'wiki.common.location': 'Umístění',
  'wiki.common.category': 'Kategorie',
  'wiki.common.tags': 'Štítky',
  'wiki.common.author': 'Autor',
  'wiki.common.created': 'Vytvořeno',
  'wiki.common.updated': 'Aktualizováno',
  'wiki.common.published': 'Publikováno',
  'wiki.common.draft': 'Koncept',
  'wiki.common.status': 'Stav',
  'wiki.common.actions': 'Akce',
  'wiki.common.more': 'Více',
  'wiki.common.less': 'Méně',
  'wiki.common.show_more': 'Zobrazit Více',
  'wiki.common.load_more': 'Načíst Více',
  'wiki.common.no_results': 'Nebyly nalezeny žádné výsledky',
  'wiki.common.no_data': 'Žádná data k dispozici',
  'wiki.common.error_occurred': 'Došlo k chybě',
  'wiki.common.try_again': 'Zkusit znovu',
  'wiki.common.refresh': 'Obnovit',
  'wiki.common.offline': 'Offline',
  'wiki.common.online': 'Online',
  'wiki.common.connecting': 'Připojování...',
  'wiki.common.connected': 'Připojeno',
  'wiki.common.disconnected': 'Odpojeno',
  'wiki.common.saved': 'Uloženo',
  'wiki.common.saving': 'Ukládání...',
  'wiki.common.deleting': 'Mazání...',
  'wiki.common.deleted': 'Smazáno',
  'wiki.common.updating': 'Aktualizace...',
  'wiki.common.publishing': 'Publikování...',

  // 2 Other translations
  'wiki.editor.location_website_hint': 'Oficiální webová stránka místa',
  'wiki.settings.location_hidden_desc': 'Nezobrazovat žádné informace o poloze'
};

const germanExtras = {
  // 67 Category translations
  'wiki.categories.agroforestry-systems': 'Agroforstsysteme',
  'wiki.categories.animal-care': 'Tierpflege',
  'wiki.categories.bamboo-crafts': 'Bambushandwerk',
  'wiki.categories.biodiversity': 'Biodiversität',
  'wiki.categories.biodynamics': 'Biodynamik',
  'wiki.categories.biogas': 'Biogas',
  'wiki.categories.carbon-sequestration': 'Kohlenstoffbindung',
  'wiki.categories.chicken-keeping': 'Hühnerhaltung',
  'wiki.categories.circular-economy': 'Kreislaufwirtschaft',
  'wiki.categories.community-building': 'Gemeinschaftsbildung',
  'wiki.categories.companion-planting': 'Mischkultur',
  'wiki.categories.composting-systems': 'Kompostsysteme',
  'wiki.categories.cover-crops': 'Gründüngung',
  'wiki.categories.crop-rotation': 'Fruchtfolge',
  'wiki.categories.drip-irrigation': 'Tröpfchenbewässerung',
  'wiki.categories.dryland-farming': 'Trockenfeldbau',
  'wiki.categories.earthbag-construction': 'Erdsackbau',
  'wiki.categories.ecosystem-restoration': 'Ökosystemwiederherstellung',
  'wiki.categories.edible-landscaping': 'Essbare Landschaftsgestaltung',
  'wiki.categories.energy-efficiency': 'Energieeffizienz',
  'wiki.categories.food-forests': 'Waldgärten',
  'wiki.categories.food-security': 'Ernährungssicherheit',
  'wiki.categories.genetic-diversity': 'Genetische Vielfalt',
  'wiki.categories.goat-keeping': 'Ziegenhaltung',
  'wiki.categories.green-building': 'Grünes Bauen',
  'wiki.categories.green-manure': 'Gründüngung',
  'wiki.categories.greenhouse-growing': 'Gewächshausanbau',
  'wiki.categories.greywater-systems': 'Grauwassersysteme',
  'wiki.categories.habitat-creation': 'Lebensraumschaffung',
  'wiki.categories.hedgerow-planting': 'Heckenpflanzung',
  'wiki.categories.hügelkultur': 'Hügelkultur',
  'wiki.categories.hydroponics': 'Hydroponik',
  'wiki.categories.insect-farming': 'Insektenzucht',
  'wiki.categories.keyhole-gardens': 'Schlüssellochgärten',
  'wiki.categories.land-regeneration': 'Landregeneration',
  'wiki.categories.livestock-integration': 'Viehintegration',
  'wiki.categories.mulching': 'Mulchen',
  'wiki.categories.natural-pest-control': 'Natürliche Schädlingsbekämpfung',
  'wiki.categories.no-dig-gardening': 'Nicht-Umgrabe-Gartenbau',
  'wiki.categories.no-till-farming': 'Direktsaat',
  'wiki.categories.nutrient-cycling': 'Nährstoffkreislauf',
  'wiki.categories.organic-farming': 'Ökologische Landwirtschaft',
  'wiki.categories.passive-solar': 'Passive Solarenergie',
  'wiki.categories.permaculture-design': 'Permakultur-Design',
  'wiki.categories.plant-guilds': 'Pflanzengilden',
  'wiki.categories.rainwater-harvesting': 'Regenwassersammlung',
  'wiki.categories.renewable-energy-systems': 'Erneuerbare Energiesysteme',
  'wiki.categories.rocket-stoves': 'Raketenofen',
  'wiki.categories.seed-saving': 'Saatguterhaltung',
  'wiki.categories.sheet-mulching': 'Schichtmulchen',
  'wiki.categories.soil-building': 'Bodenaufbau',
  'wiki.categories.soil-conservation': 'Bodenschutz',
  'wiki.categories.solar-cooking': 'Solarkochen',
  'wiki.categories.straw-bale-construction': 'Strohballenbau',
  'wiki.categories.swales': 'Versickerungsmulden',
  'wiki.categories.terrace-building': 'Terrassenbau',
  'wiki.categories.tool-making': 'Werkzeugherstellung',
  'wiki.categories.traditional-crafts': 'Traditionelles Handwerk',
  'wiki.categories.tree-planting': 'Baumpflanzung',
  'wiki.categories.urban-farming': 'Urbane Landwirtschaft',
  'wiki.categories.vermicomposting': 'Wurmkompostierung',
  'wiki.categories.water-conservation': 'Wasserschutz',
  'wiki.categories.wildlife-corridors': 'Wildtierkorridore',
  'wiki.categories.windbreak-planting': 'Windschutzpflanzung',
  'wiki.categories.worm-farming': 'Wurmzucht',
  'wiki.categories.zero-waste': 'Null Abfall',
  'wiki.categories.zone-planning': 'Zonenplanung',

  // 53 Common UI translations
  'wiki.common.submit': 'Absenden',
  'wiki.common.view': 'Ansehen',
  'wiki.common.clear': 'Löschen',
  'wiki.common.apply': 'Anwenden',
  'wiki.common.reset': 'Zurücksetzen',
  'wiki.common.confirm': 'Bestätigen',
  'wiki.common.are_you_sure': 'Sind Sie sicher?',
  'wiki.common.yes': 'Ja',
  'wiki.common.no': 'Nein',
  'wiki.common.ok': 'OK',
  'wiki.common.copy': 'Kopieren',
  'wiki.common.copied': 'Kopiert!',
  'wiki.common.download': 'Herunterladen',
  'wiki.common.upload': 'Hochladen',
  'wiki.common.select_all': 'Alles Auswählen',
  'wiki.common.deselect_all': 'Auswahl Aufheben',
  'wiki.common.required': 'Erforderlich',
  'wiki.common.optional': 'Optional',
  'wiki.common.email': 'E-Mail',
  'wiki.common.name': 'Name',
  'wiki.common.description': 'Beschreibung',
  'wiki.common.date': 'Datum',
  'wiki.common.time': 'Zeit',
  'wiki.common.location': 'Standort',
  'wiki.common.category': 'Kategorie',
  'wiki.common.tags': 'Tags',
  'wiki.common.author': 'Autor',
  'wiki.common.created': 'Erstellt',
  'wiki.common.updated': 'Aktualisiert',
  'wiki.common.published': 'Veröffentlicht',
  'wiki.common.draft': 'Entwurf',
  'wiki.common.status': 'Status',
  'wiki.common.actions': 'Aktionen',
  'wiki.common.more': 'Mehr',
  'wiki.common.less': 'Weniger',
  'wiki.common.show_more': 'Mehr Anzeigen',
  'wiki.common.load_more': 'Mehr Laden',
  'wiki.common.no_results': 'Keine Ergebnisse gefunden',
  'wiki.common.no_data': 'Keine Daten verfügbar',
  'wiki.common.error_occurred': 'Ein Fehler ist aufgetreten',
  'wiki.common.try_again': 'Erneut versuchen',
  'wiki.common.refresh': 'Aktualisieren',
  'wiki.common.offline': 'Offline',
  'wiki.common.online': 'Online',
  'wiki.common.connecting': 'Verbinden...',
  'wiki.common.connected': 'Verbunden',
  'wiki.common.disconnected': 'Getrennt',
  'wiki.common.saved': 'Gespeichert',
  'wiki.common.saving': 'Speichern...',
  'wiki.common.deleting': 'Löschen...',
  'wiki.common.deleted': 'Gelöscht',
  'wiki.common.updating': 'Aktualisieren...',
  'wiki.common.publishing': 'Veröffentlichen...',

  // 2 Other translations
  'wiki.editor.location_website_hint': 'Offizielle Website des Standorts',
  'wiki.settings.location_hidden_desc': 'Keine Standortinformationen anzeigen'
};

console.log(`📝 Spanish: ${Object.keys(spanishExtras).length} translations ready`);
console.log(`📝 Czech: ${Object.keys(czechExtras).length} translations ready`);
console.log(`📝 German: ${Object.keys(germanExtras).length} translations ready\n`);

// Read the i18n file
const i18nPath = path.join(__dirname, '../src/wiki/js/wiki-i18n.js');
let content = fs.readFileSync(i18nPath, 'utf-8');

console.log('Adding translations to each language...\n');

// Function to add translations to a language section
const addToLanguage = (langCode, translations) => {
  console.log(`Processing ${langCode}...`);

  // Find the language section
  const langRegex = new RegExp(`(${langCode}: \\{[\\s\\S]*?)(\\n    \\})`, 'm');
  const match = content.match(langRegex);

  if (!match) {
    console.log(`❌ Could not find ${langCode} section`);
    return false;
  }

  // Create the new translations block
  const translationsBlock = Object.entries(translations)
    .map(([key, value]) => `      '${key}': '${value}',`)
    .join('\n');

  // Insert before the closing brace
  content = content.replace(
    langRegex,
    `$1\n\n${translationsBlock}$2`
  );

  console.log(`✅ Added ${Object.keys(translations).length} translations to ${langCode}`);
  return true;
};

// Add to each language
const esSuccess = addToLanguage('es', spanishExtras);
const csSuccess = addToLanguage('cs', czechExtras);
const deSuccess = addToLanguage('de', germanExtras);

if (esSuccess && csSuccess && deSuccess) {
  fs.writeFileSync(i18nPath, content);
  console.log('\n✅ Successfully wrote all translations to wiki-i18n.js\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ TRANSLATION ADDITION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('Now running verification...\n');
} else {
  console.log('\n❌ Failed to add some translations');
  process.exit(1);
}
