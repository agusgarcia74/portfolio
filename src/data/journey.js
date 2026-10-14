// Recorrido: trabajo y estudio, en orden cronológico (del más viejo al más nuevo).
export const journey = [
  {
    kind: 'study',
    period: { es: '2009 — 2023', en: '2009 — 2023' },
    title: { es: 'Secundario, especialidad en Ciencias Económicas', en: 'High school, Economics track' },
    place: 'Instituto Francisco Luis Bernárdez',
    points: {
      es: ['Primer escolta de la bandera institucional (3.º y 4.º año) y de la bandera nacional (6.º año). Representante de curso.'],
      en: ['First flag escort of the school flag (3rd and 4th year) and the national flag (6th year). Class representative.'],
    },
  },
  {
    kind: 'study',
    period: { es: '2012 — 2023', en: '2012 — 2023' },
    title: { es: 'Inglés', en: 'English' },
    place: 'Highland School',
    points: {
      es: ['Once años de cursado. Nivel B2.'],
      en: ['Eleven years of study. B2 level.'],
    },
  },
  {
    kind: 'work',
    period: { es: 'Oct 2022', en: 'Oct 2022' },
    title: { es: 'Asistente del líder de finanzas', en: 'Finance Lead Assistant' },
    place: 'CrystalShips — Junior Achievement',
    points: {
      es: ['Emprendimiento estudiantil: análisis de ventas, presupuestos, registros contables y cálculo de beneficios.'],
      en: ['Student venture: sales analysis, budgeting, bookkeeping and profit calculation.'],
    },
  },
  {
    kind: 'work',
    period: { es: 'Jun 2023 — Jul 2023', en: 'Jun 2023 — Jul 2023' },
    title: { es: 'Pasante de Desarrollo de Software y Producto', en: 'Software & Product Development Intern' },
    place: 'Globant — Córdoba',
    points: {
      es: [
        'Programa intensivo de inmersión en el ciclo de vida completo del software (SDLC).',
        'Construimos en equipo un producto de gestión académica desde cero, de la definición al despliegue, en un entorno Agile con Trello.',
        'Product Discovery y diseño UX/UI: prototipos funcionales de alta fidelidad para problemas reales.',
      ],
      en: [
        'Intensive immersion program across the full software development lifecycle (SDLC).',
        'As a team we built an academic management product from scratch, from definition to deployment, in an Agile setup with Trello.',
        'Product Discovery and UX/UI design: high-fidelity functional prototypes for real problems.',
      ],
    },
  },
  {
    kind: 'study',
    period: { es: 'Mar 2024 — Nov 2027', en: 'Mar 2024 — Nov 2027' },
    title: { es: 'Licenciatura en Inteligencia Artificial', en: 'B.Sc. in Artificial Intelligence' },
    place: 'UTN — Universidad Tecnológica Nacional',
    points: {
      es: [
        'Modelos de lenguaje, aprendizaje automático y redes neuronales aplicados a problemas reales.',
        'Automatización de procesos con IA para ganar eficiencia y reducir errores en tareas repetitivas.',
        'Herramientas como scikit-learn, TensorFlow y PyTorch.',
      ],
      en: [
        'Language models, machine learning and neural networks applied to real problems.',
        'Process automation with AI to gain efficiency and reduce errors in repetitive work.',
        'Tools such as scikit-learn, TensorFlow and PyTorch.',
      ],
    },
  },
  {
    kind: 'study',
    period: { es: 'Mar 2024 — Nov 2028', en: 'Mar 2024 — Nov 2028' },
    title: { es: 'Ingeniería en Sistemas de Información', en: 'Information Systems Engineering' },
    place: 'UTN — Universidad Tecnológica Nacional, Córdoba',
    points: {
      es: [
        'Diseño, implementación y control de sistemas de información para organizaciones.',
        'Programación en distintos paradigmas: funcional, lógico y orientado a objetos.',
        'Análisis y diseño de sistemas: requerimientos, modelado, arquitectura, testing y puesta en producción.',
      ],
      en: [
        'Designing, implementing and controlling information systems for organizations.',
        'Programming across paradigms: functional, logic and object-oriented.',
        'Systems analysis and design: requirements, modeling, architecture, testing and going to production.',
      ],
    },
  },
]

export const process = [
  {
    title: { es: 'Escuchar', en: 'Listen' },
    detail: {
      es: 'Primero el problema, con quien lo sufre: qué hace hoy, qué se le escapa y qué significa que funcione.',
      en: 'The problem first, with whoever suffers it: what they do today, what slips through and what "working" means.',
    },
    example: {
      es: 'UTN Manager nació de perderme avisos repartidos entre dos plataformas.',
      en: 'UTN Manager was born from missing notices spread across two platforms.',
    },
  },
  {
    title: { es: 'Modelar', en: 'Model' },
    detail: {
      es: 'Datos, reglas y contrato de la API antes de la primera pantalla. Lo difícil se decide en papel.',
      en: 'Data, rules and API contract before the first screen. The hard parts get decided on paper.',
    },
    example: {
      es: 'Orden 66: cupos diarios, roles y estados de pedido salidos de las reglas reales del negocio.',
      en: 'Orden 66: daily quotas, roles and order states taken from the real business rules.',
    },
  },
  {
    title: { es: 'Construir', en: 'Build' },
    detail: {
      es: 'Backend, frontend y lo que haga falta en el medio. Código legible, con tests donde importa.',
      en: 'Backend, frontend and whatever sits in between. Readable code, with tests where it matters.',
    },
    example: {
      es: 'PrintServer arma cada hoja con PyMuPDF y la manda a Windows por PowerShell.',
      en: 'PrintServer lays out every sheet with PyMuPDF and hands it to Windows through PowerShell.',
    },
  },
  {
    title: { es: 'Poner en marcha', en: 'Ship' },
    detail: {
      es: 'Servidores, dominios, certificados y tareas programadas. Tiene que andar fuera de mi máquina.',
      en: 'Servers, domains, certificates and scheduled tasks. It has to run outside my machine.',
    },
    example: {
      es: 'UTN Hub: VM en Oracle Cloud con reverse proxy y SSL, configurada desde cero.',
      en: 'UTN Hub: Oracle Cloud VM with reverse proxy and SSL, set up from scratch.',
    },
  },
  {
    title: { es: 'Mejorar', en: 'Improve' },
    detail: {
      es: 'Escucho a quien lo usa y mejoro lo que ya está andando, sin romper lo que funciona.',
      en: 'I listen to the people using it and improve what is live, without breaking what works.',
    },
    example: {
      es: 'El clasificador de UTN Manager guarda por qué decidió cada cosa, para corregirlo con datos.',
      en: "UTN Manager's classifier records why it decided each thing, so it can be fixed with data.",
    },
  },
]
