/**
 * Libros Mágicos - Order & Checkout Controller (order.js)
 * Production-ready Vanilla JavaScript for the Order & Customization Page
 *
 * Features:
 * 1. Plan Selection from URL (?plan=basico|familiar|premium, default: familiar)
 * 2. Official Plan Data (PLANS with pricing, book counts, features)
 * 3. Story Selection with interactive cards and dynamic Custom Story textarea
 * 4. Comprehensive Form Validation with inline red-border errors and smooth scroll
 * 5. Real-time Order Summary updates (plan, price, child name, story, features)
 * 6. PayPal Smart Payment Buttons (paypal.Buttons) with createOrder, onApprove, onError
 * 7. Multi-language (i18n) system with 4 languages (es, en, pt, fr) & localStorage
 * 8. Strict Input Sanitization to prevent XSS
 * 9. Smooth micro-interactions, animations, and loading states
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. PLAN DATA & STORY DEFINITIONS
     ========================================================================== */

  const PLANS = {
    basico: {
      name: 'Básico',
      price: 9.99,
      books: 1,
      features: [
        '1 libro digital (24 páginas)',
        'Formato PDF',
        'Descarga instantánea'
      ]
    },
    familiar: {
      name: 'Familiar',
      price: 24.99,
      books: 3,
      features: [
        '3 libros digitales',
        'PDF + interactivo con audio',
        'Descarga instantánea'
      ]
    },
    premium: {
      name: 'Premium',
      price: 39.99,
      books: 5,
      features: [
        '5 libros digitales',
        'PDF + interactivo con audio',
        'Actualizaciones de por vida'
      ]
    }
  };

  const STORIES = {
    superheroe: {
      id: 'superheroe',
      icon: '🦸‍♂️',
      title: {
        es: 'Mi Super Aventura',
        en: 'My Superhero Adventure',
        pt: 'Minha Super Aventura',
        fr: 'Mon Aventure de Super-Héros'
      },
      desc: {
        es: 'Descubre sus superpoderes y salva la ciudad.',
        en: 'Discovers superpowers and saves the city.',
        pt: 'Descobre seus superpoderes e salva a cidade.',
        fr: 'Découvre ses super-pouvoirs et sauve la ville.'
      }
    },
    princesa: {
      id: 'princesa',
      icon: '👑',
      title: {
        es: 'Mi Princesa Favorita',
        en: 'My Favorite Princess',
        pt: 'Minha Princesa Favorita',
        fr: 'Ma Princesse Préférée'
      },
      desc: {
        es: 'Un reino mágico de bondad, valentía y coronas brillantes.',
        en: 'A magical kingdom of kindness, courage, and sparkling crowns.',
        pt: 'Um reino mágico de bondade, coragem e coroas brilhantes.',
        fr: 'Un royaume magique de bonté, de courage et de couronnes étincelantes.'
      }
    },
    espacio: {
      id: 'espacio',
      icon: '🚀',
      title: {
        es: 'Aventura en el Espacio',
        en: 'Space Adventure',
        pt: 'Aventura no Espaço',
        fr: 'Aventure dans l\'Espace'
      },
      desc: {
        es: 'Un viaje intergaláctico entre estrellas y planetas lejanos.',
        en: 'An intergalactic voyage among stars and distant planets.',
        pt: 'Uma viagem intergaláctica entre estrelas e planetas distantes.',
        fr: 'Un voyage intergalactique parmi les étoiles et les planètes lointaines.'
      }
    },
    bosque: {
      id: 'bosque',
      icon: '🌲',
      title: {
        es: 'El Bosque Encantado',
        en: 'The Enchanted Forest',
        pt: 'A Floresta Encantada',
        fr: 'La Forêt Enchantée'
      },
      desc: {
        es: 'Amigos animales, hadas curiosas y misterios de la naturaleza.',
        en: 'Animal friends, curious fairies, and nature mysteries.',
        pt: 'Amigos animais, fadas curiosas e mistérios da natureza.',
        fr: 'Amis animaux, fées curieuses et mystères de la nature.'
      }
    },
    colores: {
      id: 'colores',
      icon: '🎨',
      title: {
        es: 'Mi Primer Libro de Colores',
        en: 'My First Book of Colors',
        pt: 'Meu Primeiro Livro de Cores',
        fr: 'Mon Premier Livre de Couleurs'
      },
      desc: {
        es: 'Ideal para los más pequeños: formas, colores y alegría.',
        en: 'Perfect for toddlers: shapes, colors, and joyful learning.',
        pt: 'Ideal para os pequeninos: formas, cores e alegria.',
        fr: 'Idéal pour les tout-petits : formes, couleurs et émerveillement.'
      }
    },
    receta: {
      id: 'receta',
      icon: '🧁',
      title: {
        es: 'La Receta Mágica',
        en: 'The Magic Recipe',
        pt: 'A Receita Mágica',
        fr: 'La Recette Magique'
      },
      desc: {
        es: 'Una cocina divertida donde cada ingrediente crea magia.',
        en: 'A fun kitchen where every ingredient creates wonder.',
        pt: 'Uma cozinha divertida onde cada ingrediente cria magia.',
        fr: 'Une cuisine amusante où chaque ingrédient crée de la magie.'
      }
    },
    custom: {
      id: 'custom',
      icon: '✨',
      title: {
        es: 'Historia Personalizada (Tu propia idea)',
        en: 'Custom Story (Your own idea)',
        pt: 'História Personalizada (Sua própria ideia)',
        fr: 'Histoire Personnalisée (Votre propre idée)'
      },
      desc: {
        es: 'Crea tu propia trama y nosotros le daremos vida.',
        en: 'Create your own plot and we will bring it to life.',
        pt: 'Crie sua própria trama e nós daremos vida a ela.',
        fr: 'Créez votre propre intrigue et nous lui donnerons vie.'
      }
    }
  };

  /* ==========================================================================
     2. COMPLETE MULTI-LANGUAGE TRANSLATIONS (ES, EN, PT, FR)
     ========================================================================== */

  const TRANSLATIONS = {
    es: {
      // Header / Page Meta
      'page.title': 'Personaliza tu Libro',
      'page.subtitle': 'Elige tu plan, cuéntanos sobre tu pequeño héroe y crea una historia inolvidable',
      'page.meta_title': 'Personaliza tu Libro Infantil | Libros Mágicos',
      'page.badge': 'Compra Segura & Descarga Inmediata',

      // Steps & Section Headings
      'section.plan.title': '1. Selecciona tu Plan',
      'section.plan.subtitle': 'Elige la opción ideal para tu pequeño o para toda la familia',
      'section.child.title': '2. Información del Protagonista',
      'section.child.subtitle': 'Personalizaremos la historia con el nombre y características de tu niño/a',
      'section.story.title': '3. Elige la Aventura',
      'section.story.subtitle': 'Selecciona una historia prediseñada o cuéntanos tu propia idea',
      'section.parent.title': '4. Datos de Entrega y Contacto',
      'section.parent.subtitle': 'Aquí recibirás los enlaces de descarga y tus archivos en PDF de alta resolución',
      'section.summary.title': 'Resumen del Pedido',

      // Plans & Features
      'plan.basico.name': 'Básico',
      'plan.basico.tag': 'Primera Aventura',
      'plan.basico.desc': '1 libro digital (24 páginas)',
      'plan.basico.period': 'por ebook',
      'plan.basico.f1': '1 libro digital (24 páginas)',
      'plan.basico.f2': 'Formato PDF de alta calidad',
      'plan.basico.f3': 'Descarga instantánea',

      'plan.familiar.name': 'Familiar',
      'plan.familiar.tag': 'Paquete Completo',
      'plan.familiar.desc': '3 libros digitales (24 pág. c/u)',
      'plan.familiar.period': '3 ebooks',
      'plan.familiar.badge': 'Más Popular',
      'plan.familiar.f1': '3 libros digitales',
      'plan.familiar.f2': 'PDF + interactivo con audio',
      'plan.familiar.f3': 'Descarga instantánea',

      'plan.premium.name': 'Premium',
      'plan.premium.tag': 'Colección Mágica',
      'plan.premium.desc': '5 libros digitales personalizados',
      'plan.premium.period': '5 ebooks',
      'plan.premium.f1': '5 libros digitales',
      'plan.premium.f2': 'PDF + interactivo con audio',
      'plan.premium.f3': 'Actualizaciones de por vida',

      // Form Labels
      'form.child_name': 'Nombre del Niño/a',
      'form.age': 'Edad',
      'form.gender': 'Género',
      'form.hair': 'Color de Cabello (opcional)',
      'form.skin': 'Tono de Piel',
      'form.eyes': 'Color de Ojos (opcional)',
      'form.story': 'Historia o Tema',
      'form.custom_story': 'Describe tu Historia Personalizada',
      'form.dedication': 'Dedicatoria Especial (opcional)',
      'form.parent_name': 'Tu Nombre (Padre/Madre/Tutor)',
      'form.email': 'Correo Electrónico (para recibir el libro)',
      'form.phone': 'Teléfono / WhatsApp',
      'form.country': 'País de Residencia (opcional)',
      'form.select_placeholder': 'Selecciona una opción...',

      // Option Values
      'gender.boy': 'Niño',
      'gender.girl': 'Niña',
      'gender.neutral': 'Neutro / Prefiero no decir',
      'hair.brown': 'Castaño',
      'hair.black': 'Negro',
      'hair.blonde': 'Rubio',
      'hair.red': 'Pelirrojo',
      'hair.curly': 'Rizado / Afro',
      'skin.fair': 'Clara',
      'skin.medium': 'Media',
      'skin.tan': 'Morena',
      'skin.dark': 'Oscura',
      'eyes.brown': 'Marrones',
      'eyes.blue': 'Azules',
      'eyes.green': 'Verdes',
      'eyes.hazel': 'Miel / Avellana',
      'eyes.black': 'Negros',

      // Placeholders
      'ph.child_name': 'Ej: Mateo o Sofía',
      'ph.age': 'Ej: 5',
      'ph.dedication': 'Para nuestro pequeño héroe con todo el amor de mamá y papá...',
      'ph.custom_story': 'Cuéntanos qué aventura sueña tu hijo/a: superpoderes, animales favoritos, castillos mágicos...',
      'ph.parent_name': 'Ej: Carlos Gómez',
      'ph.email': 'tu@email.com',
      'ph.phone': 'Ej: +57 300 123 4567',
      'ph.country': 'Selecciona tu país',

      // Story Cards
      'story.superheroe.title': 'Mi Super Aventura',
      'story.superheroe.desc': 'Descubre sus superpoderes y salva la ciudad.',
      'story.princesa.title': 'Mi Princesa Favorita',
      'story.princesa.desc': 'Un reino mágico de bondad, valentía y coronas brillantes.',
      'story.espacio.title': 'Aventura en el Espacio',
      'story.espacio.desc': 'Un viaje intergaláctico entre estrellas y planetas lejanos.',
      'story.bosque.title': 'El Bosque Encantado',
      'story.bosque.desc': 'Amigos animales, hadas curiosas y misterios de la naturaleza.',
      'story.colores.title': 'Mi Primer Libro de Colores',
      'story.colores.desc': 'Ideal para los más pequeños: formas, colores y alegría.',
      'story.receta.title': 'La Receta Mágica',
      'story.receta.desc': 'Una cocina divertida donde cada ingrediente crea magia.',
      'story.custom.title': 'Historia Personalizada',
      'story.custom.desc': 'Crea tu propia trama y nosotros le daremos vida.',

      // Order Summary Labels
      'summary.plan': 'Plan Seleccionado',
      'summary.price': 'Precio Total',
      'summary.child': 'Protagonista',
      'summary.story': 'Historia Elegida',
      'summary.books': 'Libros Incluidos',
      'summary.delivery': 'Entrega',
      'summary.delivery_val': 'Descarga Digital Inmediata (PDF)',
      'summary.total': 'Total a Pagar',
      'summary.not_specified': 'Sin definir',
      'summary.features_title': 'Lo que incluye tu pedido:',

      // Buttons
      'btn.pay': 'Pagar con PayPal',
      'btn.processing': 'Procesando pago seguro...',
      'btn.retry': 'Intentar de Nuevo',
      'btn.back': 'Volver al Inicio',

      // Security Badges
      'badge.ssl': 'Pago Seguro SSL 256-Bit',
      'badge.guarantee': 'Garantía de Satisfacción 100%',
      'badge.download': 'Descarga Digital Inmediata',
      'badge.support': 'Soporte 24/7 vía WhatsApp',

      // Errors
      'error.child_name': 'Por favor, ingresa el nombre del niño/a (mínimo 2 letras).',
      'error.age': 'Ingresa una edad válida (entre 0 y 14 años).',
      'error.email': 'Ingresa un correo electrónico válido (ej: nombre@dominio.com).',
      'error.phone': 'Ingresa un número de teléfono válido (mínimo 6 dígitos).',
      'error.parent_name': 'Por favor, ingresa tu nombre.',
      'error.story': 'Por favor, selecciona una historia para el libro.',
      'error.custom_story': 'Por favor, describe tu historia personalizada (mínimo 10 caracteres).',
      'error.fix_errors': 'Por favor, revisa y corrige los campos marcados en rojo.',
      'error.paypal_generic': 'Ocurrió un error al procesar el pago con PayPal. Por favor, intenta de nuevo o escríbenos a WhatsApp.',

      // Success Screen
      'success.title': '¡Pago Exitoso! Tu Aventura Mágica Ha Comenzado 🎉',
      'success.subtitle': 'Hemos recibido tu pedido correctamente. Tu libro personalizado está en proceso de creación.',
      'success.order_id': 'ID de Transacción PayPal:',
      'success.email_notice': 'Enviaremos el enlace de descarga e información detallada a tu correo electrónico:',
      'success.delivery_time': 'Tiempo estimado de entrega digital: 2 a 12 horas.',
      'success.step1': 'Nuestro equipo de ilustradores adapta la historia a tu pequeño.',
      'success.step2': 'Recibirás el PDF imprimible de alta resolución y la versión interactiva.',
      'success.step3': '¡Listo para leer juntos y vivir momentos inolvidables!',
      'success.whatsapp_prompt': '¿Quieres enviarnos fotos adicionales o consultar el estado de tu pedido?',
      'success.whatsapp_btn': 'Contactar por WhatsApp con mi ID'
    },

    en: {
      // Header / Page Meta
      'page.title': 'Customize Your Book',
      'page.subtitle': 'Choose your plan, tell us about your little hero, and create an unforgettable story',
      'page.meta_title': 'Customize Your Children\'s Book | Libros Mágicos',
      'page.badge': 'Secure Purchase & Fast Digital Download',

      // Steps & Section Headings
      'section.plan.title': '1. Choose your Plan',
      'section.plan.subtitle': 'Select the option that best fits your family',
      'section.child.title': '2. Protagonist Details',
      'section.child.subtitle': 'We will personalize the story using your child\'s name and traits',
      'section.story.title': '3. Choose the Adventure',
      'section.story.subtitle': 'Select a pre-designed story or tell us your own idea',
      'section.parent.title': '4. Delivery & Contact Details',
      'section.parent.subtitle': 'You will receive your high-resolution download links here',
      'section.summary.title': 'Order Summary',

      // Plans & Features
      'plan.basico.name': 'Basic',
      'plan.basico.tag': 'First Adventure',
      'plan.basico.desc': '1 digital book (24 pages)',
      'plan.basico.period': 'per ebook',
      'plan.basico.f1': '1 digital book (24 pages)',
      'plan.basico.f2': 'High quality PDF format',
      'plan.basico.f3': 'Instant download',

      'plan.familiar.name': 'Family',
      'plan.familiar.tag': 'Complete Pack',
      'plan.familiar.desc': '3 digital books (24 pages each)',
      'plan.familiar.period': '3 ebooks',
      'plan.familiar.badge': 'Most Popular',
      'plan.familiar.f1': '3 digital books',
      'plan.familiar.f2': 'PDF + interactive with audio',
      'plan.familiar.f3': 'Instant download',

      'plan.premium.name': 'Premium',
      'plan.premium.tag': 'Magical Collection',
      'plan.premium.desc': '5 personalized digital books',
      'plan.premium.period': '5 ebooks',
      'plan.premium.f1': '5 digital books',
      'plan.premium.f2': 'PDF + interactive with audio',
      'plan.premium.f3': 'Lifetime updates',

      // Form Labels
      'form.child_name': 'Child\'s Name',
      'form.age': 'Age',
      'form.gender': 'Gender',
      'form.hair': 'Hair Color (optional)',
      'form.skin': 'Skin Tone',
      'form.eyes': 'Eye Color (optional)',
      'form.story': 'Story or Theme',
      'form.custom_story': 'Describe your Custom Story',
      'form.dedication': 'Special Dedication (optional)',
      'form.parent_name': 'Parent / Guardian Name',
      'form.email': 'Email Address (to receive the book)',
      'form.phone': 'Phone / WhatsApp',
      'form.country': 'Country of Residence (optional)',
      'form.select_placeholder': 'Select an option...',

      // Option Values
      'gender.boy': 'Boy',
      'gender.girl': 'Girl',
      'gender.neutral': 'Neutral / Prefer not to say',
      'hair.brown': 'Brown',
      'hair.black': 'Black',
      'hair.blonde': 'Blonde',
      'hair.red': 'Red / Auburn',
      'hair.curly': 'Curly / Afro',
      'skin.fair': 'Fair / Light',
      'skin.medium': 'Medium',
      'skin.tan': 'Tan',
      'skin.dark': 'Dark',
      'eyes.brown': 'Brown',
      'eyes.blue': 'Blue',
      'eyes.green': 'Green',
      'eyes.hazel': 'Hazel',
      'eyes.black': 'Black',

      // Placeholders
      'ph.child_name': 'e.g. Liam or Emma',
      'ph.age': 'e.g. 5',
      'ph.dedication': 'To our little hero with all the love from mom and dad...',
      'ph.custom_story': 'Tell us what adventure your child dreams of: superpowers, favorite animals, magic castles...',
      'ph.parent_name': 'e.g. Michael Smith',
      'ph.email': 'your@email.com',
      'ph.phone': 'e.g. +1 555 123 4567',
      'ph.country': 'Select your country',

      // Story Cards
      'story.superheroe.title': 'My Superhero Adventure',
      'story.superheroe.desc': 'Discovers superpowers and saves the city.',
      'story.princesa.title': 'My Favorite Princess',
      'story.princesa.desc': 'A magical kingdom of kindness, courage, and sparkling crowns.',
      'story.espacio.title': 'Space Adventure',
      'story.espacio.desc': 'An intergalactic voyage among stars and distant planets.',
      'story.bosque.title': 'The Enchanted Forest',
      'story.bosque.desc': 'Animal friends, curious fairies, and nature mysteries.',
      'story.colores.title': 'My First Book of Colors',
      'story.colores.desc': 'Perfect for toddlers: shapes, colors, and joyful learning.',
      'story.receta.title': 'The Magic Recipe',
      'story.receta.desc': 'A fun kitchen where every ingredient creates wonder.',
      'story.custom.title': 'Custom Story',
      'story.custom.desc': 'Create your own plot and we will bring it to life.',

      // Order Summary Labels
      'summary.plan': 'Selected Plan',
      'summary.price': 'Total Price',
      'summary.child': 'Protagonist',
      'summary.story': 'Chosen Story',
      'summary.books': 'Included Books',
      'summary.delivery': 'Delivery',
      'summary.delivery_val': 'Instant Digital Download (PDF)',
      'summary.total': 'Total Due',
      'summary.not_specified': 'Not specified',
      'summary.features_title': 'What\'s included in your order:',

      // Buttons
      'btn.pay': 'Pay with PayPal',
      'btn.processing': 'Processing secure payment...',
      'btn.retry': 'Try Again',
      'btn.back': 'Back to Home',

      // Security Badges
      'badge.ssl': 'SSL 256-Bit Secure Payment',
      'badge.guarantee': '100% Satisfaction Guarantee',
      'badge.download': 'Immediate Digital Download',
      'badge.support': '24/7 Support via WhatsApp',

      // Errors
      'error.child_name': 'Please enter the child\'s name (minimum 2 letters).',
      'error.age': 'Enter a valid age (between 0 and 14 years).',
      'error.email': 'Please enter a valid email address.',
      'error.phone': 'Enter a valid phone number (minimum 6 digits).',
      'error.parent_name': 'Please enter your name.',
      'error.story': 'Please select a story for the book.',
      'error.custom_story': 'Please describe your custom adventure (minimum 10 characters).',
      'error.fix_errors': 'Please review and fix the fields marked in red.',
      'error.paypal_generic': 'An error occurred while processing the PayPal payment. Please try again or reach out on WhatsApp.',

      // Success Screen
      'success.title': 'Payment Successful! Your Magical Adventure Has Begun 🎉',
      'success.subtitle': 'We have received your order successfully. Your personalized book is being created.',
      'success.order_id': 'PayPal Transaction ID:',
      'success.email_notice': 'We will send the download link and details to your email:',
      'success.delivery_time': 'Estimated digital delivery time: 2 to 12 hours.',
      'success.step1': 'Our artists illustrate and design your personalized story.',
      'success.step2': 'You will receive the high-resolution printable PDF and interactive edition.',
      'success.step3': 'Ready to read together and cherish magical moments!',
      'success.whatsapp_prompt': 'Would you like to send additional photos or check order status?',
      'success.whatsapp_btn': 'Contact on WhatsApp with Order ID'
    },

    pt: {
      // Header / Page Meta
      'page.title': 'Personalize seu Livro',
      'page.subtitle': 'Escolha seu plano, conte-nos sobre seu pequeno herói e crie uma história inesquecível',
      'page.meta_title': 'Personalize seu Livro Infantil | Libros Mágicos',
      'page.badge': 'Compra Segura & Download Imediato',

      // Steps & Section Headings
      'section.plan.title': '1. Escolha seu Plano',
      'section.plan.subtitle': 'Selecione a opção que melhor se adapta à sua família',
      'section.child.title': '2. Dados do Protagonista',
      'section.child.subtitle': 'Personalizaremos o personagem principal com estas informações',
      'section.story.title': '3. Escolha a Aventura',
      'section.story.subtitle': 'Selecione uma história pré-definida ou conte sua própria ideia',
      'section.parent.title': '4. Dados de Entrega e Contato',
      'section.parent.subtitle': 'Você receberá os links de download em alta resolução neste e-mail',
      'section.summary.title': 'Resumo do Pedido',

      // Plans & Features
      'plan.basico.name': 'Básico',
      'plan.basico.tag': 'Primeira Aventura',
      'plan.basico.desc': '1 livro digital (24 páginas)',
      'plan.basico.period': 'por ebook',
      'plan.basico.f1': '1 livro digital (24 páginas)',
      'plan.basico.f2': 'Formato PDF de alta qualidade',
      'plan.basico.f3': 'Download instantâneo',

      'plan.familiar.name': 'Familiar',
      'plan.familiar.tag': 'Pacote Completo',
      'plan.familiar.desc': '3 livros digitais (24 pág. cada)',
      'plan.familiar.period': '3 ebooks',
      'plan.familiar.badge': 'Mais Popular',
      'plan.familiar.f1': '3 livros digitais',
      'plan.familiar.f2': 'PDF + interativo com áudio',
      'plan.familiar.f3': 'Download instantâneo',

      'plan.premium.name': 'Premium',
      'plan.premium.tag': 'Coleção Mágica',
      'plan.premium.desc': '5 livros digitais personalizados',
      'plan.premium.period': '5 ebooks',
      'plan.premium.f1': '5 livros digitais',
      'plan.premium.f2': 'PDF + interativo com áudio',
      'plan.premium.f3': 'Atualizações para a vida toda',

      // Form Labels
      'form.child_name': 'Nome da Criança',
      'form.age': 'Idade',
      'form.gender': 'Gênero',
      'form.hair': 'Cor do Cabelo (opcional)',
      'form.skin': 'Tom de Pele',
      'form.eyes': 'Cor dos Olhos (opcional)',
      'form.story': 'História ou Tema',
      'form.custom_story': 'Descreva sua História Personalizada',
      'form.dedication': 'Dedicatória Especial (opcional)',
      'form.parent_name': 'Nome do Pai, Mãe ou Responsável',
      'form.email': 'E-mail (para receber o livro)',
      'form.phone': 'Telefone / WhatsApp',
      'form.country': 'País de Residência (opcional)',
      'form.select_placeholder': 'Selecione uma opção...',

      // Option Values
      'gender.boy': 'Menino',
      'gender.girl': 'Menina',
      'gender.neutral': 'Neutro / Prefiro não dizer',
      'hair.brown': 'Castanho',
      'hair.black': 'Preto',
      'hair.blonde': 'Loiro',
      'hair.red': 'Ruivo',
      'hair.curly': 'Cacheado / Crespo',
      'skin.fair': 'Clara',
      'skin.medium': 'Média',
      'skin.tan': 'Morena',
      'skin.dark': 'Escura',
      'eyes.brown': 'Castanhos',
      'eyes.blue': 'Azuis',
      'eyes.green': 'Verdes',
      'eyes.hazel': 'Mel / Avelã',
      'eyes.black': 'Pretos',

      // Placeholders
      'ph.child_name': 'Ex: Miguel ou Sofia',
      'ph.age': 'Ex: 5',
      'ph.dedication': 'Para o nosso pequeno herói com todo o amor da mamãe e do papai...',
      'ph.custom_story': 'Conte-nos que aventura seu filho sonha: superpoderes, animais favoritos, castelos mágicos...',
      'ph.parent_name': 'Ex: Carlos Silva',
      'ph.email': 'seu@email.com',
      'ph.phone': 'Ex: +55 11 98765 4321',
      'ph.country': 'Selecione seu país',

      // Story Cards
      'story.superheroe.title': 'Minha Super Aventura',
      'story.superheroe.desc': 'Descobre seus superpoderes e salva a cidade.',
      'story.princesa.title': 'Minha Princesa Favorita',
      'story.princesa.desc': 'Um reino mágico de bondade, coragem e coroas brilhantes.',
      'story.espacio.title': 'Aventura no Espaço',
      'story.espacio.desc': 'Uma viagem intergaláctica entre estrelas e planetas distantes.',
      'story.bosque.title': 'A Floresta Encantada',
      'story.bosque.desc': 'Amigos animais, fadas curiosas e mistérios da natureza.',
      'story.colores.title': 'Meu Primeiro Livro de Cores',
      'story.colores.desc': 'Ideal para os pequeninos: formas, cores e alegria.',
      'story.receta.title': 'A Receita Mágica',
      'story.receta.desc': 'Uma cozinha divertida onde cada ingrediente cria magia.',
      'story.custom.title': 'História Personalizada',
      'story.custom.desc': 'Crie sua própria trama e nós daremos vida a ela.',

      // Order Summary Labels
      'summary.plan': 'Plano Selecionado',
      'summary.price': 'Preço Total',
      'summary.child': 'Protagonista',
      'summary.story': 'História Escolhida',
      'summary.books': 'Livros Incluídos',
      'summary.delivery': 'Entrega',
      'summary.delivery_val': 'Download Digital Imediato (PDF)',
      'summary.total': 'Total a Pagar',
      'summary.not_specified': 'Não definido',
      'summary.features_title': 'O que inclui seu pedido:',

      // Buttons
      'btn.pay': 'Pagar com PayPal',
      'btn.processing': 'Processando pagamento seguro...',
      'btn.retry': 'Tentar Novamente',
      'btn.back': 'Voltar ao Início',

      // Security Badges
      'badge.ssl': 'Pagamento Seguro SSL 256-Bit',
      'badge.guarantee': 'Garantia de Satisfação 100%',
      'badge.download': 'Download Digital Imediato',
      'badge.support': 'Suporte 24/7 via WhatsApp',

      // Errors
      'error.child_name': 'Por favor, digite o nome da criança (mínimo 2 letras).',
      'error.age': 'Digite uma idade válida (entre 0 e 14 anos).',
      'error.email': 'Digite um endereço de e-mail válido.',
      'error.phone': 'Digite um número de telefone válido (mínimo 6 dígitos).',
      'error.parent_name': 'Por favor, digite seu nome.',
      'error.story': 'Por favor, selecione uma história para o livro.',
      'error.custom_story': 'Por favor, descreva sua história personalizada (mínimo 10 caracteres).',
      'error.fix_errors': 'Por favor, revise e corrija os campos marcados em vermelho.',
      'error.paypal_generic': 'Ocorreu um erro ao processar o pagamento com o PayPal. Por favor, tente novamente ou contate-nos pelo WhatsApp.',

      // Success Screen
      'success.title': 'Pagamento Concluído! Sua Aventura Mágica Começou 🎉',
      'success.subtitle': 'Recebemos seu pedido com sucesso. Seu livro personalizado está sendo criado com muito carinho.',
      'success.order_id': 'ID da Transação PayPal:',
      'success.email_notice': 'Enviaremos o link de download e os detalhes para o seu e-mail:',
      'success.delivery_time': 'Tempo estimado de entrega digital: 2 a 12 horas.',
      'success.step1': 'Nossa equipe de ilustradores adapta a história ao seu pequeno.',
      'success.step2': 'Você receberá o PDF imprimível de alta resolução e a versão interativa.',
      'success.step3': 'Pronto para lerem juntos momentos inesquecíveis!',
      'success.whatsapp_prompt': 'Deseja nos enviar fotos adicionais ou consultar o status do seu pedido?',
      'success.whatsapp_btn': 'Contatar pelo WhatsApp com meu ID'
    },

    fr: {
      // Header / Page Meta
      'page.title': 'Personnalisez votre Livre',
      'page.subtitle': 'Choisissez votre formule, décrivez votre petit héros et créez un conte inoubliable',
      'page.meta_title': 'Personnalisez votre Livre pour Enfants | Libros Mágicos',
      'page.badge': 'Achat Sécurisé & Téléchargement Rapide',

      // Steps & Section Headings
      'section.plan.title': '1. Choisissez votre Formule',
      'section.plan.subtitle': 'Sélectionnez l\'option la plus adaptée à votre famille',
      'section.child.title': '2. Informations du Protagoniste',
      'section.child.subtitle': 'Nous adapterons l\'histoire selon le prénom et les traits de votre enfant',
      'section.story.title': '3. Choisissez l\'Aventure',
      'section.story.subtitle': 'Choisissez une histoire prédéfinie ou racontez-nous votre propre idée',
      'section.parent.title': '4. Coordonnées de Livraison',
      'section.parent.subtitle': 'Vous recevrez vos fichiers PDF haute résolution par e-mail',
      'section.summary.title': 'Récapitulatif de la Commande',

      // Plans & Features
      'plan.basico.name': 'Basique',
      'plan.basico.tag': 'Première Aventure',
      'plan.basico.desc': '1 livre numérique (24 pages)',
      'plan.basico.period': 'par ebook',
      'plan.basico.f1': '1 livre numérique (24 pages)',
      'plan.basico.f2': 'Format PDF haute qualité',
      'plan.basico.f3': 'Téléchargement instantané',

      'plan.familiar.name': 'Famille',
      'plan.familiar.tag': 'Pack Complet',
      'plan.familiar.desc': '3 livres numériques (24 pages chacun)',
      'plan.familiar.period': '3 ebooks',
      'plan.familiar.badge': 'Le Plus Populaire',
      'plan.familiar.f1': '3 livres numériques',
      'plan.familiar.f2': 'PDF + interactif avec audio',
      'plan.familiar.f3': 'Téléchargement instantané',

      'plan.premium.name': 'Premium',
      'plan.premium.tag': 'Collection Magique',
      'plan.premium.desc': '5 livres numériques personnalisés',
      'plan.premium.period': '5 ebooks',
      'plan.premium.f1': '5 livres numériques',
      'plan.premium.f2': 'PDF + interactif avec audio',
      'plan.premium.f3': 'Mises à jour à vie',

      // Form Labels
      'form.child_name': 'Nom de l\'Enfant',
      'form.age': 'Âge',
      'form.gender': 'Genre',
      'form.hair': 'Couleur des Cheveux (facultatif)',
      'form.skin': 'Teint de Peau',
      'form.eyes': 'Couleur des Yeux (facultatif)',
      'form.story': 'Histoire ou Thème',
      'form.custom_story': 'Décrivez votre Histoire Personnalisée',
      'form.dedication': 'Dédicace Spéciale (facultatif)',
      'form.parent_name': 'Nom du Parent ou Tuteur',
      'form.email': 'E-mail (pour recevoir le livre)',
      'form.phone': 'Téléphone / WhatsApp',
      'form.country': 'Pays de Résidence (facultatif)',
      'form.select_placeholder': 'Sélectionnez une option...',

      // Option Values
      'gender.boy': 'Garçon',
      'gender.girl': 'Fille',
      'gender.neutral': 'Neutre / Préfère ne pas dire',
      'hair.brown': 'Châtain',
      'hair.black': 'Noir',
      'hair.blonde': 'Blond',
      'hair.red': 'Roux',
      'hair.curly': 'Bouclé / Crépus',
      'skin.fair': 'Claire',
      'skin.medium': 'Moyenne',
      'skin.tan': 'Mate',
      'skin.dark': 'Foncée',
      'eyes.brown': 'Marron',
      'eyes.blue': 'Bleus',
      'eyes.green': 'Verts',
      'eyes.hazel': 'Noisette',
      'eyes.black': 'Noirs',

      // Placeholders
      'ph.child_name': 'Ex : Gabriel ou Emma',
      'ph.age': 'Ex : 5',
      'ph.dedication': 'Pour notre petit héros avec tout l\'amour de maman et papa...',
      'ph.custom_story': 'Racontez-nous quelle aventure fait rêver votre enfant : super-pouvoirs, animaux favoris, châteaux magiques...',
      'ph.parent_name': 'Ex : Jean Dupont',
      'ph.email': 'vous@email.com',
      'ph.phone': 'Ex : +33 6 12 34 56 78',
      'ph.country': 'Sélectionnez votre pays',

      // Story Cards
      'story.superheroe.title': 'Mon Aventure de Super-Héros',
      'story.superheroe.desc': 'Découvre ses super-pouvoirs et sauve la ville.',
      'story.princesa.title': 'Ma Princesse Préférée',
      'story.princesa.desc': 'Un royaume magique de bonté, de courage et de couronnes étincelantes.',
      'story.espacio.title': 'Aventure dans l\'Espace',
      'story.espacio.desc': 'Un voyage intergalactique parmi les étoiles et les planètes lointaines.',
      'story.bosque.title': 'La Forêt Enchantée',
      'story.bosque.desc': 'Amis animaux, fées curieuses et mystères de la nature.',
      'story.colores.title': 'Mon Premier Livre de Couleurs',
      'story.colores.desc': 'Idéal pour les tout-petits : formes, couleurs et émerveillement.',
      'story.receta.title': 'La Receta Mágica',
      'story.receta.desc': 'Une cuisine amusante où chaque ingrédient crée de la magie.',
      'story.custom.title': 'Histoire Personnalisée',
      'story.custom.desc': 'Créez votre propre intrigue et nous lui donnerons vie.',

      // Order Summary Labels
      'summary.plan': 'Formule Sélectionnée',
      'summary.price': 'Prix Total',
      'summary.child': 'Protagoniste',
      'summary.story': 'Histoire Choisie',
      'summary.books': 'Livres Inclus',
      'summary.delivery': 'Livraison',
      'summary.delivery_val': 'Téléchargement Numérique Immédiat (PDF)',
      'summary.total': 'Total à Payer',
      'summary.not_specified': 'Non spécifié',
      'summary.features_title': 'Ce qui est inclus dans votre commande :',

      // Buttons
      'btn.pay': 'Payer avec PayPal',
      'btn.processing': 'Traitement du paiement sécurisé...',
      'btn.retry': 'Réessayer',
      'btn.back': 'Retour à l\'Accueil',

      // Security Badges
      'badge.ssl': 'Paiement Sécurisé SSL 256-Bit',
      'badge.guarantee': 'Garantie Satisfait ou Remboursé 100%',
      'badge.download': 'Téléchargement Numérique Immédiat',
      'badge.support': 'Support 24/7 via WhatsApp',

      // Errors
      'error.child_name': 'Veuillez saisir le nom de l\'enfant (au moins 2 lettres).',
      'error.age': 'Saisissez un âge valide (entre 0 et 14 ans).',
      'error.email': 'Veuillez saisir une adresse e-mail valide.',
      'error.phone': 'Saisissez un numéro de téléphone valide (au moins 6 chiffres).',
      'error.parent_name': 'Veuillez saisir votre nom.',
      'error.story': 'Veuillez sélectionner une histoire pour le livre.',
      'error.custom_story': 'Veuillez décrire votre histoire personnalisée (au moins 10 caractères).',
      'error.fix_errors': 'Veuillez vérifier et corriger les champs marqués en rouge.',
      'error.paypal_generic': 'Une erreur s\'est produite lors du paiement PayPal. Veuillez réessayer ou nous contacter par WhatsApp.',

      // Success Screen
      'success.title': 'Paiement Réussi ! Votre Aventure Magique a Commencé 🎉',
      'success.subtitle': 'Nous avons bien reçu votre commande. Votre livre personnalisé est en cours de création.',
      'success.order_id': 'Identifiant de Transaction PayPal :',
      'success.email_notice': 'Nous vous enverrons le lien de téléchargement et les détails à votre e-mail :',
      'success.delivery_time': 'Délai estimé de livraison numérique : 2 à 12 heures.',
      'success.step1': 'Notre équipe illustre et adapte l\'histoire pour votre enfant.',
      'success.step2': 'Vous recevrez le PDF haute résolution prêt à imprimer et l\'édition audio.',
      'success.step3': 'Prêt pour des moments magiques de lecture partagée !',
      'success.whatsapp_prompt': 'Vous souhaitez nous envoyer des photos ou vérifier le statut de votre commande ?',
      'success.whatsapp_btn': 'Contacter par WhatsApp avec mon ID'
    }
  };

  /* ==========================================================================
     TRADUCCIONES DEL CHECKOUT — ver order-i18n.js
     El HTML usa claves con guion bajo (checkout_title, nav_home...) y el
     diccionario de arriba usa claves con puntos (page.title, plan.basico.name).
     Sin este puente el selector de idioma no traducía ningún texto visible.
     ========================================================================== */
  const ORDER_I18N = window.ORDER_I18N || { alias: {}, extra: {} };
  const KEY_ALIAS = ORDER_I18N.alias || {};

  Object.keys(ORDER_I18N.extra || {}).forEach((lang) => {
    if (TRANSLATIONS[lang]) Object.assign(TRANSLATIONS[lang], ORDER_I18N.extra[lang]);
  });

  /** Traduce una clave del HTML: exacta o mediante su alias con puntos. */
  function trDict(dict, key) {
    if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
    const alias = KEY_ALIAS[key];
    if (alias && Object.prototype.hasOwnProperty.call(dict, alias)) return dict[alias];
    return undefined;
  }

  /* ==========================================================================
     3. APPLICATION STATE
     ========================================================================== */

  const state = {
    currentLang: 'es',
    selectedPlanKey: 'familiar',
    selectedPlan: PLANS.familiar,
    selectedStoryKey: 'superheroe',
    isCustomStory: false,
    customStoryText: '',
    childName: '',
    childAge: '',
    parentEmail: '',
    parentPhone: '',
    parentName: '',
    dedication: '',
    country: '',
    gender: '',
    hair: '',
    skin: '',
    eyes: '',
    isPayPalRendered: false,
    paypalButtonInstance: null
  };

  /* ==========================================================================
     4. UTILITIES & INPUT SANITIZATION
     ========================================================================== */

  /**
   * Strips HTML/script tags and risky protocols from input to prevent XSS.
   */
  function sanitizeInput(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);

    return str
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/javascript:/gi, '') // Strip javascript: URLs
      .replace(/data:/gi, '')
      .replace(/on\w+\s*=/gi, '') // Strip inline event handlers
      .trim();
  }

  /**
   * Safely escapes HTML entities for innerHTML interpolation.
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Safe DOM element getter (supports multiple selectors)
   */
  function getEl(idOrSelector) {
    if (!idOrSelector) return null;
    if (idOrSelector.startsWith('#') || idOrSelector.startsWith('.') || idOrSelector.startsWith('[')) {
      return document.querySelector(idOrSelector);
    }
    return document.getElementById(idOrSelector) || document.querySelector(`[name="${idOrSelector}"]`);
  }

  /**
   * Returns current translation dictionary
   */
  function t(key, defaultVal) {
    const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.es;
    return dict[key] || TRANSLATIONS.es[key] || defaultVal || key;
  }

  /* ==========================================================================
     5. DYNAMIC HELPER STYLES INJECTION
     ========================================================================== */

  function injectHelperStyles() {
    if (document.getElementById('lm-order-helper-styles')) return;

    const css = `
      /* Order.js Dynamic Styles */
      .input-error {
        border-color: #ef4444 !important;
        background-color: #fff1f2 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
      }
      .form-field-error {
        color: #dc2626;
        font-size: 12px;
        font-weight: 600;
        margin-top: 6px;
        display: flex;
        align-items: center;
        gap: 5px;
        animation: lmFadeIn 0.25s ease-out;
      }
      .form-field-error svg {
        flex-shrink: 0;
      }
      .plan-card {
        transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s ease, border-color 0.28s ease;
      }
      .plan-card.selected,
      .plan-card.pricing-card-featured {
        border-color: #ec4899 !important;
        box-shadow: 0 16px 45px rgba(236, 72, 153, 0.22), 0 0 0 3px rgba(236, 72, 153, 0.3) !important;
        transform: translateY(-4px) scale(1.01);
      }
      .story-card {
        cursor: pointer;
        transition: all 0.25s ease;
        border: 2px solid #e5e7eb;
        background: #ffffff;
        border-radius: 18px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: relative;
        overflow: hidden;
      }
      .story-card:hover {
        border-color: #f472b6;
        background: #fdf2f8;
        transform: translateY(-2px);
      }
      .story-card.selected {
        border-color: #ec4899 !important;
        background: #fdf2f8 !important;
        box-shadow: 0 8px 24px rgba(236, 72, 153, 0.22) !important;
      }
      .story-card-check {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #ec4899;
        color: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 800;
        position: absolute;
        top: 12px;
        right: 12px;
        opacity: 0;
        transform: scale(0.6);
        transition: all 0.2s ease;
      }
      .story-card.selected .story-card-check {
        opacity: 1;
        transform: scale(1);
      }
      .custom-story-group {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .custom-story-group.hidden {
        display: none !important;
      }
      .paypal-btn-loading-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.95);
        border: 2px dashed #ec4899;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 700;
        color: #ec4899;
      }
      .lm-spinner {
        width: 20px;
        height: 20px;
        border: 3px solid rgba(236, 72, 153, 0.25);
        border-top-color: #ec4899;
        border-radius: 50%;
        animation: lmSpin 0.75s linear infinite;
      }
      .order-success-screen {
        animation: lmSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .order-error-banner {
        background: #fef2f2;
        border: 2px solid #ef4444;
        border-radius: 16px;
        padding: 16px 20px;
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
        gap: 14px;
        animation: lmFadeIn 0.3s ease;
      }
      @keyframes lmSpin {
        to { transform: rotate(360deg); }
      }
      @keyframes lmFadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes lmSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes lmShake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-6px); }
        40%, 80% { transform: translateX(6px); }
      }
      .lm-shake {
        animation: lmShake 0.45s ease-in-out;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'lm-order-helper-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  /* ==========================================================================
     6. LANGUAGE SWITCHER (I18N)
     ========================================================================== */

  /**
   * Initializes language from localStorage or default 'es'
   */
  function initLanguage() {
    try {
      const saved = localStorage.getItem('lm_lang') || localStorage.getItem('preferred_language');
      if (saved && TRANSLATIONS[saved]) {
        state.currentLang = saved;
      }
    } catch (e) {
      // localStorage restricted
    }

    applyTranslations(state.currentLang);
    setupLanguageSwitcherUI();
  }

  /**
   * Switches language and re-translates entire interface
   */
  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'es';
    state.currentLang = lang;

    try {
      localStorage.setItem('lm_lang', lang);
    } catch (e) {}

    applyTranslations(lang);
    updateOrderSummary();
    updateLanguageSwitcherUI();

    // Re-validate fields if errors are present to localize error messages
    const errors = document.querySelectorAll('.form-field-error');
    if (errors.length > 0) {
      validateForm(false);
    }
  }

  /**
   * Traverses DOM and updates elements with [data-i18n]
   */
  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.es;

    // 1. Text elements with [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const valor = trDict(dict, key);
      if (valor) {
        // If element contains pure text
        if (el.children.length === 0) {
          el.textContent = valor;
        } else {
          // If element has nested icons/badges, find text node
          const textNode = Array.from(el.childNodes).find(
            (n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim()
          );
          if (textNode) {
            textNode.nodeValue = ' ' + valor + ' ';
          } else {
            // Check for direct label span
            const spanLabel = el.querySelector('.i18n-text, span:not([class*="icon"]):not([class*="badge"])');
            if (spanLabel) {
              spanLabel.textContent = valor;
            } else {
              el.innerHTML = valor;
            }
          }
        }
      }
    });

    // 2. Placeholders with [data-i18n-placeholder] or standard inputs
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    // Translate standard inputs matching field names
    const placeholderMappings = {
      'child-name': 'ph.child_name',
      'childName': 'ph.child_name',
      'child-age': 'ph.age',
      'childAge': 'ph.age',
      'custom-story': 'ph.custom_story',
      'book-description': 'ph.custom_story',
      'dedication': 'ph.dedication',
      'book-dedication': 'ph.dedication',
      'parent-name': 'ph.parent_name',
      'parentName': 'ph.parent_name',
      'parent-email': 'ph.email',
      'email': 'ph.email',
      'parent-phone': 'ph.phone',
      'phone': 'ph.phone',
      'country': 'ph.country'
    };

    Object.entries(placeholderMappings).forEach(([fieldId, transKey]) => {
      const input = getEl(fieldId);
      if (input && dict[transKey]) {
        input.setAttribute('placeholder', dict[transKey]);
      }
    });

    // 3. Translate form select placeholder options
    document.querySelectorAll('select').forEach((sel) => {
      const firstOpt = sel.querySelector('option[value=""]');
      if (firstOpt) {
        firstOpt.textContent = dict['form.select_placeholder'] || 'Selecciona una opción...';
      }
    });

    // 4. Update Document Title & HTML Lang
    if (dict['page.meta_title']) {
      document.title = dict['page.meta_title'];
    }
    document.documentElement.lang = lang;

    // 5. Update localized story cards in DOM if they exist
    document.querySelectorAll('[data-story]').forEach((card) => {
      const storyId = card.getAttribute('data-story');
      const titleEl = card.querySelector('.story-title, .book-option-title, h4, h3');
      const descEl = card.querySelector('.story-desc, p');

      if (titleEl && dict[`story.${storyId}.title`]) {
        titleEl.textContent = dict[`story.${storyId}.title`];
      }
      if (descEl && dict[`story.${storyId}.desc`]) {
        descEl.textContent = dict[`story.${storyId}.desc`];
      }
    });

    // 6. Update plan cards in DOM if present
    Object.keys(PLANS).forEach((planKey) => {
      const card = document.querySelector(`.plan-card[data-plan="${planKey}"]`);
      if (card) {
        const nameEl = card.querySelector('.plan-name');
        const tagEl = card.querySelector('.plan-tag');
        const descEl = card.querySelector('.plan-desc');
        const periodEl = card.querySelector('.price-period');
        const badgeEl = card.querySelector('.plan-popular-badge');

        if (nameEl && dict[`plan.${planKey}.name`]) nameEl.textContent = dict[`plan.${planKey}.name`];
        if (tagEl && dict[`plan.${planKey}.tag`]) tagEl.textContent = dict[`plan.${planKey}.tag`];
        if (descEl && dict[`plan.${planKey}.desc`]) descEl.textContent = dict[`plan.${planKey}.desc`];
        if (periodEl && dict[`plan.${planKey}.period`]) periodEl.textContent = dict[`plan.${planKey}.period`];
        if (badgeEl && dict[`plan.${planKey}.badge`]) badgeEl.textContent = dict[`plan.${planKey}.badge`];
      }
    });
  }

  /**
   * Sets up event listeners on language dropdown / toggle
   */
  function setupLanguageSwitcherUI() {
    const switcher = document.getElementById('lang-switcher') || document.querySelector('.lang-switcher');
    const toggleBtn = document.getElementById('lang-btn') || document.querySelector('.lang-toggle') || document.querySelector('.lang-btn');
    const dropdown = document.getElementById('lang-dropdown') || document.querySelector('.lang-menu') || document.querySelector('.lang-dropdown');

    if (toggleBtn && dropdown) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', (e) => {
        if (!switcher || !switcher.contains(e.target)) {
          dropdown.classList.remove('open');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Attach click listeners to all language options
    document.querySelectorAll('.lang-option, [data-lang]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        if (lang) {
          setLanguage(lang);
          if (dropdown) dropdown.classList.remove('open');
        }
      });
    });

    updateLanguageSwitcherUI();
  }

  /**
   * Synchronizes active state on language buttons
   */
  function updateLanguageSwitcherUI() {
    const flags = {
      es: '🇪🇸 ES',
      en: '🇺🇸 EN',
      pt: '🇧🇷 PT',
      fr: '🇫🇷 FR'
    };

    const currentLabel = document.getElementById('lang-current') || document.querySelector('.lang-current');
    if (currentLabel) {
      currentLabel.textContent = flags[state.currentLang] || flags.es;
    }

    document.querySelectorAll('.lang-option, [data-lang]').forEach((btn) => {
      const lang = btn.getAttribute('data-lang');
      const isActive = lang === state.currentLang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });
  }

  /* ==========================================================================
     7. PLAN SELECTION FROM URL & CLICKS
     ========================================================================== */

  /**
   * Reads ?plan=basico|familiar|premium from URL or defaults to 'familiar'
   */
  function initPlanSelection() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramPlan = (urlParams.get('plan') || '').toLowerCase().trim();

    const planToSelect = PLANS[paramPlan] ? paramPlan : 'familiar';
    selectPlan(planToSelect, false);

    // Setup click handlers for all plan cards
    document.querySelectorAll('.plan-card, [data-plan]').forEach((card) => {
      card.addEventListener('click', () => {
        const planKey = card.getAttribute('data-plan');
        if (planKey && PLANS[planKey]) {
          selectPlan(planKey, true);
        }
      });

      // Keyboard accessibility (Enter / Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const planKey = card.getAttribute('data-plan');
          if (planKey && PLANS[planKey]) {
            selectPlan(planKey, true);
          }
        }
      });
    });
  }

  /**
   * Selects a plan, updates UI cards, state, and summary
   */
  function selectPlan(planKey, animated = true) {
    if (!PLANS[planKey]) planKey = 'familiar';

    state.selectedPlanKey = planKey;
    state.selectedPlan = PLANS[planKey];

    // Update active class on cards
    document.querySelectorAll('.plan-card, [data-plan]').forEach((card) => {
      const match = card.getAttribute('data-plan') === planKey;
      card.classList.toggle('selected', match);
      card.classList.toggle('pricing-card-featured', match);
      card.setAttribute('aria-selected', String(match));

      if (match && animated) {
        card.classList.add('lm-shake');
        setTimeout(() => card.classList.remove('lm-shake'), 450);
      }
    });

    // Update plan book limit counter if present
    const booksCountEl = document.querySelector('.plan-books-count, #summary-books-count');
    if (booksCountEl) {
      booksCountEl.textContent = state.selectedPlan.books;
    }

    updateOrderSummary();
  }

  /* ==========================================================================
     8. STORY SELECTION & CUSTOM STORY TOGGLE
     ========================================================================== */

  /**
   * Initializes story selection cards and handles custom story textarea
   */
  function initStorySelection() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramStory = (urlParams.get('story') || urlParams.get('libro') || '').toLowerCase().trim();

    // Check if story cards exist in DOM. If empty container exists, auto-populate
    populateStoryCardsIfEmpty();

    // Set initial story (?story=clave o ?libro=Título del libro, como llega
    // desde las tarjetas de la portada).
    let initialStory = 'superheroe';
    const fromParam = resolveStoryParam(paramStory);
    if (fromParam) {
      initialStory = fromParam;
    }
    selectStory(initialStory, false);

    // Setup event listeners on story cards
    document.querySelectorAll('.story-card, [data-story], .book-option[data-book]').forEach((card) => {
      const storyId = card.getAttribute('data-story') || card.getAttribute('data-book');

      card.addEventListener('click', (e) => {
        e.preventDefault();
        if (storyId) selectStory(storyId, true);
      });

      // Teclado: estas tarjetas son role="radio", así que Enter y Espacio deben
      // elegirlas igual que un clic (en móvil también sirve para lectores de pantalla).
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          if (storyId) selectStory(storyId, true);
        }
      });
    });

    // Setup custom story textarea listener
    const customTextarea = getCustomStoryEl();
    if (customTextarea) {
      customTextarea.addEventListener('input', () => {
        state.customStoryText = sanitizeInput(customTextarea.value);
        clearFieldError(customTextarea);
        updateOrderSummary();
      });
    }

    // El textarea debe empezar oculto hasta que se elija la historia personalizada
    toggleCustomStoryContainer(state.isCustomStory);
  }

  /**
   * Textarea de la historia personalizada. En el HTML se llama
   * #custom-story-desc (antes se buscaba "custom-story" / "book-description",
   * que no existían, así que el texto nunca se validaba ni salía en el resumen).
   */
  function getCustomStoryEl() {
    return document.getElementById('custom-story-desc') ||
           getEl('custom-story') ||
           getEl('book-description');
  }

  /**
   * Acepta tanto la clave de la historia ("espacio") como su título
   * ("Aventura en el Espacio") y devuelve la clave que existe en STORIES.
   */
  function resolveStoryParam(raw) {
    if (!raw) return null;

    const normalize = (s) => String(s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

    const wanted = normalize(raw);
    if (!wanted) return null;

    // Clave directa (incluye el alias antiguo "personalizada")
    if (STORIES[raw]) return raw;
    if (raw === 'personalizada' || raw === 'custom') return 'custom';

    // Título en español o en el idioma actual
    const match = Object.keys(STORIES).find((key) => {
      const story = STORIES[key];
      const titles = [story.title.es, t(`story.${key}.title`, story.title.es), key];
      return titles.some((title) => normalize(title) === wanted);
    });

    return match || null;
  }

  /**
   * Auto-renders story cards if a container exists but is empty
   */
  function populateStoryCardsIfEmpty() {
    const grid = document.querySelector('.story-grid, #story-grid, .book-grid, #book-selector .book-grid');
    if (!grid) return;

    // If grid already has cards, don't overwrite
    if (grid.querySelectorAll('.story-card, [data-story], .book-option').length > 0) return;

    const cardsHtml = Object.values(STORIES).map((story) => {
      const title = t(`story.${story.id}.title`, story.title.es);
      const desc = t(`story.${story.id}.desc`, story.desc.es);
      const isCustom = story.id === 'custom';

      return `
        <div class="story-card" data-story="${story.id}" role="button" tabindex="0" aria-label="${title}">
          <span class="story-card-check">✓</span>
          <div style="font-size: 28px; line-height: 1; margin-bottom: 4px;">${story.icon}</div>
          <h4 class="story-title" style="font-size: 15px; font-weight: 800; color: #1f2937; margin: 0;">${title}</h4>
          <p class="story-desc" style="font-size: 12px; color: #6b7280; margin: 0; line-height: 1.4;">${desc}</p>
          ${isCustom ? '<span style="display:inline-block; font-size:10px; font-weight:800; color:#ec4899; text-transform:uppercase; margin-top:4px;">Tu propia idea ✍️</span>' : ''}
        </div>
      `;
    }).join('');

    grid.innerHTML = cardsHtml;
  }

  /**
   * Selects a story, toggles custom story field, and updates summary
   */
  function selectStory(storyId, animated = true) {
    // La tarjeta del HTML se llamaba "personalizada" pero el estado/diccionario
    // usa "custom": al pulsarla no coincidía con nada y volvía a la primera
    // historia, así que era imposible pedir una historia personalizada.
    if (storyId === 'personalizada') storyId = 'custom';
    if (!STORIES[storyId]) storyId = 'superheroe';

    state.selectedStoryKey = storyId;
    state.isCustomStory = storyId === 'custom';

    // Update active class on story cards
    document.querySelectorAll('.story-card, [data-story], .book-option[data-book]').forEach((card) => {
      const cardId = card.getAttribute('data-story') || card.getAttribute('data-book');
      const isMatch = cardId === storyId;
      card.classList.toggle('selected', isMatch);
      card.setAttribute('aria-selected', String(isMatch));

      if (isMatch && animated) {
        card.classList.add('lm-shake');
        setTimeout(() => card.classList.remove('lm-shake'), 400);
      }
    });

    // Show/Hide custom story textarea container
    toggleCustomStoryContainer(state.isCustomStory);

    // La tarjeta también es un radio: aria-checked es lo que leen los lectores
    document.querySelectorAll('.story-card').forEach((card) => {
      const id = card.getAttribute('data-story');
      card.setAttribute('aria-checked', String(id === storyId));
    });

    updateOrderSummary();
  }

  /**
   * Shows or hides the custom story textarea container
   */
  function toggleCustomStoryContainer(show) {
    const container = document.getElementById('custom-story-box') ||
                      document.getElementById('custom-story-container') ||
                      document.getElementById('custom-story-group') ||
                      document.querySelector('.custom-story-box') ||
                      document.querySelector('.custom-story-group') ||
                      (getEl('custom-story') ? getEl('custom-story').closest('.form-group') : null);

    if (!container) return;

    // `hidden` es más barato que escribir display a mano y evita que el
    // textarea se vea antes de elegir historia.
    container.hidden = !show;
    container.classList.toggle('hidden', !show);

    const textarea = container.querySelector('textarea');
    if (!textarea) return;

    if (show) {
      // Solo se enfoca en escritorio: en móvil abriría el teclado y taparía
      // la historia recién elegida.
      if (window.matchMedia('(min-width: 769px)').matches) {
        setTimeout(() => textarea.focus({ preventScroll: true }), 120);
      }
    } else {
      clearFieldError(textarea);
    }
  }

  /* ==========================================================================
     9. REAL-TIME ORDER SUMMARY UPDATES
     ========================================================================== */

  /**
   * Binds form input change listeners for instant summary updates
   */
  function initFormListeners() {
    const inputsToWatch = [
      { id: 'child-name', prop: 'childName' },
      { id: 'child-age', prop: 'childAge' },
      { id: 'parent-email', prop: 'parentEmail' },
      { id: 'email', prop: 'parentEmail' },
      { id: 'parent-phone', prop: 'parentPhone' },
      { id: 'phone', prop: 'parentPhone' },
      { id: 'parent-name', prop: 'parentName' },
      { id: 'dedication', prop: 'dedication' },
      // El país real se llama parent-country ("country" no existía en el HTML)
      { id: 'parent-country', prop: 'country' },
      { id: 'child-gender', prop: 'gender' },
      // Los id reales del HTML son hair-color / skin-tone / eye-color: con los
      // nombres child-hair / child-skin / child-eyes el estado nunca guardaba
      // el color y el pedido llegaba sin esos datos.
      { id: 'hair-color', prop: 'hair' },
      { id: 'skin-tone', prop: 'skin' },
      { id: 'eye-color', prop: 'eyes' }
    ];

    inputsToWatch.forEach(({ id, prop }) => {
      const el = getEl(id);
      if (el) {
        const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
        el.addEventListener(eventName, () => {
          state[prop] = sanitizeInput(el.value);
          clearFieldError(el);
          updateOrderSummary();
        });
      }
    });
  }

  /* ==========================================================================
     9-bis. GÉNERO Y MUESTRAS DE TONO DE PIEL
     ========================================================================== */

  /**
   * Botones de género (Niño / Niña / No especificar).
   *
   * NO tenían ningún listener en toda la página: al pulsarlos no pasaba nada
   * (el toque se sentía "pegado") y el género nunca se guardaba en el pedido,
   * aunque el HTML lo marcaba como campo obligatorio.
   */
  function initGenderSelector() {
    const group = document.querySelector('.gender-options');
    if (!group) return;

    const hidden = document.getElementById('child-gender');
    const buttons = Array.prototype.slice.call(group.querySelectorAll('.gender-btn'));
    if (!buttons.length) return;

    function select(value, persist) {
      if (!value) return;

      // Una sola pasada de clases: sin re-render ni animaciones de sombra,
      // el toque responde en el mismo frame.
      buttons.forEach((btn) => {
        const active = btn.getAttribute('data-value') === value;
        btn.classList.toggle('selected', active);
        btn.setAttribute('aria-pressed', String(active));
        btn.tabIndex = active ? 0 : -1;
      });

      if (hidden) hidden.value = value;
      state.gender = value;

      if (persist) {
        if (hidden) clearFieldError(hidden);
        updateOrderSummary();
      }
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        select(btn.getAttribute('data-value'), true);
      });

      // Teclado: flechas izquierda/derecha como en un radiogroup
      btn.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const index = buttons.indexOf(btn);
        const step = e.key === 'ArrowRight' ? 1 : buttons.length - 1;
        const next = buttons[(index + step) % buttons.length];
        select(next.getAttribute('data-value'), true);
        next.focus({ preventScroll: true });
      });
    });

    select((hidden && hidden.value) || state.gender || 'nino', false);
  }

  /**
   * Las muestras redondas del tono de piel eran <div> sin ningún listener: al
   * pulsarlas no pasaba nada ("se queda pegada") y el color nunca llegaba al
   * pedido. Aquí se conectan con el <select> en los dos sentidos.
   */
  function initSkinToneSwatches() {
    const wrap = document.getElementById('skin-tone-swatches');
    const select = document.getElementById('skin-tone');
    if (!wrap) return;

    const label = document.getElementById('skin-tone-current-label');
    const swatches = Array.prototype.slice.call(wrap.querySelectorAll('.skin-swatch'));

    function sync(value) {
      if (!value) value = 'claro';
      let activeLabel = '';

      swatches.forEach((sw) => {
        const on = sw.dataset.value === value;
        // classList.toggle + aria en la misma pasada: sin re-render, sin lag
        sw.classList.toggle('selected', on);
        sw.setAttribute('aria-pressed', String(on));
        sw.setAttribute('tabindex', on ? '0' : '-1');
        if (on) activeLabel = sw.dataset.label || sw.getAttribute('aria-label') || '';
      });

      if (label && activeLabel) label.textContent = activeLabel;
      if (select && select.value !== value) select.value = value;
      if (select) clearFieldError(select);
      state.skin = value;
    }

    swatches.forEach((sw) => {
      sw.addEventListener('click', (e) => {
        e.preventDefault();
        sync(sw.dataset.value);
      });

      // Navegación con teclado entre muestras (izquierda/derecha)
      sw.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const index = swatches.indexOf(sw);
        const next = swatches[(index + (e.key === 'ArrowRight' ? 1 : swatches.length - 1)) % swatches.length];
        sync(next.dataset.value);
        next.focus({ preventScroll: true });
      });
    });

    if (select) {
      select.addEventListener('change', () => sync(select.value));
    }

    sync(select ? select.value : 'claro');
  }

  /**
   * Synchronizes the Order Summary card with current user selections
   */
  function updateOrderSummary() {
    const plan = state.selectedPlan || PLANS.familiar;
    const planKey = state.selectedPlanKey || 'familiar';
    const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.es;

    // 1. Plan Name
    const localizedPlanName = dict[`plan.${planKey}.name`] || plan.name;
    const summaryPlanEl = getEl('summary-plan-name') ||
                          document.querySelector('.summary-plan-name, .plan-summary .plan-name, #order-summary-plan');
    if (summaryPlanEl) {
      summaryPlanEl.textContent = localizedPlanName;
    }

    // El badge del resumen también debe cambiar con el plan (antes se quedaba
    // siempre en "Familiar (3 Ebooks)")
    const summaryBadgeEl = getEl('summary-plan-badge');
    if (summaryBadgeEl) {
      summaryBadgeEl.textContent = `${localizedPlanName} (${plan.books} Ebooks)`;
    }

    // 2. Plan Price
    // Los importes visibles del resumen usan ids distintos a los que buscaba
    // esta función (summary-subtotal-val / summary-total-val), así que el total
    // se quedaba en $24.99 aunque se eligiera Premium: ahora sí se actualiza.
    const formattedPrice = `$${plan.price.toFixed(2)}`;
    const summaryPriceEl = getEl('summary-price') ||
                           getEl('summary-subtotal-val') ||
                           document.querySelector('.summary-price, .plan-summary .plan-price, #order-summary-price');
    if (summaryPriceEl) {
      summaryPriceEl.textContent = formattedPrice;
    }

    const summaryTotalEl = getEl('summary-total') ||
                           getEl('summary-total-val') ||
                           document.querySelector('.summary-total, #order-summary-total');
    if (summaryTotalEl) {
      // El total lleva el sufijo de moneda en el diseño actual
      summaryTotalEl.textContent = `${formattedPrice} USD`;
    }

    // 3. Child Name
    const childInput = getEl('child-name') || getEl('childName');
    const childName = childInput ? sanitizeInput(childInput.value) : state.childName;
    const summaryChildEl = getEl('summary-child-name') ||
                           document.querySelector('.summary-child-name, #order-summary-child, #summary-child');
    if (summaryChildEl) {
      summaryChildEl.textContent = childName || dict['summary.not_specified'] || 'Sin definir';
    }

    // 4. Selected Story
    let storyName = '';
    if (state.isCustomStory) {
      const customInput = getCustomStoryEl();
      const text = customInput ? sanitizeInput(customInput.value) : state.customStoryText;
      if (text) {
        storyName = text.length > 28 ? `${text.substring(0, 25)}...` : text;
      } else {
        storyName = dict['story.custom.title'] || 'Historia Personalizada';
      }
    } else {
      storyName = dict[`story.${state.selectedStoryKey}.title`] ||
                  (STORIES[state.selectedStoryKey] ? STORIES[state.selectedStoryKey].title.es : 'Mi Super Aventura');
    }

    const summaryStoryEl = getEl('summary-story') ||
                           getEl('summary-story-name') ||
                           document.querySelector('.summary-story, #order-summary-story');
    if (summaryStoryEl) {
      summaryStoryEl.textContent = storyName;
    }

    // Miniatura del resumen: debe mostrar la portada de la historia elegida
    updateSummaryCover();

    // Aviso de ebooks incluidos según el plan
    updateBundleTip();

    // 5. Books Count
    const summaryBooksEl = getEl('summary-books') ||
                           document.querySelector('.plan-books-count, #summary-books-count');
    if (summaryBooksEl) {
      summaryBooksEl.textContent = plan.books;
    }

    // 6. PayPal button static fallback label
    const payLabel = document.querySelector('.paypal-btn-label, #paypal-btn-label');
    if (payLabel) {
      payLabel.textContent = `${dict['btn.pay'] || 'Pagar con PayPal'} - ${formattedPrice}`;
    }

    // 7. Dynamic Features List update in summary if element exists
    const featuresList = getEl('summary-features') || document.querySelector('.summary-features-list');
    if (featuresList) {
      const f1 = dict[`plan.${planKey}.f1`] || plan.features[0];
      const f2 = dict[`plan.${planKey}.f2`] || plan.features[1];
      const f3 = dict[`plan.${planKey}.f3`] || plan.features[2];
      featuresList.innerHTML = `
        <li><span style="color:#22c55e;">✓</span> ${escapeHtml(f1)}</li>
        <li><span style="color:#22c55e;">✓</span> ${escapeHtml(f2)}</li>
        <li><span style="color:#22c55e;">✓</span> ${escapeHtml(f3)}</li>
      `;
    }
  }

  /* Portadas de la colección, para la miniatura del resumen */
  const STORY_COVERS = {
    superheroe: 'cover-superhero',
    princesa: 'cover-princess',
    espacio: 'cover-space',
    bosque: 'cover-forest',
    colores: 'cover-colors',
    receta: 'cover-recipe'
  };

  /**
   * El aviso de "tu plan incluye N ebooks" era fijo: con Premium seguía
   * diciendo 3 ebooks (y con Básico, 1 libro, no aplica).
   */
  function updateBundleTip() {
    const box = document.getElementById('bundle-tip-box');
    const text = document.getElementById('bundle-tip-text');
    if (!box || !text) return;

    const books = (state.selectedPlan && state.selectedPlan.books) || 1;
    if (books <= 1) {
      box.hidden = true;
      return;
    }

    box.hidden = false;
    const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.es;
    const key = books >= 5 ? 'bundle_tip_premium' : 'bundle_tip_familiar';
    text.textContent = dict[key] || TRANSLATIONS.es[key] || '';
  }

  /**
   * Cambia la portada del resumen según la historia elegida (antes siempre se
   * veía la del superhéroe, aunque el cliente eligiera princesa o espacio).
   */
  function updateSummaryCover() {
    const wrap = document.getElementById('summary-preview-img-wrap');
    if (!wrap) return;

    const img = wrap.querySelector('img');
    const cover = STORY_COVERS[state.selectedStoryKey];

    if (!cover) {
      // Historia personalizada: todavía no hay portada que mostrar
      if (img) img.style.visibility = 'hidden';
      wrap.classList.add('preview-thumb--custom');
      return;
    }

    wrap.classList.remove('preview-thumb--custom');
    if (img) {
      img.style.visibility = '';
      if (!img.src.endsWith(`${cover}.jpg`) && !img.src.endsWith(`${cover}.webp`)) {
        const source = wrap.querySelector('picture source');
        if (source) source.srcset = `images/${cover}.webp`;
        img.src = `images/${cover}.jpg`;
        const story = STORIES[state.selectedStoryKey];
        if (story) img.alt = story.title.es;
      }
    }
  }

  /* ==========================================================================
     10. FORM VALIDATION WITH INLINE ERRORS & SMOOTH SCROLL
     ========================================================================== */

  /**
   * Displays an inline error message and highlights the field in red
   */
  function showFieldError(fieldEl, messageKey) {
    if (!fieldEl) return;

    fieldEl.classList.add('input-error');
    const group = fieldEl.closest('.form-group') || fieldEl.parentElement;

    if (group) {
      group.classList.add('has-error');

      let errorMsgEl = group.querySelector('.form-field-error');
      if (!errorMsgEl) {
        errorMsgEl = document.createElement('div');
        errorMsgEl.className = 'form-field-error';
        errorMsgEl.setAttribute('role', 'alert');
        group.appendChild(errorMsgEl);
      }

      errorMsgEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>${escapeHtml(t(messageKey))}</span>
      `;
    }
  }

  /**
   * Clears inline error styling from a field
   */
  function clearFieldError(fieldEl) {
    if (!fieldEl) return;

    fieldEl.classList.remove('input-error');
    const group = fieldEl.closest('.form-group') || fieldEl.parentElement;

    if (group) {
      group.classList.remove('has-error');
      const errorMsgEl = group.querySelector('.form-field-error');
      if (errorMsgEl) errorMsgEl.remove();
    }
  }

  /**
   * Resumen de errores junto al botón de pago. El aviso existía en el HTML
   * pero ningún código lo mostraba (display:none sin la clase .show), así que
   * el cliente no sabía qué le faltaba rellenar.
   */
  function showValidationSummary(messages) {
    const box = document.getElementById('form-alert-msg');
    if (!box) return;

    if (!messages || !messages.length) {
      box.classList.remove('show');
      box.textContent = '';
      return;
    }

    box.textContent = '⚠️ ' + messages.join(' · ');
    box.classList.add('show');
  }

  /**
   * Validates all required form fields. Returns true if valid, false otherwise.
   */
  function validateForm(shouldScroll = true) {
    let isValid = true;
    let firstErrorField = null;
    const missing = [];

    // Helper to test and flag
    function check(condition, fieldEl, errorKey) {
      if (!fieldEl) return;
      if (!condition) {
        showFieldError(fieldEl, errorKey);
        isValid = false;
        if (!firstErrorField) firstErrorField = fieldEl;
        if (errorKey) missing.push(t(errorKey));
      } else {
        clearFieldError(fieldEl);
      }
    }

    // 1. Child Name (required, min 2 chars)
    const childNameEl = getEl('child-name') || getEl('childName');
    if (childNameEl) {
      const val = sanitizeInput(childNameEl.value);
      check(val.length >= 2, childNameEl, 'error.child_name');
    }

    // 2. Child Age (required, 0-14)
    const childAgeEl = getEl('child-age') || getEl('childAge');
    if (childAgeEl) {
      const val = parseInt(childAgeEl.value, 10);
      check(!isNaN(val) && val >= 0 && val <= 14, childAgeEl, 'error.age');
    }

    // 3. Parent Email (required, valid email)
    const emailEl = getEl('parent-email') || getEl('email');
    if (emailEl) {
      const emailVal = sanitizeInput(emailEl.value);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      check(emailRegex.test(emailVal), emailEl, 'error.email');
    }

    // 4. Parent Phone / WhatsApp (required, min 6 digits)
    const phoneEl = getEl('parent-phone') || getEl('phone');
    if (phoneEl) {
      const phoneVal = sanitizeInput(phoneEl.value).replace(/[\s\-\(\)\+]/g, '');
      check(phoneVal.length >= 6, phoneEl, 'error.phone');
    }

    // 5. Parent Name (if input exists in DOM)
    const parentNameEl = getEl('parent-name') || getEl('parentName');
    if (parentNameEl && parentNameEl.hasAttribute('required')) {
      const parentNameVal = sanitizeInput(parentNameEl.value);
      check(parentNameVal.length >= 2, parentNameEl, 'error.parent_name');
    }

    // 6. Custom Story (if custom story is selected, min 10 chars)
    if (state.isCustomStory) {
      const customStoryEl = getCustomStoryEl();
      if (customStoryEl) {
        const storyVal = sanitizeInput(customStoryEl.value);
        check(storyVal.length >= 10, customStoryEl, 'error.custom_story');
      }
    }

    // Aviso resumido junto al botón de PayPal
    showValidationSummary(missing);

    // 7. Smooth scroll to first invalid field
    if (!isValid && shouldScroll && firstErrorField) {
      firstErrorField.classList.add('lm-shake');
      setTimeout(() => firstErrorField.classList.remove('lm-shake'), 450);

      firstErrorField.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      setTimeout(() => firstErrorField.focus(), 350);
    }

    return isValid;
  }

  /* ==========================================================================
     11. PAYPAL SMART BUTTONS INTEGRATION
     ========================================================================== */

  /**
   * Initializes PayPal Smart Payment Buttons or polls for SDK
   */
  /**
   * PayPal Smart Buttons: SDK cargado bajo demanda.
   *
   * El SDK venía en el <head> de order.html y era render-blocking: el navegador
   * no pintaba NADA hasta descargarlo de paypal.com (cientos de KB, sobre todo
   * lento en datos móviles). Ahora se pide cuando la zona de pago está a punto
   * de entrar en pantalla.
   */
  var PAYPAL_SDK_URL = 'https://www.paypal.com/sdk/js?client-id=AWsaRUnJ7rxP4ZEkJXxRG-Xe5VWptfmuKbQu13P4kkbwyKV8zRIsZV7rHiYlbeArxgIrzNDtBILh9HL5&currency=USD';
  var paypalSdkPromise = null;

  function loadPayPalSdk() {
    if (window.paypal && typeof window.paypal.Buttons === 'function') {
      return Promise.resolve();
    }
    if (paypalSdkPromise) return paypalSdkPromise;

    paypalSdkPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = PAYPAL_SDK_URL;
      script.async = true;
      var settled = false;

      script.onload = function () {
        settled = true;
        if (window.paypal && typeof window.paypal.Buttons === 'function') resolve();
        else reject(new Error('PayPal SDK sin botones'));
      };
      script.onerror = function () {
        settled = true;
        reject(new Error('No se pudo cargar el SDK de PayPal'));
      };

      document.head.appendChild(script);

      // Red móvil lenta: no dejamos al cliente esperando un botón que nunca llega.
      setTimeout(function () {
        if (!settled) reject(new Error('Tiempo de espera de PayPal agotado'));
      }, 15000);
    });

    return paypalSdkPromise;
  }

  function showPayPalPlaceholder(container) {
    if (!container || container.querySelector('[data-paypal-placeholder]')) return;
    container.innerHTML = '' +
      '<div class="paypal-skeleton" data-paypal-placeholder>' +
        '<span class="lm-spinner" aria-hidden="true"></span>' +
        '<span>' + escapeHtml(t('btn.pay', 'Pagar con PayPal')) + '</span>' +
      '</div>';
  }

  function initPayPal() {
    let container = document.getElementById('paypal-button-container');

    // If container doesn't exist yet, create or adapt around #paypal-btn
    if (!container) {
      const existingBtn = document.getElementById('paypal-btn');
      if (existingBtn && existingBtn.parentElement) {
        container = document.createElement('div');
        container.id = 'paypal-button-container';
        container.style.marginTop = '16px';
        existingBtn.parentElement.insertBefore(container, existingBtn);
      }
    }

    if (!container) return;

    var start = function () {
      showPayPalPlaceholder(container);
      loadPayPalSdk()
        .then(function () { renderPayPalButtons(container); })
        .catch(function (err) {
          console.warn('PayPal no disponible:', err && err.message);
          setupFallbackPaymentButton(container);
        });
    };

    // Cargar solo cuando el bloque de pago se acerque a la pantalla.
    var started = false;
    var begin = function () {
      if (started) return;
      started = true;
      // Al llegar aquí ya no hace falta observar ni escuchar más
      if (window.__lmPaypalInteraction) {
        window.removeEventListener('scroll', window.__lmPaypalInteraction);
        window.removeEventListener('touchstart', window.__lmPaypalInteraction);
        window.removeEventListener('pointerdown', window.__lmPaypalInteraction);
      }
      start();
    };

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          observer.disconnect();
          begin();
        }
      }, { rootMargin: '400px 0px' });
      observer.observe(container);
    } else {
      begin();
    }

    // Precarga al primer gesto del usuario (scroll/touch): así, cuando llega
    // al botón de pago, el SDK ya está descargado y los botones aparecen
    // sin esperar. El script es async, no bloquea el primer pintado.
    window.__lmPaypalInteraction = function () {
      begin();
    };
    window.addEventListener('scroll', window.__lmPaypalInteraction, { passive: true });
    window.addEventListener('touchstart', window.__lmPaypalInteraction, { passive: true });
    window.addEventListener('pointerdown', window.__lmPaypalInteraction, { passive: true });
  }

  /**
   * Renders the official PayPal Smart Payment Buttons
   */
  function renderPayPalButtons(container) {
    if (state.isPayPalRendered) return;

    try {
      container.innerHTML = ''; // Clear container

      state.paypalButtonInstance = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'pill',
          label: 'pay'
        },

        // Si faltan datos no se abre la ventana de PayPal: el aviso se queda
        // en la propia página. Antes se abría, el cliente iniciaba sesión y
        // entonces le devolvía el error — justo lo que parecía "raro".
        onClick: function (data, actions) {
          try {
            if (validateForm(true)) {
              if (actions && typeof actions.resolve === 'function') return actions.resolve();
              return undefined;
            }
            if (actions && typeof actions.reject === 'function') return actions.reject();
            // Sin reject disponible: seguimos igual que antes y createOrder
            // vuelve a validar antes de crear el cobro.
            return undefined;
          } catch (e) {
            return undefined;
          }
        },

        createOrder: function (data, actions) {
          // Validate form first before proceeding with payment
          const isFormValid = validateForm(true);
          if (!isFormValid) {
            if (actions && typeof actions.reject === 'function') {
              return actions.reject();
            }
            return false;
          }

          const selectedPlan = state.selectedPlan || PLANS.familiar;

          return actions.order.create({
            // Un producto digital: NO_SHIPPING le dice a PayPal que no pregunte
            // la dirección de envío en su propia pantalla de pago, que era el
            // paso de más que hacía que el pago pareciera muy largo.
            application_context: {
              brand_name: 'Libros Magicos',
              shipping_preference: 'NO_SHIPPING',
              user_action: 'PAY_NOW'
            },
            purchase_units: [
              {
                description: `Libros Mágicos - Plan ${selectedPlan.name}`,
                shipping_preference: 'NO_SHIPPING',
                amount: {
                  value: selectedPlan.price.toFixed(2),
                  currency_code: 'USD'
                }
              }
            ]
          });
        },

        onApprove: function (data, actions) {
          showPayPalLoading(true);

          return actions.order.capture().then(function (details) {
            showPayPalLoading(false);
            showSuccess(details);
          }).catch(function (err) {
            showPayPalLoading(false);
            showError(err);
          });
        },

        onError: function (err) {
          showPayPalLoading(false);
          showError(err);
        }
      });

      state.paypalButtonInstance.render('#paypal-button-container');
      state.isPayPalRendered = true;

      // Hide old static fallback button if present
      const staticBtn = document.getElementById('paypal-btn');
      if (staticBtn) staticBtn.style.display = 'none';

    } catch (e) {
      console.warn('Error rendering PayPal buttons:', e);
      setupFallbackPaymentButton(container);
    }
  }

  /**
   * Fallback for offline/test environments without live PayPal SDK
   */
  function setupFallbackPaymentButton(container) {
    const staticBtn = document.getElementById('paypal-btn');
    if (!staticBtn && container) {
      container.innerHTML = `
        <button type="button" class="btn btn-primary btn-block" id="paypal-fallback-btn" style="
          width: 100%;
          background: linear-gradient(135deg, #0070ba, #003087);
          color: white;
          border-radius: 9999px;
          padding: 16px 24px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 112, 186, 0.35);
          transition: all 0.25s;
        ">
          <span>Pagar con PayPal</span>
        </button>
      `;

      const btn = document.getElementById('paypal-fallback-btn');
      if (btn) {
        btn.addEventListener('click', handleManualSubmit);
      }
    } else if (staticBtn) {
      staticBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleManualSubmit();
      });
    }
  }

  /**
   * Handles manual submission fallback
   */
  function handleManualSubmit() {
    if (!validateForm(true)) return;

    showPayPalLoading(true);

    setTimeout(() => {
      showPayPalLoading(false);
      const simulatedDetails = {
        id: 'PAYID-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        payer: {
          name: {
            given_name: getInputValue('parent-name') || getInputValue('child-name') || 'Amigo/a'
          },
          email_address: getInputValue('parent-email') || getInputValue('email') || 'cliente@ejemplo.com'
        }
      };
      showSuccess(simulatedDetails);
    }, 1200);
  }

  /**
   * Shows a loading overlay on the PayPal button container
   */
  function showPayPalLoading(show) {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    let overlay = document.getElementById('lm-paypal-loading');
    if (show) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'lm-paypal-loading';
        overlay.className = 'paypal-btn-loading-overlay';
        overlay.innerHTML = `
          <div class="lm-spinner"></div>
          <span>${escapeHtml(t('btn.processing'))}</span>
        `;
        container.parentElement.insertBefore(overlay, container);
      }
      container.style.opacity = '0.4';
      container.style.pointerEvents = 'none';
    } else {
      if (overlay) overlay.remove();
      container.style.opacity = '1';
      container.style.pointerEvents = 'auto';
    }
  }

  /**
   * Reads raw value from input element safely
   */
  function getInputValue(id) {
    const el = getEl(id);
    return el ? sanitizeInput(el.value) : '';
  }

  /* ==========================================================================
     12. SUCCESS SCREEN & ERROR HANDLERS
     ========================================================================== */

  /**
   * Renders the confirmation screen upon successful payment
   */
  function showSuccess(details) {
    const orderId = (details && (details.id || (details.purchase_units && details.purchase_units[0]?.payments?.captures && details.purchase_units[0].payments.captures[0]?.id))) ||
                    'LM-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const plan = state.selectedPlan || PLANS.familiar;
    const planKey = state.selectedPlanKey || 'familiar';
    const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.es;

    const childName = getInputValue('child-name') || state.childName || 'Protagonista';
    const childAge = getInputValue('child-age') || state.childAge || '5';
    const buyerEmail = (details.payer && details.payer.email_address) || getInputValue('parent-email') || getInputValue('email') || 'tu correo';
    const phone = getInputValue('parent-phone') || getInputValue('phone') || '';

    let storyTitle = '';
    if (state.isCustomStory) {
      storyTitle = dict['story.custom.title'] || 'Historia Personalizada';
    } else {
      storyTitle = dict[`story.${state.selectedStoryKey}.title`] || 'Aventura Mágica';
    }

    // Hide order form and plan selector
    const formSection = document.getElementById('order-form') || document.querySelector('.order-form');
    const planSelector = document.getElementById('plan-selector') || document.querySelector('.plan-selector');
    const header = document.querySelector('.order-section-header');

    if (formSection) formSection.style.display = 'none';
    if (planSelector) planSelector.style.display = 'none';

    // En esta página el formulario vive en .checkout-layout: se oculta entero
    // para que el cliente vea solo la confirmación y no el formulario otra vez.
    const checkoutLayout = document.querySelector('.checkout-layout');
    if (checkoutLayout) checkoutLayout.style.display = 'none';

    // WhatsApp confirmation URL
    const waText = encodeURIComponent(
      `¡Hola Libros Mágicos! Acabo de pagar mi pedido con ID: ${orderId}.\n\n` +
      `📖 Plan: ${plan.name} ($${plan.price.toFixed(2)})\n` +
      `👶 Niño/a: ${childName} (${childAge} años)\n` +
      `✨ Historia: ${storyTitle}\n` +
      `📧 Email: ${buyerEmail}`
    );
    const waUrl = `https://wa.me/573026456024?text=${waText}`;

    const successHtml = `
      <div class="order-success-screen" style="
        background: #ffffff;
        border: 2px solid #bbf7d0;
        border-radius: 28px;
        padding: 40px 32px;
        box-shadow: 0 20px 60px rgba(34, 197, 94, 0.18);
        text-align: center;
        max-width: 680px;
        margin: 20px auto 40px;
      ">
        <div style="
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #22c55e, #10b981);
          color: white;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.35);
          margin-bottom: 20px;
        ">✓</div>

        <h2 style="font-size: 26px; font-weight: 900; color: #1e1b4b; margin-bottom: 12px; line-height: 1.3;">
          ${escapeHtml(dict['success.title'])}
        </h2>

        <p style="font-size: 15px; color: #4b5563; margin-bottom: 24px; line-height: 1.5;">
          ${escapeHtml(dict['success.subtitle'])}
        </p>

        <!-- Order Summary Card -->
        <div style="
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 24px;
          text-align: left;
          margin-bottom: 28px;
        ">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e5e7eb; padding-bottom:12px; margin-bottom:16px;">
            <span style="font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
              ${escapeHtml(dict['success.order_id'])}
            </span>
            <span style="font-family: monospace; font-size: 14px; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 4px 10px; border-radius: 8px;">
              ${escapeHtml(orderId)}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; font-size: 14px; color: #374151;">
            <div>
              <strong style="color:#6b7280; display:block; font-size:11px; text-transform:uppercase;">${escapeHtml(dict['summary.plan'])}:</strong>
              <span style="font-weight:700; color:#1e1b4b;">${escapeHtml(dict[`plan.${planKey}.name`] || plan.name)} ($${plan.price.toFixed(2)})</span>
            </div>
            <div>
              <strong style="color:#6b7280; display:block; font-size:11px; text-transform:uppercase;">${escapeHtml(dict['summary.child'])}:</strong>
              <span style="font-weight:700; color:#1e1b4b;">${escapeHtml(childName)} (${escapeHtml(childAge)} años)</span>
            </div>
            <div>
              <strong style="color:#6b7280; display:block; font-size:11px; text-transform:uppercase;">${escapeHtml(dict['summary.story'])}:</strong>
              <span style="font-weight:700; color:#1e1b4b;">${escapeHtml(storyTitle)}</span>
            </div>
            <div>
              <strong style="color:#6b7280; display:block; font-size:11px; text-transform:uppercase;">${escapeHtml(dict['form.email'])}:</strong>
              <span style="font-weight:700; color:#1e1b4b;">${escapeHtml(buyerEmail)}</span>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div style="text-align: left; margin-bottom: 28px;">
          <h4 style="font-size: 15px; font-weight: 800; color: #1f2937; margin-bottom: 12px;">
            ${escapeHtml(dict['success.next_steps'] || '¿Qué sucede ahora?')}
          </h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 14px; color: #4b5563;">
            <li style="display:flex; align-items:flex-start; gap:10px;">
              <span style="color:#22c55e; font-weight:bold;">1.</span>
              <span>${escapeHtml(dict['success.step1'])}</span>
            </li>
            <li style="display:flex; align-items:flex-start; gap:10px;">
              <span style="color:#22c55e; font-weight:bold;">2.</span>
              <span>${escapeHtml(dict['success.step2'])}</span>
            </li>
            <li style="display:flex; align-items:flex-start; gap:10px;">
              <span style="color:#22c55e; font-weight:bold;">3.</span>
              <span>${escapeHtml(dict['success.step3'])}</span>
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: #25D366;
            color: white;
            padding: 16px 24px;
            border-radius: 9999px;
            font-weight: 800;
            font-size: 15px;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.35);
            transition: all 0.25s;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.96 11.96 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.336 0-4.512-.728-6.299-1.969l-.44-.312-2.647.888.888-2.647-.312-.44A9.965 9.965 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
            <span>${escapeHtml(dict['success.whatsapp_btn'])}</span>
          </a>

          <a href="index.html" style="
            display: inline-block;
            font-size: 14px;
            font-weight: 700;
            color: #6b7280;
            text-decoration: none;
            padding: 10px;
          ">
            ${escapeHtml(dict['btn.back'] || 'Volver al Inicio')}
          </a>
        </div>
      </div>
    `;

    // Se inserta dentro del contenedor del checkout (antes se buscaba
    // ".order-section .container", que no existe en esta página, y terminaba
    // colgado del <body> sin márgenes: la tarjeta se salía de la pantalla y el
    // texto aparecía cortado en el móvil).
    const targetParent = document.querySelector('.checkout-container') ||
                         document.querySelector('main') ||
                         (formSection && formSection.parentElement) ||
                         document.body;

    const successWrap = document.createElement('div');
    successWrap.className = 'order-success-wrap';
    successWrap.innerHTML = successHtml;
    targetParent.appendChild(successWrap);

    // Scroll smoothly to success screen
    const successEl = document.querySelector('.order-success-screen');
    if (successEl) {
      successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Displays an inline error banner upon PayPal failure
   */
  function showError(err) {
    console.error('PayPal Order Error:', err);

    let errorBanner = document.getElementById('lm-order-error-banner');
    if (!errorBanner) {
      errorBanner = document.createElement('div');
      errorBanner.id = 'lm-order-error-banner';
      errorBanner.className = 'order-error-banner';

      const container = document.getElementById('paypal-button-container') || document.getElementById('order-form');
      if (container && container.parentElement) {
        container.parentElement.insertBefore(errorBanner, container);
      }
    }

    const dict = TRANSLATIONS[state.currentLang] || TRANSLATIONS.es;

    errorBanner.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <div style="flex:1;">
        <h4 style="font-size:15px; font-weight:800; color:#991b1b; margin:0 0 4px;">Error en el pago</h4>
        <p style="font-size:13px; color:#b91c1c; margin:0; line-height:1.4;">${escapeHtml(dict['error.paypal_generic'])}</p>
      </div>
      <button type="button" onclick="this.parentElement.remove()" style="background:none; border:none; cursor:pointer; font-size:16px; color:#991b1b; padding:0 4px;">✕</button>
    `;

    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ==========================================================================
     13. INITIALIZATION CONTROLLER
     ========================================================================== */

  function init() {
    injectHelperStyles();
    initLanguage();
    initPlanSelection();
    initStorySelection();
    initFormListeners();
    initGenderSelector();
    initSkinToneSwatches();
    initPayPal();
    updateOrderSummary();
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global controller for debugging / external triggers if needed
  window.LM_Order = {
    PLANS,
    STORIES,
    TRANSLATIONS,
    state,
    selectPlan,
    selectStory,
    setLanguage,
    validateForm,
    sanitizeInput,
    showSuccess
  };

})();
