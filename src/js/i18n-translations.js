/**
 * Permaculture Network - i18n Translation System
 * 
 * This file contains all user-facing text as translation strings.
 * Each string has a unique key that maps to translations in different languages.
 * 
 * Structure:
 * {
 *   "namespace.key": "Translation string"
 * }
 * 
 * Usage in code:
 * i18n.t('auth.login_welcome')  // Returns translated string
 * 
 * Adding new languages:
 * 1. Add new language object below (e.g., 'es' for Spanish)
 * 2. Translate all keys to that language
 * 3. Update language selector in UI
 * 4. Save user's preference to localStorage
 */

const i18n = {
  // ============ SUPPORTED LANGUAGES ============
  supportedLanguages: {
    'en': { name: 'English', nativeName: 'English', flag: '🇬🇧' },
    'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    'cs': { name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
    'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    'de': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    'it': { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    'nl': { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    'pl': { name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    'ja': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    'zh': { name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
    'ko': { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' }
  },

  // ============ DEFAULT LANGUAGE ============
  defaultLanguage: 'en',
  currentLanguage: 'en',

  // ============ TRANSLATIONS ============
  translations: {
    en: {
      // ============ SPLASH SCREEN ============
      'splash.title': 'Permaculture Network',
      'splash.subtitle': 'Growing connections for sustainable living',
      'splash.loading': 'Connecting the global permaculture community...',

      // ============ AUTHENTICATION - GENERAL ============
      'auth.logo': '🌿',
      'auth.logo_splash': '🌱',

      // ============ LOGIN ============
      'auth.login_welcome': 'Welcome Back',
      'auth.login_subtitle': 'Sign in to your account',
      'auth.magic_link': 'Magic Link',
      'auth.password': 'Password',
      'auth.email': 'Email Address',
      'auth.email_placeholder': 'you@example.com',
      'auth.send_magic_link': 'Send Magic Link',
      'auth.sign_in': 'Sign In',
      'auth.forgot_password': 'Forgot your password?',
      'auth.no_account': 'Don\'t have an account?',
      'auth.create_one': 'Create one',

      // ============ REGISTRATION ============
      'auth.register_join': 'Join Us',
      'auth.register_create': 'Create your account',
      'auth.password_label': 'Password',
      'auth.password_placeholder': 'Min. 6 characters',
      'auth.password_hint': 'Use a strong password with mix of letters and numbers',
      'auth.confirm_password': 'Confirm Password',
      'auth.confirm_password_placeholder': 'Confirm password',
      'auth.terms_agreement': 'I agree to the Terms of Service and Privacy Policy',
      'auth.create_account': 'Create Account',
      'auth.have_account': 'Already have an account?',
      'auth.sign_in_link': 'Sign in',

      // ============ PASSWORD RESET ============
      'auth.reset_title': 'Reset Password',
      'auth.reset_subtitle': 'We\'ll send you a link to reset it',
      'auth.send_reset_link': 'Send Reset Link',
      'auth.back_to_login': 'Back to login',

      // ============ NEW PASSWORD ============
      'auth.new_password_title': 'Create New Password',
      'auth.new_password_subtitle': 'Enter your new password',
      'auth.new_password_label': 'New Password',
      'auth.new_password_placeholder': 'Min. 6 characters',
      'auth.new_confirm_password': 'Confirm Password',
      'auth.update_password': 'Update Password',

      // ============ PROFILE COMPLETION ============
      'auth.profile_title': 'Complete Your Profile',
      'auth.profile_subtitle': 'Help us get to know you',
      'auth.basic_info': 'Basic Information',
      'auth.full_name': 'Full Name',
      'auth.full_name_placeholder': 'Your name',
      'auth.location': 'Location',
      'auth.location_placeholder': 'City, Region',
      'auth.bio': 'Bio',
      'auth.bio_placeholder': 'Tell us about yourself and your interests...',
      'auth.skills_interests': 'Skills & Interests',
      'auth.skills': 'Skills',
      'auth.skills_placeholder': 'Add skills (press Enter)',
      'auth.skills_hint': 'E.g., Permaculture Design, Seed Saving, Composting',
      'auth.interests': 'Interests',
      'auth.interests_placeholder': 'Add interests (press Enter)',
      'auth.interests_hint': 'E.g., Agroforestry, Water Systems, Community Building',
      'auth.looking_for': 'What are you looking for?',
      'auth.looking_for_placeholder': 'Add what you\'re seeking (press Enter)',
      'auth.looking_for_hint': 'E.g., Collaboration, Mentorship, Learning, Employment',
      'auth.visibility': 'Visibility',
      'auth.public_profile': 'Make my profile public so others can find me',
      'auth.complete_profile': 'Complete Profile',
      'auth.skip_for_now': 'Skip for now',

      // ============ MAGIC LINK ============
      'auth.check_email': 'Check Your Email',
      'auth.magic_link_sent': 'We\'ve sent a magic link to sign in',
      'auth.magic_link_instructions': 'Click the link in your email to sign in. The link expires in 24 hours.',
      'auth.didnt_receive': 'Didn\'t receive the email?',
      'auth.resend_link': 'Resend Link',

      // ============ SUCCESS ============
      'auth.success': 'Welcome!',
      'auth.account_ready': 'Your account is ready',
      'auth.redirecting': 'You\'re all set. Redirecting to your dashboard...',

      // ============ ALERTS & MESSAGES ============
      'alert.success': 'Success!',
      'alert.error': 'Error',
      'alert.info': 'Information',
      'alert.magic_link_sent': 'Magic link sent! Check your email.',
      'alert.account_created': 'Account created! Completing your profile...',
      'alert.passwords_match': 'Passwords do not match',
      'alert.password_short': 'Password must be at least 6 characters',
      'alert.reset_link_sent': 'Reset link sent! Check your email.',
      'alert.password_updated': 'Password updated successfully!',
      'alert.profile_completed': 'Profile completed! Redirecting...',
      'alert.signing_in': 'Signing in...',
      'alert.link_resent': 'Link resent! Check your email.',
      'alert.invalid_credentials': 'Invalid email or password',

      // ============ FORM VALIDATION ============
      'validation.required': 'This field is required',
      'validation.invalid_email': 'Please enter a valid email address',
      'validation.password_too_short': 'Password must be at least 6 characters',
      'validation.passwords_dont_match': 'Passwords do not match',
      'validation.fill_all_fields': 'Please fill in all required fields',

      // ============ BUTTONS & ACTIONS ============
      'btn.submit': 'Submit',
      'btn.cancel': 'Cancel',
      'btn.save': 'Save',
      'btn.delete': 'Delete',
      'btn.edit': 'Edit',
      'btn.back': 'Back',
      'btn.next': 'Next',
      'btn.previous': 'Previous',
      'btn.logout': 'Log Out',
      'btn.close': 'Close',
      'btn.continue': 'Continue',

      // ============ LEGAL & FOOTER ============
      'legal.privacy_policy': 'Privacy Policy',
      'legal.terms_service': 'Terms of Service',
      'legal.cookie_policy': 'Cookie Policy',
      'legal.contact': 'Contact Us',
      'legal.copyright': '© 2025 Permaculture Network. All rights reserved.',
      'legal.agree_terms': 'By registering, you agree to our Terms of Service and Privacy Policy',

      // ============ LANGUAGE SELECTOR ============
      'lang.select': 'Select Language',
      'lang.current': 'Current Language',
      'lang.change': 'Change Language',

      // ============ COMMON TERMS ============
      'common.email': 'Email',
      'common.password': 'Password',
      'common.name': 'Name',
      'common.location': 'Location',
      'common.bio': 'Bio',
      'common.skills': 'Skills',
      'common.interests': 'Interests',
      'common.projects': 'Projects',
      'common.resources': 'Resources',
      'common.community': 'Community',
      'common.dashboard': 'Dashboard',
      'common.settings': 'Settings',
      'common.profile': 'Profile',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.success': 'Success!',

      // ============ ACCESSIBILITY ============
      'a11y.skip_to_content': 'Skip to main content',
      'a11y.close_menu': 'Close menu',
      'a11y.open_menu': 'Open menu',
      'a11y.loading': 'Loading',
      'a11y.required_field': 'Required field',
    },

    pt: {
      // ============ SPLASH SCREEN ============
      'splash.title': 'Rede Permacultura',
      'splash.subtitle': 'Crescendo conexões para viver de forma sustentável',
      'splash.loading': 'Conectando a comunidade global de permacultura...',

      // ============ AUTHENTICATION - GENERAL ============
      'auth.logo': '🌿',
      'auth.logo_splash': '🌱',

      // ============ LOGIN ============
      'auth.login_welcome': 'Bem-vindo de volta',
      'auth.login_subtitle': 'Entre na sua conta',
      'auth.magic_link': 'Link Mágico',
      'auth.password': 'Senha',
      'auth.email': 'Endereço de Email',
      'auth.email_placeholder': 'voce@exemplo.com',
      'auth.send_magic_link': 'Enviar Link Mágico',
      'auth.sign_in': 'Entrar',
      'auth.forgot_password': 'Esqueceu sua senha?',
      'auth.no_account': 'Não tem uma conta?',
      'auth.create_one': 'Crie uma',

      // ============ REGISTRATION ============
      'auth.register_join': 'Junte-se a Nós',
      'auth.register_create': 'Crie sua conta',
      'auth.password_label': 'Senha',
      'auth.password_placeholder': 'Mín. 6 caracteres',
      'auth.password_hint': 'Use uma senha forte com letras e números',
      'auth.confirm_password': 'Confirme a Senha',
      'auth.confirm_password_placeholder': 'Confirme sua senha',
      'auth.terms_agreement': 'Concordo com os Termos de Serviço e Política de Privacidade',
      'auth.create_account': 'Criar Conta',
      'auth.have_account': 'Já tem uma conta?',
      'auth.sign_in_link': 'Entre aqui',

      // ============ PASSWORD RESET ============
      'auth.reset_title': 'Redefinir Senha',
      'auth.reset_subtitle': 'Enviaremos um link para redefinir',
      'auth.send_reset_link': 'Enviar Link de Redefinição',
      'auth.back_to_login': 'Voltar para login',

      // ============ NEW PASSWORD ============
      'auth.new_password_title': 'Criar Nova Senha',
      'auth.new_password_subtitle': 'Digite sua nova senha',
      'auth.new_password_label': 'Nova Senha',
      'auth.new_password_placeholder': 'Mín. 6 caracteres',
      'auth.new_confirm_password': 'Confirme a Senha',
      'auth.update_password': 'Atualizar Senha',

      // ============ PROFILE COMPLETION ============
      'auth.profile_title': 'Conclua Seu Perfil',
      'auth.profile_subtitle': 'Nos ajude a conhecê-lo',
      'auth.basic_info': 'Informações Básicas',
      'auth.full_name': 'Nome Completo',
      'auth.full_name_placeholder': 'Seu nome',
      'auth.location': 'Localização',
      'auth.location_placeholder': 'Cidade, Região',
      'auth.bio': 'Bio',
      'auth.bio_placeholder': 'Fale-nos sobre você e seus interesses...',
      'auth.skills_interests': 'Habilidades & Interesses',
      'auth.skills': 'Habilidades',
      'auth.skills_placeholder': 'Adicione habilidades (pressione Enter)',
      'auth.skills_hint': 'Ex., Design de Permacultura, Salvação de Sementes, Compostagem',
      'auth.interests': 'Interesses',
      'auth.interests_placeholder': 'Adicione interesses (pressione Enter)',
      'auth.interests_hint': 'Ex., Agrofloresta, Sistemas de Água, Construção Comunitária',
      'auth.looking_for': 'O que você está procurando?',
      'auth.looking_for_placeholder': 'Adicione o que você procura (pressione Enter)',
      'auth.looking_for_hint': 'Ex., Colaboração, Mentoria, Aprendizado, Emprego',
      'auth.visibility': 'Visibilidade',
      'auth.public_profile': 'Tornar meu perfil público para que outros me encontrem',
      'auth.complete_profile': 'Concluir Perfil',
      'auth.skip_for_now': 'Pular por enquanto',

      // ============ MAGIC LINK ============
      'auth.check_email': 'Verifique Seu Email',
      'auth.magic_link_sent': 'Enviamos um link mágico para entrar',
      'auth.magic_link_instructions': 'Clique no link em seu email para entrar. O link expira em 24 horas.',
      'auth.didnt_receive': 'Não recebeu o email?',
      'auth.resend_link': 'Reenviar Link',

      // ============ SUCCESS ============
      'auth.success': 'Bem-vindo!',
      'auth.account_ready': 'Sua conta está pronta',
      'auth.redirecting': 'Tudo pronto. Redirecionando para seu painel...',

      // ============ ALERTS & MESSAGES ============
      'alert.success': 'Sucesso!',
      'alert.error': 'Erro',
      'alert.info': 'Informação',
      'alert.magic_link_sent': 'Link mágico enviado! Verifique seu email.',
      'alert.account_created': 'Conta criada! Completando seu perfil...',
      'alert.passwords_match': 'As senhas não correspondem',
      'alert.password_short': 'A senha deve ter pelo menos 6 caracteres',
      'alert.reset_link_sent': 'Link de redefinição enviado! Verifique seu email.',
      'alert.password_updated': 'Senha atualizada com sucesso!',
      'alert.profile_completed': 'Perfil concluído! Redirecionando...',
      'alert.signing_in': 'Entrando...',
      'alert.link_resent': 'Link reenviado! Verifique seu email.',
      'alert.invalid_credentials': 'Email ou senha inválido',

      // ============ FORM VALIDATION ============
      'validation.required': 'Este campo é obrigatório',
      'validation.invalid_email': 'Digite um endereço de email válido',
      'validation.password_too_short': 'A senha deve ter pelo menos 6 caracteres',
      'validation.passwords_dont_match': 'As senhas não correspondem',
      'validation.fill_all_fields': 'Preencha todos os campos obrigatórios',

      // ============ BUTTONS & ACTIONS ============
      'btn.submit': 'Enviar',
      'btn.cancel': 'Cancelar',
      'btn.save': 'Salvar',
      'btn.delete': 'Deletar',
      'btn.edit': 'Editar',
      'btn.back': 'Voltar',
      'btn.next': 'Próximo',
      'btn.previous': 'Anterior',
      'btn.logout': 'Sair',
      'btn.close': 'Fechar',
      'btn.continue': 'Continuar',

      // ============ LEGAL & FOOTER ============
      'legal.privacy_policy': 'Política de Privacidade',
      'legal.terms_service': 'Termos de Serviço',
      'legal.cookie_policy': 'Política de Cookies',
      'legal.contact': 'Contate-nos',
      'legal.copyright': '© 2025 Rede Permacultura. Todos os direitos reservados.',
      'legal.agree_terms': 'Ao registrar, você concorda com nossos Termos de Serviço e Política de Privacidade',

      // ============ LANGUAGE SELECTOR ============
      'lang.select': 'Selecione o Idioma',
      'lang.current': 'Idioma Atual',
      'lang.change': 'Mudar Idioma',

      // ============ COMMON TERMS ============
      'common.email': 'Email',
      'common.password': 'Senha',
      'common.name': 'Nome',
      'common.location': 'Localização',
      'common.bio': 'Bio',
      'common.skills': 'Habilidades',
      'common.interests': 'Interesses',
      'common.projects': 'Projetos',
      'common.resources': 'Recursos',
      'common.community': 'Comunidade',
      'common.dashboard': 'Painel',
      'common.settings': 'Configurações',
      'common.profile': 'Perfil',
      'common.search': 'Pesquisar',
      'common.filter': 'Filtro',
      'common.loading': 'Carregando...',
      'common.error': 'Ocorreu um erro',
      'common.success': 'Sucesso!',

      // ============ ACCESSIBILITY ============
      'a11y.skip_to_content': 'Ir para conteúdo principal',
      'a11y.close_menu': 'Fechar menu',
      'a11y.open_menu': 'Abrir menu',
      'a11y.loading': 'Carregando',
      'a11y.required_field': 'Campo obrigatório',
    },

    es: {
      // ============ SPLASH SCREEN ============
      'splash.title': 'Red de Permacultura',
      'splash.subtitle': 'Creciendo conexiones para una vida sostenible',
      'splash.loading': 'Conectando la comunidad global de permacultura...',

      // ============ AUTHENTICATION - GENERAL ============
      'auth.logo': '🌿',
      'auth.logo_splash': '🌱',

      // ============ LOGIN ============
      'auth.login_welcome': 'Bienvenido de vuelta',
      'auth.login_subtitle': 'Inicia sesión en tu cuenta',
      'auth.magic_link': 'Enlace Mágico',
      'auth.password': 'Contraseña',
      'auth.email': 'Dirección de Correo',
      'auth.email_placeholder': 'tu@ejemplo.com',
      'auth.send_magic_link': 'Enviar Enlace Mágico',
      'auth.sign_in': 'Iniciar Sesión',
      'auth.forgot_password': '¿Olvidaste tu contraseña?',
      'auth.no_account': '¿No tienes cuenta?',
      'auth.create_one': 'Crear una',

      // ============ REGISTRATION ============
      'auth.register_join': 'Únete a Nosotros',
      'auth.register_create': 'Crea tu cuenta',
      'auth.password_label': 'Contraseña',
      'auth.password_placeholder': 'Mín. 6 caracteres',
      'auth.password_hint': 'Usa una contraseña fuerte con letras y números',
      'auth.confirm_password': 'Confirmar Contraseña',
      'auth.confirm_password_placeholder': 'Confirma tu contraseña',
      'auth.terms_agreement': 'Acepto los Términos de Servicio y la Política de Privacidad',
      'auth.create_account': 'Crear Cuenta',
      'auth.have_account': '¿Ya tienes una cuenta?',
      'auth.sign_in_link': 'Inicia sesión',

      // ============ PASSWORD RESET ============
      'auth.reset_title': 'Restablecer Contraseña',
      'auth.reset_subtitle': 'Te enviaremos un enlace para restablecerla',
      'auth.send_reset_link': 'Enviar Enlace de Restablecimiento',
      'auth.back_to_login': 'Volver a iniciar sesión',

      // ============ NEW PASSWORD ============
      'auth.new_password_title': 'Crear Nueva Contraseña',
      'auth.new_password_subtitle': 'Ingresa tu nueva contraseña',
      'auth.new_password_label': 'Nueva Contraseña',
      'auth.new_password_placeholder': 'Mín. 6 caracteres',
      'auth.new_confirm_password': 'Confirmar Contraseña',
      'auth.update_password': 'Actualizar Contraseña',

      // ============ PROFILE COMPLETION ============
      'auth.profile_title': 'Completa Tu Perfil',
      'auth.profile_subtitle': 'Ayúdanos a conocerte',
      'auth.basic_info': 'Información Básica',
      'auth.full_name': 'Nombre Completo',
      'auth.full_name_placeholder': 'Tu nombre',
      'auth.location': 'Ubicación',
      'auth.location_placeholder': 'Ciudad, Región',
      'auth.bio': 'Biografía',
      'auth.bio_placeholder': 'Cuéntanos sobre ti e tus intereses...',
      'auth.skills_interests': 'Habilidades e Intereses',
      'auth.skills': 'Habilidades',
      'auth.skills_placeholder': 'Añade habilidades (presiona Enter)',
      'auth.skills_hint': 'Ej., Diseño de Permacultura, Conservación de Semillas, Compostaje',
      'auth.interests': 'Intereses',
      'auth.interests_placeholder': 'Añade intereses (presiona Enter)',
      'auth.interests_hint': 'Ej., Agroforestería, Sistemas de Agua, Construcción Comunitaria',
      'auth.looking_for': '¿Qué estás buscando?',
      'auth.looking_for_placeholder': 'Añade lo que buscas (presiona Enter)',
      'auth.looking_for_hint': 'Ej., Colaboración, Mentoría, Aprendizaje, Empleo',
      'auth.visibility': 'Visibilidad',
      'auth.public_profile': 'Hacer mi perfil público para que otros me encuentren',
      'auth.complete_profile': 'Completar Perfil',
      'auth.skip_for_now': 'Saltar por ahora',

      // ============ MAGIC LINK ============
      'auth.check_email': 'Verifica Tu Correo',
      'auth.magic_link_sent': 'Hemos enviado un enlace mágico para iniciar sesión',
      'auth.magic_link_instructions': 'Haz clic en el enlace en tu correo para iniciar sesión. El enlace expira en 24 horas.',
      'auth.didnt_receive': '¿No recibiste el correo?',
      'auth.resend_link': 'Reenviar Enlace',

      // ============ SUCCESS ============
      'auth.success': '¡Bienvenido!',
      'auth.account_ready': 'Tu cuenta está lista',
      'auth.redirecting': 'Todo listo. Redirigiendo a tu panel...',

      // ============ ALERTS & MESSAGES ============
      'alert.success': '¡Éxito!',
      'alert.error': 'Error',
      'alert.info': 'Información',
      'alert.magic_link_sent': '¡Enlace mágico enviado! Verifica tu correo.',
      'alert.account_created': '¡Cuenta creada! Completando tu perfil...',
      'alert.passwords_match': 'Las contraseñas no coinciden',
      'alert.password_short': 'La contraseña debe tener al menos 6 caracteres',
      'alert.reset_link_sent': '¡Enlace de restablecimiento enviado! Verifica tu correo.',
      'alert.password_updated': '¡Contraseña actualizada exitosamente!',
      'alert.profile_completed': '¡Perfil completado! Redirigiendo...',
      'alert.signing_in': 'Iniciando sesión...',
      'alert.link_resent': '¡Enlace reenviado! Verifica tu correo.',
      'alert.invalid_credentials': 'Correo o contraseña inválidos',

      // ============ FORM VALIDATION ============
      'validation.required': 'Este campo es obligatorio',
      'validation.invalid_email': 'Por favor ingresa un correo válido',
      'validation.password_too_short': 'La contraseña debe tener al menos 6 caracteres',
      'validation.passwords_dont_match': 'Las contraseñas no coinciden',
      'validation.fill_all_fields': 'Por favor completa todos los campos obligatorios',

      // ============ BUTTONS & ACTIONS ============
      'btn.submit': 'Enviar',
      'btn.cancel': 'Cancelar',
      'btn.save': 'Guardar',
      'btn.delete': 'Eliminar',
      'btn.edit': 'Editar',
      'btn.back': 'Atrás',
      'btn.next': 'Siguiente',
      'btn.previous': 'Anterior',
      'btn.logout': 'Cerrar Sesión',
      'btn.close': 'Cerrar',
      'btn.continue': 'Continuar',

      // ============ LEGAL & FOOTER ============
      'legal.privacy_policy': 'Política de Privacidad',
      'legal.terms_service': 'Términos de Servicio',
      'legal.cookie_policy': 'Política de Cookies',
      'legal.contact': 'Contáctanos',
      'legal.copyright': '© 2025 Red de Permacultura. Todos los derechos reservados.',
      'legal.agree_terms': 'Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad',

      // ============ LANGUAGE SELECTOR ============
      'lang.select': 'Selecciona Idioma',
      'lang.current': 'Idioma Actual',
      'lang.change': 'Cambiar Idioma',

      // ============ COMMON TERMS ============
      'common.email': 'Correo',
      'common.password': 'Contraseña',
      'common.name': 'Nombre',
      'common.location': 'Ubicación',
      'common.bio': 'Biografía',
      'common.skills': 'Habilidades',
      'common.interests': 'Intereses',
      'common.projects': 'Proyectos',
      'common.resources': 'Recursos',
      'common.community': 'Comunidad',
      'common.dashboard': 'Panel',
      'common.settings': 'Configuración',
      'common.profile': 'Perfil',
      'common.search': 'Buscar',
      'common.filter': 'Filtro',
      'common.loading': 'Cargando...',
      'common.error': 'Ocurrió un error',
      'common.success': '¡Éxito!',

      // ============ ACCESSIBILITY ============
      'a11y.skip_to_content': 'Ir al contenido principal',
      'a11y.close_menu': 'Cerrar menú',
      'a11y.open_menu': 'Abrir menú',
      'a11y.loading': 'Cargando',
      'a11y.required_field': 'Campo obligatorio',
    },

    // ============ CZECH (cs) ============
    cs: {
      // ============ SPLASH SCREEN ============
      'splash.title': 'Síť permakulturních komunit',
      'splash.subtitle': 'Budujeme propojení pro udržitelné životní prostředí',
      'splash.loading': 'Připojujeme se ke globální permakulturní komunitě...',

      // ============ AUTHENTICATION - GENERAL ============
      'auth.logo': '🌿',
      'auth.logo_splash': '🌱',

      // ============ LOGIN ============
      'auth.login_welcome': 'Vítejte zpět',
      'auth.login_subtitle': 'Přihlaste se ke svému účtu',
      'auth.magic_link': 'Magický odkaz',
      'auth.password': 'Heslo',
      'auth.email': 'E-mailová adresa',
      'auth.email_placeholder': 'vas@email.cz',
      'auth.send_magic_link': 'Odeslat magický odkaz',
      'auth.sign_in': 'Přihlásit se',
      'auth.forgot_password': 'Zapomněli jste heslo?',
      'auth.no_account': 'Nemáte účet?',
      'auth.create_one': 'Vytvořte si ho',

      // ============ REGISTRATION ============
      'auth.register_join': 'Připojte se k nám',
      'auth.register_create': 'Vytvořte si svůj účet',
      'auth.password_label': 'Heslo',
      'auth.password_placeholder': 'Minimálně 6 znaků',
      'auth.password_hint': 'Použijte silné heslo obsahující písmena a čísla',
      'auth.confirm_password': 'Potvrdit heslo',
      'auth.confirm_password_placeholder': 'Potvrďte heslo',
      'auth.terms_agreement': 'Souhlasím s podmínkami použití a zásadami ochrany osobních údajů',
      'auth.create_account': 'Vytvořit účet',
      'auth.have_account': 'Již máte účet?',
      'auth.sign_in_link': 'Přihlásit se',

      // ============ PASSWORD RESET ============
      'auth.reset_title': 'Obnovit heslo',
      'auth.reset_subtitle': 'Zašleme vám odkaz pro obnovení hesla',
      'auth.send_reset_link': 'Odeslat odkaz pro obnovení',
      'auth.back_to_login': 'Zpět na přihlášení',

      // ============ NEW PASSWORD ============
      'auth.new_password_title': 'Vytvořit nové heslo',
      'auth.new_password_subtitle': 'Zadejte své nové heslo',
      'auth.new_password_label': 'Nové heslo',
      'auth.new_password_placeholder': 'Minimálně 6 znaků',
      'auth.new_confirm_password': 'Potvrdit heslo',
      'auth.update_password': 'Aktualizovat heslo',

      // ============ PROFILE COMPLETION ============
      'auth.profile_title': 'Dokončete svůj profil',
      'auth.profile_subtitle': 'Pomozte nám vás poznat',
      'auth.basic_info': 'Základní informace',
      'auth.full_name': 'Celé jméno',
      'auth.full_name_placeholder': 'Vaše jméno',
      'auth.location': 'Umístění',
      'auth.location_placeholder': 'Město, region',
      'auth.bio': 'O mně',
      'auth.bio_placeholder': 'Řekněte nám o sobě a svých zájmech...',
      'auth.skills_interests': 'Dovednosti a zájmy',
      'auth.skills': 'Dovednosti',
      'auth.skills_placeholder': 'Přidat dovednosti (stiskněte Enter)',
      'auth.skills_hint': 'Např. Permakulturní design, Uchovávání semen, Kompostování',
      'auth.interests': 'Zájmy',
      'auth.interests_placeholder': 'Přidat zájmy (stiskněte Enter)',
      'auth.interests_hint': 'Např. Agrolesnictví, Vodní systémy, Budování komunity',
      'auth.looking_for': 'Co hledáte?',
      'auth.looking_for_placeholder': 'Přidat, co hledáte (stiskněte Enter)',
      'auth.looking_for_hint': 'Např. Spolupráce, Mentorství, Vzdělávání, Zaměstnání',
      'auth.visibility': 'Viditelnost',
      'auth.public_profile': 'Zveřejnit můj profil, aby mě ostatní mohli najít',
      'auth.complete_profile': 'Dokončit profil',
      'auth.skip_for_now': 'Přeskočit prozatím',

      // ============ MAGIC LINK ============
      'auth.check_email': 'Zkontrolujte svůj e-mail',
      'auth.magic_link_sent': 'Odeslali jsme vám magický odkaz pro přihlášení',
      'auth.magic_link_instructions': 'Klikněte na odkaz v e-mailu pro přihlášení. Odkaz platí 24 hodin.',
      'auth.didnt_receive': 'Neobdrželi jste e-mail?',
      'auth.resend_link': 'Odeslat znovu',

      // ============ SUCCESS ============
      'auth.success': 'Vítejte!',
      'auth.account_ready': 'Váš účet je připraven',
      'auth.redirecting': 'Vše je připraveno. Přesměrováváme vás na nástěnku...',

      // ============ ALERTS & MESSAGES ============
      'alert.success': 'Úspěch!',
      'alert.error': 'Chyba',
      'alert.info': 'Informace',
      'alert.magic_link_sent': 'Magický odkaz odeslán! Zkontrolujte svůj e-mail.',
      'alert.account_created': 'Účet vytvořen! Dokončujeme váš profil...',
      'alert.passwords_match': 'Hesla se neshodují',
      'alert.password_short': 'Heslo musí mít alespoň 6 znaků',
      'alert.reset_link_sent': 'Odkaz pro obnovení odeslán! Zkontrolujte svůj e-mail.',
      'alert.password_updated': 'Heslo bylo úspěšně aktualizováno!',
      'alert.profile_completed': 'Profil dokončen! Přesměrováváme...',
      'alert.signing_in': 'Přihlašování...',
      'alert.link_resent': 'Odkaz odeslán znovu! Zkontrolujte svůj e-mail.',
      'alert.invalid_credentials': 'Neplatný e-mail nebo heslo',

      // ============ FORM VALIDATION ============
      'validation.required': 'Toto pole je povinné',
      'validation.invalid_email': 'Zadejte platnou e-mailovou adresu',
      'validation.password_too_short': 'Heslo musí mít alespoň 6 znaků',
      'validation.passwords_dont_match': 'Hesla se neshodují',
      'validation.fill_all_fields': 'Vyplňte všechna povinná pole',

      // ============ BUTTONS & ACTIONS ============
      'btn.submit': 'Odeslat',
      'btn.cancel': 'Zrušit',
      'btn.save': 'Uložit',
      'btn.delete': 'Smazat',
      'btn.edit': 'Upravit',
      'btn.back': 'Zpět',
      'btn.next': 'Další',
      'btn.previous': 'Předchozí',
      'btn.logout': 'Odhlásit se',
      'btn.close': 'Zavřít',
      'btn.continue': 'Pokračovat',

      // ============ LEGAL & FOOTER ============
      'legal.privacy_policy': 'Zásady ochrany osobních údajů',
      'legal.terms_service': 'Podmínky použití',
      'legal.cookie_policy': 'Zásady používání cookies',
      'legal.contact': 'Kontaktujte nás',
      'legal.copyright': '© 2025 Síť permakulturních komunit. Všechna práva vyhrazena.',
      'legal.agree_terms': 'Registrací souhlasíte s našimi podmínkami použití a zásadami ochrany osobních údajů',

      // ============ LANGUAGE SELECTOR ============
      'lang.select': 'Vybrat jazyk',
      'lang.current': 'Aktuální jazyk',
      'lang.change': 'Změnit jazyk',

      // ============ COMMON TERMS ============
      'common.email': 'E-mail',
      'common.password': 'Heslo',
      'common.name': 'Jméno',
      'common.location': 'Umístění',
      'common.bio': 'O mně',
      'common.skills': 'Dovednosti',
      'common.interests': 'Zájmy',
      'common.projects': 'Projekty',
      'common.resources': 'Zdroje',
      'common.community': 'Komunita',
      'common.dashboard': 'Nástěnka',
      'common.settings': 'Nastavení',
      'common.profile': 'Profil',
      'common.search': 'Hledat',
      'common.filter': 'Filtrovat',
      'common.loading': 'Načítání...',
      'common.error': 'Vyskytla se chyba',
      'common.success': 'Úspěch!',

      // ============ ACCESSIBILITY ============
      'a11y.skip_to_content': 'Přeskočit na hlavní obsah',
      'a11y.close_menu': 'Zavřít menu',
      'a11y.open_menu': 'Otevřít menu',
      'a11y.loading': 'Načítání',
      'a11y.required_field': 'Povinné pole',
    },

    // Add more languages here following the same pattern...
    // fr, de, it, nl, pl, ja, zh, ko, etc.
  },

  // ============ i18n METHODS ============

  /**
   * Translate a key to the current language
   * @param {string} key - Translation key (e.g., 'auth.login_welcome')
   * @param {object} params - Optional parameters for substitution
   * @returns {string} Translated string
   */
  t(key, params = {}) {
    let translation = this.translations[this.currentLanguage]?.[key] 
      || this.translations[this.defaultLanguage]?.[key]
      || key; // Fallback to key if not found

    // Simple parameter substitution: {paramName} replaced with value
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });

    return translation;
  },

  /**
   * Set the current language
   * @param {string} lang - Language code (e.g., 'en', 'pt', 'es')
   */
  setLanguage(lang) {
    if (this.supportedLanguages[lang]) {
      this.currentLanguage = lang;
      // Save to localStorage so preference persists
      localStorage.setItem('permaculture_language', lang);
      // Update HTML lang attribute
      document.documentElement.lang = lang;
      // Dispatch event so UI can update
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
      return true;
    }
    return false;
  },

  /**
   * Get the current language
   * @returns {string} Current language code
   */
  getLanguage() {
    return this.currentLanguage;
  },

  /**
   * Get all supported languages
   * @returns {object} Supported languages object
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  },

  /**
   * Initialize i18n system
   * - Load user's preferred language from localStorage
   * - Fallback to browser language
   * - Fallback to default language
   */
  init() {
    // Check localStorage
    const savedLang = localStorage.getItem('permaculture_language');
    if (savedLang && this.supportedLanguages[savedLang]) {
      this.setLanguage(savedLang);
      return;
    }

    // Check browser language
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && this.supportedLanguages[browserLang]) {
      this.setLanguage(browserLang);
      return;
    }

    // Use default
    this.setLanguage(this.defaultLanguage);
  },

  /**
   * Get all translations for current language
   * @returns {object} All translated strings
   */
  getAllTranslations() {
    return this.translations[this.currentLanguage];
  },

  /**
   * Check if language is supported
   * @param {string} lang - Language code
   * @returns {boolean}
   */
  isLanguageSupported(lang) {
    return !!this.supportedLanguages[lang];
  }
};

// ============ AUTO-INITIALIZATION ============
// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}

// ============ USAGE EXAMPLES ============
/*

// Get a translated string
const welcomeMessage = i18n.t('auth.login_welcome');

// Get a translated string with parameters
const errorMsg = i18n.t('alert.error_message', { errorCode: 'E001' });

// Change language
i18n.setLanguage('pt');  // Switch to Portuguese
i18n.setLanguage('es');  // Switch to Spanish

// Get current language
const currentLang = i18n.getLanguage();

// Get language name
const langName = i18n.getSupportedLanguages()[currentLang].name;

// Listen for language changes
window.addEventListener('languageChanged', (e) => {
  console.log('Language changed to:', e.detail.language);
  // Update UI here
});

*/
