/**
 * Community Wiki i18n Translations
 * Extends the main Permahub i18n system with wiki-specific keys
 *
 * Supported Languages: 11
 * - English (en), Portuguese (pt), Spanish (es)
 * - French (fr), German (de), Italian (it)
 * - Dutch (nl), Polish (pl), Japanese (ja)
 * - Chinese (zh), Korean (ko)
 */

const wikiI18n = {
  translations: {
    // ============ ENGLISH (en) ============
    en: {
      // Navigation
      'wiki.nav.home': 'Home',
      'wiki.nav.events': 'Events',
      'wiki.nav.locations': 'Locations',
      'wiki.nav.favorites': 'My Favorites',
      'wiki.nav.login': 'Login',
      'wiki.nav.create': 'Create Page',
      'wiki.nav.logo': 'Community Wiki',

      // Home Page
      'wiki.home.welcome': 'Welcome to Our Community Knowledge Base',
      'wiki.home.subtitle': 'Share guides, locations, events, and resources with our permaculture community',
      'wiki.home.search': 'Search for guides, events, locations...',
      'wiki.home.stats.guides': 'Guides',
      'wiki.home.stats.locations': 'Locations',
      'wiki.home.stats.events': 'Upcoming Events',
      'wiki.home.stats.contributors': 'Contributors',
      'wiki.home.categories': 'Browse by Category',
      'wiki.home.recent_guides': 'Recent Guides',
      'wiki.home.upcoming_events': 'Upcoming Events',
      'wiki.home.featured_locations': 'Featured Locations',
      'wiki.home.view_all': 'View All',
      'wiki.home.contribute_title': 'Contribute to Our Community Knowledge',
      'wiki.home.contribute_subtitle': 'Share your permaculture experiences, tips, and projects with the community. Every contribution helps us grow!',
      'wiki.home.create_guide': 'Create a Guide',
      'wiki.home.add_event': 'Add an Event',
      'wiki.home.add_location': 'Add a Location',

      // Guide/Article Page
      'wiki.article.edit': 'Edit This Page',
      'wiki.article.save_favorite': 'Save to Favorites',
      'wiki.article.saved': 'Saved!',
      'wiki.article.remove_favorite': 'Remove from Favorites',
      'wiki.article.share': 'Share',
      'wiki.article.print': 'Print',
      'wiki.article.views': 'views',
      'wiki.article.min_read': 'min read',
      'wiki.article.last_edited': 'Last edited',
      'wiki.article.contributors': 'Contributors',
      'wiki.article.people': 'people',
      'wiki.article.view_history': 'View edit history',
      'wiki.article.on_this_page': 'On This Page',
      'wiki.article.about_author': 'About the Author',
      'wiki.article.articles': 'articles',
      'wiki.article.related': 'Related Guides',
      'wiki.article.categories': 'Categories',

      // Editor Page
      'wiki.editor.title': 'Create New Guide',
      'wiki.editor.preview': 'Preview',
      'wiki.editor.save_draft': 'Save Draft',
      'wiki.editor.publish': 'Publish',
      'wiki.editor.content_type': 'Content Type',
      'wiki.editor.type.guide': 'Guide/Article',
      'wiki.editor.type.event': 'Event',
      'wiki.editor.type.location': 'Location',
      'wiki.editor.title_label': 'Title',
      'wiki.editor.title_placeholder': 'e.g., Building a Swale System for Water Retention',
      'wiki.editor.title_hint': 'A clear, descriptive title helps others find your content',
      'wiki.editor.summary_label': 'Summary',
      'wiki.editor.summary_placeholder': 'Write a brief 1-2 sentence summary that will appear in search results and previews...',
      'wiki.editor.categories_label': 'Categories',
      'wiki.editor.content_label': 'Content',
      'wiki.editor.content_tip': 'Tip: Use Markdown for formatting or click toolbar buttons',
      'wiki.editor.characters': 'characters',
      'wiki.editor.image_label': 'Featured Image',
      'wiki.editor.image_upload': 'Click to upload',
      'wiki.editor.image_drag': 'or drag and drop',
      'wiki.editor.image_formats': 'PNG, JPG, GIF up to 5MB',
      'wiki.editor.remove_image': 'Remove Image',
      'wiki.editor.event_details': 'Event Details',
      'wiki.editor.event_date': 'Event Date',
      'wiki.editor.start_time': 'Start Time',
      'wiki.editor.end_time': 'End Time',
      'wiki.editor.location_field': 'Location',
      'wiki.editor.location_placeholder': 'e.g., Green Valley Farm, 123 Farm Road',
      'wiki.editor.location_details': 'Location Details',
      'wiki.editor.address': 'Address',
      'wiki.editor.address_placeholder': '123 Farm Road, City, Country',
      'wiki.editor.latitude': 'Latitude',
      'wiki.editor.longitude': 'Longitude',
      'wiki.editor.coordinates_hint': 'You can find coordinates by clicking on the location in Google Maps',
      'wiki.editor.settings': 'Publishing Settings',
      'wiki.editor.allow_comments': 'Allow comments on this page',
      'wiki.editor.allow_edits': 'Allow other registered users to suggest edits',
      'wiki.editor.notify_group': 'Notify WhatsApp group about this content',
      'wiki.editor.cancel': 'Cancel',
      'wiki.editor.publish_now': 'Publish Now',
      'wiki.editor.tips_title': 'Writing Tips',
      'wiki.editor.tip1_title': 'Be Clear & Concise',
      'wiki.editor.tip1_text': 'Write in simple language. Break complex topics into sections with clear headings.',
      'wiki.editor.tip2_title': 'Use Images',
      'wiki.editor.tip2_text': 'Visual aids help readers understand. Include photos, diagrams, and charts where relevant.',
      'wiki.editor.tip3_title': 'Link to Related Content',
      'wiki.editor.tip3_text': 'Reference other guides and resources to help readers dive deeper into topics.',
      'wiki.editor.tip4_title': 'Add Practical Steps',
      'wiki.editor.tip4_text': 'Include actionable instructions, materials lists, and troubleshooting tips.',

      // Events Page
      'wiki.events.title': 'Community Events',
      'wiki.events.subtitle': 'Workshops, meetups, and gatherings for our permaculture community',
      'wiki.events.add': 'Add Event',
      'wiki.events.filter_by': 'Filter by:',
      'wiki.events.all': 'All Events',
      'wiki.events.workshops': 'Workshops',
      'wiki.events.meetups': 'Meetups',
      'wiki.events.tours': 'Tours',
      'wiki.events.courses': 'Courses',
      'wiki.events.workdays': 'Work Days',
      'wiki.events.list_view': 'List View',
      'wiki.events.calendar_view': 'Calendar View',
      'wiki.events.this_month': 'This Month',
      'wiki.events.coming_up': 'Coming Up',
      'wiki.events.recurring': 'Recurring Events',
      'wiki.events.register': 'Register',
      'wiki.events.details': 'Details',
      'wiki.events.registered': 'You\'re registered!',
      'wiki.events.subscribe_title': 'Never Miss an Event',
      'wiki.events.subscribe_text': 'Get email notifications about new events and changes to your registered events',
      'wiki.events.email_placeholder': 'Enter your email',
      'wiki.events.subscribe_button': 'Subscribe',
      'wiki.events.sync_calendar': 'Or sync to your calendar:',

      // Locations/Map Page
      'wiki.map.title': 'Community Locations',
      'wiki.map.subtitle': 'Discover farms, gardens, and permaculture sites in our region',
      'wiki.map.add': 'Add Location',
      'wiki.map.search': 'Search locations...',
      'wiki.map.filter_type': 'Filter by type:',
      'wiki.map.all': 'All Locations',
      'wiki.map.farms': 'Farms',
      'wiki.map.gardens': 'Gardens',
      'wiki.map.education': 'Education Centers',
      'wiki.map.community': 'Community Spaces',
      'wiki.map.business': 'Businesses',
      'wiki.map.locations_count': 'Locations',
      'wiki.map.view_map': 'View Map',
      'wiki.map.view_details': 'View Details',
      'wiki.map.directions': 'Directions',
      'wiki.map.away': 'away',
      'wiki.map.stats_title': 'Location Statistics',
      'wiki.map.total': 'Total Locations',
      'wiki.map.farms_gardens': 'Farms & Gardens',

      // Favorites Page
      'wiki.favorites.title': 'My Favorites',
      'wiki.favorites.subtitle': 'Your personalized collection of saved content',
      'wiki.favorites.sort_by': 'Recently Added',
      'wiki.favorites.sort_alpha': 'Alphabetical',
      'wiki.favorites.sort_views': 'Most Viewed',
      'wiki.favorites.sort_category': 'By Category',
      'wiki.favorites.export': 'Export',
      'wiki.favorites.saved_guides': 'Saved Guides',
      'wiki.favorites.saved_locations': 'Saved Locations',
      'wiki.favorites.upcoming_events': 'Upcoming Events',
      'wiki.favorites.collections': 'Collections',
      'wiki.favorites.tab_all': 'All',
      'wiki.favorites.tab_guides': 'Guides',
      'wiki.favorites.tab_events': 'Events',
      'wiki.favorites.tab_locations': 'Locations',
      'wiki.favorites.tab_collections': 'Collections',
      'wiki.favorites.my_collections': 'My Collections',
      'wiki.favorites.organize_text': 'Organize your favorites into custom collections',
      'wiki.favorites.items': 'items',
      'wiki.favorites.new_collection': 'New Collection',
      'wiki.favorites.saved_on': 'Saved',
      'wiki.favorites.in_collection': 'In:',
      'wiki.favorites.not_in_collection': 'Not in any collection',
      'wiki.favorites.registered_events': 'Registered Events',
      'wiki.favorites.view_calendar': 'View Calendar',
      'wiki.favorites.share_title': 'Share Your Favorites',
      'wiki.favorites.share_text': 'Share your curated collection with friends or export for offline reference',
      'wiki.favorites.shareable_link': 'Get Shareable Link',
      'wiki.favorites.export_pdf': 'Export as PDF',
      'wiki.favorites.export_csv': 'Export as CSV',

      // Login Page
      'wiki.login.title': 'Welcome Back',
      'wiki.login.subtitle': 'Login to contribute to our community knowledge base',
      'wiki.login.email_tab': 'Email Login',
      'wiki.login.magic_tab': 'Magic Link',
      'wiki.login.email_label': 'Email Address',
      'wiki.login.email_placeholder': 'your@email.com',
      'wiki.login.password_label': 'Password',
      'wiki.login.password_placeholder': '••••••••',
      'wiki.login.forgot_password': 'Forgot password?',
      'wiki.login.remember': 'Remember me for 30 days',
      'wiki.login.sign_in': 'Sign In',
      'wiki.login.or': 'or continue with',
      'wiki.login.google': 'Google',
      'wiki.login.github': 'GitHub',
      'wiki.login.magic_info': 'We\'ll send you a secure link to your email. Click the link to instantly log in without a password.',
      'wiki.login.send_link': 'Send Magic Link',
      'wiki.login.secure': 'Secure, passwordless authentication',
      'wiki.login.no_account': 'Don\'t have an account?',
      'wiki.login.sign_up': 'Sign up for free',
      'wiki.login.benefits_title': 'Why create an account?',
      'wiki.login.benefit1_title': 'Create & Edit Content',
      'wiki.login.benefit1_text': 'Share your knowledge through guides, events, and location listings',
      'wiki.login.benefit2_title': 'Join Discussions',
      'wiki.login.benefit2_text': 'Comment on articles and connect with community members',
      'wiki.login.benefit3_title': 'Get Notifications',
      'wiki.login.benefit3_text': 'Stay updated on new content, events, and topics you follow',
      'wiki.login.benefit4_title': 'Save Favorites',
      'wiki.login.benefit4_text': 'Bookmark articles and locations to reference later',
      'wiki.login.terms': 'By signing in, you agree to our',
      'wiki.login.terms_link': 'Terms of Service',
      'wiki.login.privacy_link': 'Privacy Policy',
      'wiki.login.secure_note': 'Your data is secure and will never be sold to third parties',

      // Common
      'wiki.common.loading': 'Loading...',
      'wiki.common.error': 'Error',
      'wiki.common.success': 'Success',
      'wiki.common.save': 'Save',
      'wiki.common.cancel': 'Cancel',
      'wiki.common.delete': 'Delete',
      'wiki.common.edit': 'Edit',
      'wiki.common.close': 'Close',
      'wiki.common.back': 'Back',
      'wiki.common.next': 'Next',
      'wiki.common.previous': 'Previous',
      'wiki.common.search': 'Search',
      'wiki.common.filter': 'Filter',
      'wiki.common.sort': 'Sort',
      'wiki.common.view_more': 'View More',
      'wiki.common.show_less': 'Show Less',
      'wiki.common.read_more': 'Read More',
      'wiki.common.language_changed': 'Language changed successfully',

      // Categories
      'wiki.category.gardening': 'Gardening',
      'wiki.category.water_management': 'Water Management',
      'wiki.category.composting': 'Composting',
      'wiki.category.renewable_energy': 'Renewable Energy',
      'wiki.category.food_production': 'Food Production',
      'wiki.category.agroforestry': 'Agroforestry',
      'wiki.category.natural_building': 'Natural Building',
      'wiki.category.waste_management': 'Waste Management',
      'wiki.category.irrigation': 'Irrigation',
      'wiki.category.earthworks': 'Earthworks',
      'wiki.category.diy': 'DIY',
      'wiki.category.community': 'Community',
      'wiki.category.subtropical_gardening': 'Subtropical Gardening',
      'wiki.category.food_forests': 'Food Forests',
      'wiki.category.terracing': 'Terracing',
      'wiki.category.circular_economy': 'Circular Economy',
      'wiki.category.native_species': 'Native Species',

      // Time
      'wiki.time.today': 'Today',
      'wiki.time.yesterday': 'Yesterday',
      'wiki.time.days_ago': 'days ago',
      'wiki.time.weeks_ago': 'weeks ago',
      'wiki.time.months_ago': 'months ago',
      'wiki.time.years_ago': 'years ago',

      // Footer
      'wiki.footer.made_with': 'Made with',
      'wiki.footer.for': 'for the global permaculture community',
      'wiki.footer.about': 'About',
      'wiki.footer.privacy': 'Privacy',
      'wiki.footer.terms': 'Terms',
    },

    // ============ PORTUGUESE (pt) ============
    pt: {
      // Navigation
      'wiki.nav.home': 'Início',
      'wiki.nav.events': 'Eventos',
      'wiki.nav.locations': 'Locais',
      'wiki.nav.favorites': 'Meus Favoritos',
      'wiki.nav.login': 'Entrar',
      'wiki.nav.create': 'Criar Página',
      'wiki.nav.logo': 'Wiki Comunitária',

      // Home Page
      'wiki.home.welcome': 'Bem-vindo à Nossa Base de Conhecimento Comunitária',
      'wiki.home.subtitle': 'Partilhe guias, locais, eventos e recursos com a nossa comunidade de permacultura',
      'wiki.home.search': 'Procurar guias, eventos, locais...',
      'wiki.home.stats.guides': 'Guias',
      'wiki.home.stats.locations': 'Locais',
      'wiki.home.stats.events': 'Eventos Próximos',
      'wiki.home.stats.contributors': 'Contribuidores',
      'wiki.home.categories': 'Explorar por Categoria',
      'wiki.home.recent_guides': 'Guias Recentes',
      'wiki.home.upcoming_events': 'Próximos Eventos',
      'wiki.home.featured_locations': 'Locais em Destaque',
      'wiki.home.view_all': 'Ver Todos',
      'wiki.home.contribute_title': 'Contribua para o Nosso Conhecimento Comunitário',
      'wiki.home.contribute_subtitle': 'Partilhe as suas experiências, dicas e projetos de permacultura com a comunidade. Cada contribuição ajuda-nos a crescer!',
      'wiki.home.create_guide': 'Criar um Guia',
      'wiki.home.add_event': 'Adicionar Evento',
      'wiki.home.add_location': 'Adicionar Local',

      // Guide/Article Page
      'wiki.article.edit': 'Editar Esta Página',
      'wiki.article.save_favorite': 'Guardar nos Favoritos',
      'wiki.article.saved': 'Guardado!',
      'wiki.article.remove_favorite': 'Remover dos Favoritos',
      'wiki.article.share': 'Partilhar',
      'wiki.article.print': 'Imprimir',
      'wiki.article.views': 'visualizações',
      'wiki.article.min_read': 'min de leitura',
      'wiki.article.last_edited': 'Última edição',
      'wiki.article.contributors': 'Contribuidores',
      'wiki.article.people': 'pessoas',
      'wiki.article.view_history': 'Ver histórico de edições',
      'wiki.article.on_this_page': 'Nesta Página',
      'wiki.article.about_author': 'Sobre o Autor',
      'wiki.article.articles': 'artigos',
      'wiki.article.related': 'Guias Relacionados',
      'wiki.article.categories': 'Categorias',

      // Editor (partial - add more as needed)
      'wiki.editor.title': 'Criar Novo Guia',
      'wiki.editor.preview': 'Pré-visualizar',
      'wiki.editor.save_draft': 'Guardar Rascunho',
      'wiki.editor.publish': 'Publicar',

      // Events
      'wiki.events.title': 'Eventos Comunitários',
      'wiki.events.subtitle': 'Oficinas, encontros e reuniões para a nossa comunidade de permacultura',
      'wiki.events.add': 'Adicionar Evento',
      'wiki.events.register': 'Registar',
      'wiki.events.details': 'Detalhes',

      // Map
      'wiki.map.title': 'Locais Comunitários',
      'wiki.map.subtitle': 'Descubra quintas, jardins e locais de permacultura na nossa região',
      'wiki.map.add': 'Adicionar Local',

      // Favorites
      'wiki.favorites.title': 'Meus Favoritos',
      'wiki.favorites.subtitle': 'Sua coleção personalizada de conteúdo guardado',

      // Login
      'wiki.login.title': 'Bem-vindo de Volta',
      'wiki.login.subtitle': 'Entre para contribuir para a nossa base de conhecimento comunitária',
      'wiki.login.email_tab': 'Login por Email',
      'wiki.login.magic_tab': 'Link Mágico',
      'wiki.login.email_label': 'Endereço de Email',
      'wiki.login.password_label': 'Palavra-passe',
      'wiki.login.sign_in': 'Entrar',

      // Common
      'wiki.common.loading': 'A carregar...',
      'wiki.common.error': 'Erro',
      'wiki.common.success': 'Sucesso',
      'wiki.common.save': 'Guardar',
      'wiki.common.cancel': 'Cancelar',
      'wiki.common.edit': 'Editar',
      'wiki.common.search': 'Procurar',
      'wiki.common.language_changed': 'Idioma alterado com sucesso',

      // Categories
      'wiki.category.gardening': 'Jardinagem',
      'wiki.category.water_management': 'Gestão de Água',
      'wiki.category.composting': 'Compostagem',
      'wiki.category.renewable_energy': 'Energia Renovável',
      'wiki.category.food_production': 'Produção de Alimentos',
      'wiki.category.agroforestry': 'Agrofloresta',
      'wiki.category.natural_building': 'Construção Natural',
      'wiki.category.waste_management': 'Gestão de Resíduos',
      'wiki.category.irrigation': 'Irrigação',
      'wiki.category.earthworks': 'Terraplanagem',
      'wiki.category.diy': 'Faça Você Mesmo',
      'wiki.category.community': 'Comunidade',
      'wiki.category.subtropical_gardening': 'Jardinagem Subtropical',
      'wiki.category.food_forests': 'Florestas Alimentares',
      'wiki.category.terracing': 'Socalcos',
      'wiki.category.native_species': 'Espécies Nativas',

      // Time
      'wiki.time.today': 'Hoje',
      'wiki.time.yesterday': 'Ontem',
      'wiki.time.days_ago': 'dias atrás',
      'wiki.time.weeks_ago': 'semanas atrás',

      // Footer
      'wiki.footer.made_with': 'Feito com',
      'wiki.footer.for': 'para a comunidade global de permacultura',
    },

    // ============ SPANISH (es) ============
    es: {
      // Navigation
      'wiki.nav.home': 'Inicio',
      'wiki.nav.events': 'Eventos',
      'wiki.nav.locations': 'Ubicaciones',
      'wiki.nav.favorites': 'Mis Favoritos',
      'wiki.nav.login': 'Iniciar Sesión',
      'wiki.nav.create': 'Crear Página',
      'wiki.nav.logo': 'Wiki Comunitaria',

      // Home Page
      'wiki.home.welcome': 'Bienvenido a Nuestra Base de Conocimiento Comunitario',
      'wiki.home.subtitle': 'Comparte guías, ubicaciones, eventos y recursos con nuestra comunidad de permacultura',
      'wiki.home.search': 'Buscar guías, eventos, ubicaciones...',
      'wiki.home.stats.guides': 'Guías',
      'wiki.home.stats.locations': 'Ubicaciones',
      'wiki.home.stats.events': 'Eventos Próximos',
      'wiki.home.stats.contributors': 'Colaboradores',
      'wiki.home.categories': 'Explorar por Categoría',
      'wiki.home.recent_guides': 'Guías Recientes',
      'wiki.home.upcoming_events': 'Próximos Eventos',
      'wiki.home.featured_locations': 'Ubicaciones Destacadas',
      'wiki.home.view_all': 'Ver Todos',
      'wiki.home.contribute_title': 'Contribuye a Nuestro Conocimiento Comunitario',
      'wiki.home.contribute_subtitle': 'Comparte tus experiencias, consejos y proyectos de permacultura con la comunidad. ¡Cada contribución nos ayuda a crecer!',
      'wiki.home.create_guide': 'Crear una Guía',
      'wiki.home.add_event': 'Añadir un Evento',
      'wiki.home.add_location': 'Añadir una Ubicación',

      // Common
      'wiki.common.loading': 'Cargando...',
      'wiki.common.error': 'Error',
      'wiki.common.success': 'Éxito',
      'wiki.common.save': 'Guardar',
      'wiki.common.cancel': 'Cancelar',
      'wiki.common.edit': 'Editar',
      'wiki.common.search': 'Buscar',
      'wiki.common.language_changed': 'Idioma cambiado exitosamente',

      // Categories
      'wiki.category.gardening': 'Jardinería',
      'wiki.category.water_management': 'Gestión del Agua',
      'wiki.category.composting': 'Compostaje',
      'wiki.category.renewable_energy': 'Energía Renovable',
      'wiki.category.food_production': 'Producción de Alimentos',
      'wiki.category.agroforestry': 'Agroforestería',
      'wiki.category.natural_building': 'Construcción Natural',
      'wiki.category.waste_management': 'Gestión de Residuos',
      'wiki.category.irrigation': 'Riego',
      'wiki.category.earthworks': 'Movimientos de Tierra',
      'wiki.category.diy': 'Hazlo Tú Mismo',
      'wiki.category.community': 'Comunidad',
      'wiki.category.subtropical_gardening': 'Jardinería Subtropical',
      'wiki.category.food_forests': 'Bosques Comestibles',

      // Time
      'wiki.time.today': 'Hoy',
      'wiki.time.yesterday': 'Ayer',
      'wiki.time.days_ago': 'días atrás',

      // Footer
      'wiki.footer.made_with': 'Hecho con',
      'wiki.footer.for': 'para la comunidad global de permacultura',
    },

    // ============ FRENCH (fr) ============
    fr: {
      'wiki.common.language_changed': 'Langue changée avec succès',
    },

    // ============ GERMAN (de) ============
    de: {
      'wiki.common.language_changed': 'Sprache erfolgreich geändert',
    },

    // ============ ITALIAN (it) ============
    it: {
      'wiki.common.language_changed': 'Lingua cambiata con successo',
    },

    // ============ DUTCH (nl) ============
    nl: {
      'wiki.common.language_changed': 'Taal succesvol gewijzigd',
    },

    // ============ POLISH (pl) ============
    pl: {
      'wiki.common.language_changed': 'Język zmieniony pomyślnie',
    },

    // ============ JAPANESE (ja) ============
    ja: {
      'wiki.common.language_changed': '言語が正常に変更されました',
    },

    // ============ CHINESE (zh) ============
    zh: {
      'wiki.common.language_changed': '语言更改成功',
    },

    // ============ KOREAN (ko) ============
    ko: {
      'wiki.common.language_changed': '언어가 성공적으로 변경되었습니다',
    },

    // ============ CZECH (cs) ============
    cs: {
      // Navigation
      'wiki.nav.logo': 'Komunitní Wiki',
      'wiki.nav.home': 'Domů',
      'wiki.nav.events': 'Události',
      'wiki.nav.locations': 'Lokality',
      'wiki.nav.login': 'Přihlásit se',
      'wiki.nav.create': 'Vytvořit stránku',

      // Home page
      'wiki.home.welcome': 'Vítejte v naší komunitní znalostní bázi',
      'wiki.home.subtitle': 'Sdílejte průvodce, lokality, události a zdroje s naší permakulturní komunitou',
      'wiki.home.search': 'Hledat průvodce, události, lokality...',
      'wiki.home.stats.guides': 'Průvodci',
      'wiki.home.stats.locations': 'Lokality',
      'wiki.home.stats.events': 'Nadcházející události',
      'wiki.home.stats.contributors': 'Přispěvatelé',
      'wiki.home.categories': 'Procházet podle kategorií',
      'wiki.home.recent_guides': 'Nedávné průvodce',
      'wiki.home.upcoming_events': 'Nadcházející události',
      'wiki.home.featured_locations': 'Doporučené lokality',
      'wiki.home.view_all': 'Zobrazit vše →',
      'wiki.home.contribute_title': 'Přispějte do našich komunitních znalostí',
      'wiki.home.contribute_subtitle': 'Sdílejte své zkušenosti, tipy a projekty permakulturní s komunitou. Každý příspěvek nám pomáhá růst!',
      'wiki.home.create_guide': 'Vytvořit průvodce',
      'wiki.home.add_event': 'Přidat událost',
      'wiki.home.add_location': 'Přidat lokalitu',

      // Common
      'wiki.common.loading': 'Načítání...',
      'wiki.common.error': 'Chyba',
      'wiki.common.success': 'Úspěch',
      'wiki.common.save': 'Uložit',
      'wiki.common.cancel': 'Zrušit',
      'wiki.common.edit': 'Upravit',
      'wiki.common.search': 'Hledat',
      'wiki.common.language_changed': 'Jazyk byl úspěšně změněn',

      // Categories
      'wiki.category.gardening': 'Zahradnictví',
      'wiki.category.water_management': 'Hospodaření s vodou',
      'wiki.category.composting': 'Kompostování',
      'wiki.category.renewable_energy': 'Obnovitelná energie',
      'wiki.category.food_production': 'Produkce potravin',
      'wiki.category.agroforestry': 'Agrolesnický systém',
      'wiki.category.natural_building': 'Přírodní stavebnictví',
      'wiki.category.waste_management': 'Nakládání s odpady',
      'wiki.category.irrigation': 'Zavlažování',
      'wiki.category.earthworks': 'Terénní úpravy',
      'wiki.category.diy': 'Kutilství',
      'wiki.category.community': 'Komunita',
    },

    // ============ SLOVAK (sk) ============
    sk: {
      // Navigation
      'wiki.nav.logo': 'Komunitná Wiki',
      'wiki.nav.home': 'Domov',
      'wiki.nav.events': 'Udalosti',
      'wiki.nav.locations': 'Lokality',
      'wiki.nav.login': 'Prihlásiť sa',
      'wiki.nav.create': 'Vytvoriť stránku',

      // Home page
      'wiki.home.welcome': 'Vitajte v našej komunitnej vedomostnej databáze',
      'wiki.home.subtitle': 'Zdieľajte príručky, lokality, udalosti a zdroje s naším permakultúrnym spoločenstvom',
      'wiki.home.search': 'Hľadať príručky, udalosti, lokality...',
      'wiki.home.stats.guides': 'Príručky',
      'wiki.home.stats.locations': 'Lokality',
      'wiki.home.stats.events': 'Nadchádzajúce udalosti',
      'wiki.home.stats.contributors': 'Prispievatelia',
      'wiki.home.categories': 'Prechádzať podľa kategórie',
      'wiki.home.recent_guides': 'Nedávne príručky',
      'wiki.home.upcoming_events': 'Nadchádzajúce udalosti',
      'wiki.home.featured_locations': 'Odporúčané lokality',
      'wiki.home.view_all': 'Zobraziť všetko →',
      'wiki.home.contribute_title': 'Prispejte do našich komunitných vedomostí',
      'wiki.home.contribute_subtitle': 'Zdieľajte svoje skúsenosti, tipy a projekty permakultúry so spoločenstvom. Každý príspevok nám pomáha rásť!',
      'wiki.home.create_guide': 'Vytvoriť príručku',
      'wiki.home.add_event': 'Pridať udalosť',
      'wiki.home.add_location': 'Pridať lokalitu',

      // Common
      'wiki.common.loading': 'Načítava sa...',
      'wiki.common.error': 'Chyba',
      'wiki.common.success': 'Úspech',
      'wiki.common.save': 'Uložiť',
      'wiki.common.cancel': 'Zrušiť',
      'wiki.common.edit': 'Upraviť',
      'wiki.common.search': 'Hľadať',
      'wiki.common.language_changed': 'Jazyk bol úspešne zmenený',

      // Categories
      'wiki.category.gardening': 'Záhradníctvo',
      'wiki.category.water_management': 'Hospodárenie s vodou',
      'wiki.category.composting': 'Kompostovanie',
      'wiki.category.renewable_energy': 'Obnoviteľná energia',
      'wiki.category.food_production': 'Produkcia potravín',
      'wiki.category.agroforestry': 'Agrolesnícky systém',
      'wiki.category.natural_building': 'Prírodné stavebníctvo',
      'wiki.category.waste_management': 'Nakladanie s odpadom',
      'wiki.category.irrigation': 'Zavlažovanie',
      'wiki.category.earthworks': 'Terénne úpravy',
      'wiki.category.diy': 'Urob si sám',
      'wiki.category.community': 'Komunita',
    },

    // ============ UKRAINIAN (uk) ============
    uk: {
      // Navigation
      'wiki.nav.logo': 'Спільнота Wiki',
      'wiki.nav.home': 'Головна',
      'wiki.nav.events': 'Події',
      'wiki.nav.locations': 'Локації',
      'wiki.nav.login': 'Увійти',
      'wiki.nav.create': 'Створити сторінку',

      // Home page
      'wiki.home.welcome': 'Ласкаво просимо до нашої спільної бази знань',
      'wiki.home.subtitle': 'Діліться посібниками, локаціями, подіями та ресурсами з нашою пермакультурною спільнотою',
      'wiki.home.search': 'Шукати посібники, події, локації...',
      'wiki.home.stats.guides': 'Посібники',
      'wiki.home.stats.locations': 'Локації',
      'wiki.home.stats.events': 'Майбутні події',
      'wiki.home.stats.contributors': 'Учасники',
      'wiki.home.categories': 'Переглядати за категоріями',
      'wiki.home.recent_guides': 'Останні посібники',
      'wiki.home.upcoming_events': 'Майбутні події',
      'wiki.home.featured_locations': 'Рекомендовані локації',
      'wiki.home.view_all': 'Переглянути всі →',
      'wiki.home.contribute_title': 'Долучіться до наших спільних знань',
      'wiki.home.contribute_subtitle': 'Діліться своїм досвідом, порадами та проєктами пермакультури зі спільнотою. Кожен внесок допомагає нам рости!',
      'wiki.home.create_guide': 'Створити посібник',
      'wiki.home.add_event': 'Додати подію',
      'wiki.home.add_location': 'Додати локацію',

      // Common
      'wiki.common.loading': 'Завантаження...',
      'wiki.common.error': 'Помилка',
      'wiki.common.success': 'Успіх',
      'wiki.common.save': 'Зберегти',
      'wiki.common.cancel': 'Скасувати',
      'wiki.common.edit': 'Редагувати',
      'wiki.common.search': 'Шукати',
      'wiki.common.language_changed': 'Мову успішно змінено',

      // Categories
      'wiki.category.gardening': 'Садівництво',
      'wiki.category.water_management': 'Управління водою',
      'wiki.category.composting': 'Компостування',
      'wiki.category.renewable_energy': 'Відновлювана енергія',
      'wiki.category.food_production': 'Виробництво їжі',
      'wiki.category.agroforestry': 'Агролісівництво',
      'wiki.category.natural_building': 'Природне будівництво',
      'wiki.category.waste_management': 'Управління відходами',
      'wiki.category.irrigation': 'Зрошення',
      'wiki.category.earthworks': 'Земляні роботи',
      'wiki.category.diy': 'Зроби сам',
      'wiki.category.community': 'Спільнота',
    },

    // ============ RUSSIAN (ru) ============
    ru: {
      // Navigation
      'wiki.nav.logo': 'Сообщество Wiki',
      'wiki.nav.home': 'Главная',
      'wiki.nav.events': 'События',
      'wiki.nav.locations': 'Локации',
      'wiki.nav.login': 'Войти',
      'wiki.nav.create': 'Создать страницу',

      // Home page
      'wiki.home.welcome': 'Добро пожаловать в нашу общую базу знаний',
      'wiki.home.subtitle': 'Делитесь руководствами, локациями, событиями и ресурсами с нашим пермакультурным сообществом',
      'wiki.home.search': 'Искать руководства, события, локации...',
      'wiki.home.stats.guides': 'Руководства',
      'wiki.home.stats.locations': 'Локации',
      'wiki.home.stats.events': 'Предстоящие события',
      'wiki.home.stats.contributors': 'Участники',
      'wiki.home.categories': 'Просмотр по категориям',
      'wiki.home.recent_guides': 'Недавние руководства',
      'wiki.home.upcoming_events': 'Предстоящие события',
      'wiki.home.featured_locations': 'Рекомендуемые локации',
      'wiki.home.view_all': 'Посмотреть все →',
      'wiki.home.contribute_title': 'Внесите вклад в наши общие знания',
      'wiki.home.contribute_subtitle': 'Делитесь своим опытом, советами и проектами пермакультуры с сообществом. Каждый вклад помогает нам расти!',
      'wiki.home.create_guide': 'Создать руководство',
      'wiki.home.add_event': 'Добавить событие',
      'wiki.home.add_location': 'Добавить локацию',

      // Common
      'wiki.common.loading': 'Загрузка...',
      'wiki.common.error': 'Ошибка',
      'wiki.common.success': 'Успех',
      'wiki.common.save': 'Сохранить',
      'wiki.common.cancel': 'Отменить',
      'wiki.common.edit': 'Редактировать',
      'wiki.common.search': 'Искать',
      'wiki.common.language_changed': 'Язык успешно изменён',

      // Categories
      'wiki.category.gardening': 'Садоводство',
      'wiki.category.water_management': 'Управление водой',
      'wiki.category.composting': 'Компостирование',
      'wiki.category.renewable_energy': 'Возобновляемая энергия',
      'wiki.category.food_production': 'Производство продуктов',
      'wiki.category.agroforestry': 'Агролесоводство',
      'wiki.category.natural_building': 'Природное строительство',
      'wiki.category.waste_management': 'Управление отходами',
      'wiki.category.irrigation': 'Орошение',
      'wiki.category.earthworks': 'Земляные работы',
      'wiki.category.diy': 'Сделай сам',
      'wiki.category.community': 'Сообщество',
    }
  },

  // Current language (defaults to browser or 'en')
  currentLanguage: 'en',

  // Debug mode for troubleshooting
  debugMode: true,

  // Initialize with browser language or fallback
  init() {
    const browserLang = (navigator.language || navigator.userLanguage).split('-')[0];
    const storedLang = localStorage.getItem('wiki_language');

    this.currentLanguage = storedLang ||
      (this.translations[browserLang] ? browserLang : 'en');

    if (this.debugMode) {
      console.log('🌐 i18n Init:', {
        browserLang,
        storedLang,
        currentLanguage: this.currentLanguage,
        availableLanguages: this.getLanguages(),
        totalTranslations: Object.keys(this.translations[this.currentLanguage] || {}).length
      });
    }

    return this.currentLanguage;
  },

  // Get translation for a key
  t(key, lang = null) {
    const language = lang || this.currentLanguage;
    const hasTranslation = this.translations[language]?.[key];
    const translation = hasTranslation ||
                       this.translations['en']?.[key] ||
                       key;

    if (this.debugMode && !hasTranslation) {
      console.warn(`⚠️ Missing translation for "${key}" in language "${language}"`);
    }

    return translation;
  },

  // Set language
  setLanguage(lang) {
    if (this.translations[lang]) {
      const previousLang = this.currentLanguage;
      this.currentLanguage = lang;
      localStorage.setItem('wiki_language', lang);

      if (this.debugMode) {
        console.log('✅ Language changed:', {
          from: previousLang,
          to: lang,
          totalKeys: Object.keys(this.translations[lang]).length
        });
      }

      return true;
    }

    if (this.debugMode) {
      console.error(`❌ Language "${lang}" not available`);
    }
    return false;
  },

  // Get current language
  getLanguage() {
    return this.currentLanguage;
  },

  // Get all available languages
  getLanguages() {
    return Object.keys(this.translations).filter(
      lang => Object.keys(this.translations[lang]).length > 0
    );
  }
};

// Make available globally for wiki.js
if (typeof window !== 'undefined') {
  window.wikiI18n = wikiI18n;
}

// Export for module systems (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { wikiI18n };
}
