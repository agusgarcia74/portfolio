// Catálogo de proyectos. `demo` elige el mini-demo interactivo que acompaña a cada uno
// (ver src/components/demos). Para sumar un proyecto nuevo alcanza con agregarlo acá.
// repo: string | { label, url }[] | null

export const featured = {
  id: 'utn-hub',
  title: 'UTN Hub',
  tagline: { es: 'La facultad, conectada.', en: 'University, connected.' },
  description: {
    es: 'Plataforma académica para estudiantes de la UTN que construimos en equipo. Centraliza la información institucional, el calendario de eventos y parciales, un repositorio colaborativo de apuntes y un gestor de notas que calcula promedios solo, con notificaciones. El backend corre en un servidor Ubuntu en Oracle Cloud que configuramos desde cero; el frontend se despliega en Vercel.',
    en: 'Academic platform for UTN students that we built as a team. It brings together institutional information, an events and exams calendar, a collaborative notes repository and a grade manager that computes averages on its own, with notifications. The backend runs on an Ubuntu server on Oracle Cloud we set up from scratch; the frontend deploys on Vercel.',
  },
  status: { es: 'En desarrollo', en: 'In development' },
  tech: ['React', 'Vite', 'Tailwind CSS', 'Django REST', 'PostgreSQL', 'JWT', 'Oracle Cloud', 'Nginx'],
  flow: [
    {
      id: 'client',
      name: { es: 'Navegador', en: 'Browser' },
      tech: 'React 19 · Vite · Tailwind',
      host: 'Vercel',
      detail: {
        es: 'La SPA se sirve desde Vercel. React Router resuelve la navegación, el estado vive en Context y cada pedido viaja con su token JWT.',
        en: 'The SPA is served from Vercel. React Router handles navigation, state lives in Context and every request carries its JWT.',
      },
    },
    {
      id: 'proxy',
      name: { es: 'Reverse proxy', en: 'Reverse proxy' },
      tech: 'Nginx · SSL/TLS',
      host: 'Oracle Cloud',
      detail: {
        es: 'Termina HTTPS con el certificado del dominio propio y reenvía el tráfico a la API dentro de la VM.',
        en: 'Terminates HTTPS with the custom domain certificate and forwards traffic to the API inside the VM.',
      },
    },
    {
      id: 'api',
      name: { es: 'API', en: 'API' },
      tech: 'Django REST · JWT',
      host: 'Oracle Cloud',
      detail: {
        es: 'Valida el token y resuelve el pedido en endpoints separados por dominio: calendario, apuntes, notas y notificaciones.',
        en: 'Validates the token and serves the request from endpoints split by domain: calendar, notes, grades and notifications.',
      },
    },
    {
      id: 'db',
      name: { es: 'Base de datos', en: 'Database' },
      tech: 'PostgreSQL',
      host: 'Oracle Cloud',
      detail: {
        es: 'Modelo relacional versionado con migraciones. Los promedios se calculan a partir de las notas guardadas.',
        en: 'Relational model versioned with migrations. Averages are computed from the stored grades.',
      },
    },
  ],
  image: '/projects/utnhub/utnhub-presentation.webp',
  gallery: [
    '/projects/utnhub/screen-2.webp',
    '/projects/utnhub/screen-1.webp',
    '/projects/utnhub/screen-3.webp',
    '/projects/utnhub/screen-4.webp',
    '/projects/utnhub/screen-5.webp',
    '/projects/utnhub/screen-6.webp',
    '/projects/utnhub/screen-7.webp',
  ],
  live: 'https://www.utnhub.com.ar',
  repo: null,
}

export const projects = [
  {
    id: 'utn-manager',
    title: 'UTN Manager',
    demo: 'manager',
    tagline: {
      es: 'Que ningún parcial se te pase.',
      en: 'So no exam slips past you.',
    },
    description: {
      es: 'Cada materia publica avisos en Moodle y los profes mandan mensajes por Autogestión. Revisar pestaña por pestaña todos los días es lento y es fácil perder una fecha. UTN Manager revisa las dos plataformas, detecta qué cambió y te arma un changelog agrupado por tema, con las evaluaciones siempre primero.',
      en: 'Every course posts notices on Moodle and professors send messages through Autogestión. Checking tab by tab every day is slow and it is easy to miss a date. UTN Manager checks both platforms, detects what changed and builds a changelog grouped by topic, with exams always first.',
    },
    features: {
      es: [
        'Sincroniza Moodle y Autogestión 4: materias, foros, avisos, recursos y entregas con fecha.',
        'Detector de cambios: qué es nuevo, qué se modificó (si se movió un parcial) y qué se eliminó.',
        'Clasificador por reglas con prioridad absoluta para evaluaciones, que guarda el motivo de cada decisión. Comparado contra scikit-learn.',
        'Bot de Telegram (/hoy, /evaluaciones, /novedades) y sincronización diaria programada.',
        'Agenda en Google Calendar lo que elijas, con el permiso más chico posible, y exporta las fechas a WhatsApp.',
        'Credenciales en el llavero del sistema, logs que nunca exponen secretos y API protegida contra DNS rebinding y CSRF.',
      ],
      en: [
        'Syncs Moodle and Autogestión 4: courses, forums, notices, resources and dated assignments.',
        'Change detector: what is new, what changed (if an exam moved) and what was removed.',
        'Rule-based classifier with absolute priority for exams that records the reason for every decision. Benchmarked against scikit-learn.',
        'Telegram bot (/hoy, /evaluaciones, /novedades) and a scheduled daily sync.',
        'Adds what you pick to Google Calendar with the smallest possible scope, and exports dates to WhatsApp.',
        'Credentials in the OS keychain, logs that never expose secrets and an API hardened against DNS rebinding and CSRF.',
      ],
    },
    status: { es: 'En desarrollo', en: 'In development' },
    tech: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'SQLite', 'React', 'TypeScript', 'Tailwind CSS', 'Typer', 'pytest', 'GitHub Actions'],
    live: null,
    repo: null,
    repoNote: { es: 'Repositorio privado', en: 'Private repository' },
  },
  {
    id: 'printserver',
    title: 'PrintServer',
    demo: 'print',
    tagline: {
      es: 'Imprimí desde el celular, sin cables ni drivers.',
      en: 'Print from your phone. No cables, no drivers.',
    },
    description: {
      es: 'Un servidor de impresión casero que convierte una impresora común en una impresora de red. Abrís la web app desde el celular, elegís los archivos y la PC se encarga de todo: convierte, arma las hojas y las manda a la cola de Windows. Se instala como app en la pantalla de inicio y arranca solo con la compu.',
      en: 'A home print server that turns an ordinary printer into a network printer. You open the web app on your phone, pick the files and the PC takes care of the rest: converts, lays out the sheets and sends them to the Windows queue. It installs as an app on the home screen and starts with the computer.',
    },
    features: {
      es: [
        'Imprime PDF, fotos, capturas, texto y documentos de Office (los convierte con LibreOffice).',
        'N páginas por hoja (1, 2, 4, 6 o 9), orientación, escala, rangos de páginas, calidad y tipo de papel.',
        'Doble faz manual en dos pasadas: imprime un lado, te avisa cuándo dar vuelta el papel y sigue.',
        'Vista previa de cada hoja antes de imprimir, historial y reimpresión con un toque.',
        'Monitorea la impresora y la cola de Windows; si el spooler se cae, lo levanta.',
        'Tarea programada con permisos de administrador y regla de firewall para la red privada.',
      ],
      en: [
        'Prints PDFs, photos, screenshots, text and Office documents (converted with LibreOffice).',
        'N pages per sheet (1, 2, 4, 6 or 9), orientation, scale, page ranges, quality and paper type.',
        'Manual two-pass duplex: prints one side, tells you when to flip the paper and carries on.',
        'Preview of every sheet before printing, history and one-tap reprint.',
        'Watches the printer and the Windows queue; if the spooler dies, it brings it back.',
        'Scheduled task with admin rights and a firewall rule for the private network.',
      ],
    },
    status: { es: 'En uso', en: 'In use' },
    role: { es: 'Proyecto propio', en: 'Solo project' },
    tech: ['Python', 'Flask', 'PyMuPDF', 'PowerShell', 'LibreOffice', 'JavaScript', 'PWA', 'Windows'],
    live: null,
    repo: null,
  },
  {
    id: 'gavia',
    title: 'Gavia',
    demo: 'gavia',
    tagline: {
      es: 'Estudio de software a medida, hecho en Córdoba.',
      en: 'Custom software studio, made in Córdoba.',
    },
    description: {
      es: 'Estudio de desarrollo que cofundamos con Vicente Aznar y Benjamín Viberti. Diseñamos, construimos y mantenemos sistemas para pymes y emprendedores en cinco etapas, con precio cerrado por etapa y el código siempre del cliente. La web está armada como una carta de navegación: cada proyecto es un recorrido con paradas.',
      en: 'Development studio we co-founded with Vicente Aznar and Benjamín Viberti. We design, build and maintain systems for small businesses in five stages, with a fixed price per stage and the code always owned by the client. The site is built as a navigation chart: every project is a route with stops.',
    },
    stops: [
      { es: 'Relevamiento', en: 'Discovery' },
      { es: 'Propuesta', en: 'Proposal' },
      { es: 'Desarrollo', en: 'Development' },
      { es: 'Puesta en marcha', en: 'Launch' },
      { es: 'Mantenimiento', en: 'Maintenance' },
    ],
    status: { es: 'En marcha', en: 'Active' },
    role: { es: 'Cofundador', en: 'Co-founder' },
    tech: ['Astro', 'TypeScript', 'MapLibre GL', 'Vercel'],
    images: ['/projects/gavia/inicio.webp', '/projects/gavia/proceso.webp', '/projects/gavia/flety.webp'],
    live: 'https://www.gaviasoftware.com',
    repo: 'https://github.com/Aznar-7/GAVIA',
  },
  {
    id: 'orden66',
    title: 'Orden 66 Viandas',
    demo: 'orden',
    tagline: {
      es: 'Pedidos de viandas con cupos diarios.',
      en: 'Meal orders with daily quotas.',
    },
    description: {
      es: 'Sistema de pedidos con control de cupos por día: autenticación JWT, roles de usuario y administrador, estados de pedido, validación de stock en el backend, historial de cambios, filtros y panel de administración. Pensado desde las reglas reales del negocio, con foco en seguridad y una arquitectura modular.',
      en: 'Ordering system with per-day quota control: JWT authentication, user and admin roles, order states, backend stock validation, change history, filters and an admin panel. Designed from the real business rules, focused on security and a modular architecture.',
    },
    status: { es: 'Terminado', en: 'Shipped' },
    role: { es: 'En equipo', en: 'Team project' },
    tech: ['React', 'Express', 'Node.js', 'Tailwind CSS', 'SQLite', 'JWT', 'Vercel', 'Render'],
    images: ['/projects/orden66/cover.webp', '/projects/orden66/menus.webp', '/projects/orden66/login.webp'],
    live: 'https://vianda-app-front.vercel.app/',
    repo: [
      { label: 'Frontend', url: 'https://github.com/Aznar-7/ViandaApp_Front' },
      { label: 'Backend', url: 'https://github.com/Aznar-7/ViandaApp_Back' },
    ],
  },
]
