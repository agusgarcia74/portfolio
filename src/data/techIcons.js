import {
  siReact, siNextdotjs, siTypescript, siJavascript, siAstro, siVite, siTailwindcss, siHtml5, siCss,
  siFastapi, siNodedotjs, siExpress, siSpringboot, siPostgresql, siMysql, siSqlite,
  siSqlalchemy, siDocker, siGit, siGithubactions, siLinux, siVercel, siJira, siHaskell,
} from 'simple-icons'

// Logos de simple-icons. Los que no existen ahí llevan un dibujo propio simple.
const custom = (path, hex) => ({ path, hex, custom: true })
// Logos de varias partes: cada parte toma su color al pasar el mouse. `rest: 'bg'` = hueco (ojos, etc.).
const multi = (hex, parts) => ({ hex, parts })

const python = multi('3776AB', [
  { d: 'M11.9 2C6.8 2 7.1 4.2 7.1 4.2v2.3h4.9v.7H5.2S2 6.8 2 12s2.8 5 2.8 5h1.7v-2.4s-.1-2.8 2.8-2.8h4.8s2.7 0 2.7-2.6V4.8S17.2 2 11.9 2zM9.2 3.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z', c: '#3776AB' },
  { d: 'M12.1 22c5.1 0 4.8-2.2 4.8-2.2v-2.3H12v-.7h6.8S22 17.2 22 12s-2.8-5-2.8-5h-1.7v2.4s.1 2.8-2.8 2.8H9.9s-2.7 0-2.7 2.6v4.4S6.8 22 12.1 22zm2.7-1.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z', c: '#FFD43B' },
])

const java = multi('5382A1', [
  { d: 'M12.2 1.2c1.9 2-1.7 3.2-.2 5.3.5.7 1.5 1.4 1.5 2.4-1.3-1-3.1-1.7-3.1-3.4 0-1.7 2.2-2.5 1.8-4.3z', c: '#F89820' },
  { d: 'M15.4 4.2c.7 1.4-1.5 2.1-.6 3.6-1.3-.5-1.9-1.7-1.3-2.5.5-.7 1.5-.7 1.9-1.1z', c: '#F89820' },
  { d: 'M4.8 11.6h11.6v3.6a5.2 5.2 0 0 1-5.2 5.2H10a5.2 5.2 0 0 1-5.2-5.2zm11.6 1.1h1.3a2.6 2.6 0 0 1 0 5.2h-1.8l.5-1.7h1.3a.9.9 0 0 0 0-1.8h-1.3z', c: '#5382A1' },
  { d: 'M3 21.4h15.4v1.4H3z', c: '#5382A1' },
])

// Búho de SWI-Prolog: anillo plateado, curva azul, búho naranja con ojos grandes, pico y garras grises.
const prolog = multi('E8452C', [
  { d: 'M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22z', c: '#C9CDD2', rest: 'faint' },
  { d: 'M13.2 2.4a9.7 9.7 0 0 1 0 19.2 8.2 8.2 0 0 0 0-19.2z', c: '#1F4E79', rest: 'faint' },
  { d: 'M5.6 6.4l2.6 1.7c1.1-.5 2.4-.8 3.8-.8s2.7.3 3.8.8l2.6-1.7v9.2c0 3-2.8 5.2-6.4 5.2s-6.4-2.2-6.4-5.2z', c: '#EC5A2A' },
  { d: 'M9.2 9a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zm5.6 0a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z', c: '#FFFFFF', rest: 'bg' },
  { d: 'M9.4 10.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zm5.2 0a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z', c: '#222222' },
  { d: 'M12 12.7l1.3 1.2L12 16.2l-1.3-2.3z', c: '#9AA0A6', rest: 'bg' },
  { d: 'M7.4 15.2l.9.7.9-.7M7.6 16.6l.9.7.9-.7M14.8 15.2l.9.7.9-.7M14.6 16.6l.9.7.9-.7', c: '#A3261B', rest: 'bg', stroke: true },
  { d: 'M8.3 20.4a1.4 1.4 0 0 1 2.8 0zM12.9 20.4a1.4 1.4 0 0 1 2.8 0z', c: '#B5B9BE' },
])

export const techIcons = {
  React: siReact,
  'Next.js': siNextdotjs,
  'React Native': siReact,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Astro: siAstro,
  Vite: siVite,
  'Tailwind CSS': siTailwindcss,
  HTML: siHtml5,
  CSS: siCss,
  Python: python,
  FastAPI: siFastapi,
  'Node.js': siNodedotjs,
  Express: siExpress,
  Java: java,
  'Spring Boot': siSpringboot,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  // cilindro de base de datos
  'SQL Server': custom('M12 2C7 2 3 3.6 3 5.5v13C3 20.4 7 22 12 22s9-1.6 9-3.5v-13C21 3.6 17 2 12 2zm0 2c4.1 0 7 1.2 7 1.5S16.1 7 12 7 5 5.8 5 5.5 7.9 4 12 4zM5 8.2C6.7 8.9 9.2 9.3 12 9.3s5.3-.4 7-1.1v3.3c0 .3-2.9 1.5-7 1.5s-7-1.2-7-1.5zm0 6c1.7.7 4.2 1.1 7 1.1s5.3-.4 7-1.1v4.3c0 .3-2.9 1.5-7 1.5s-7-1.2-7-1.5z', 'CC2927'),
  SQLite: siSqlite,
  SQLAlchemy: siSqlalchemy,
  Docker: siDocker,
  Git: siGit,
  'GitHub Actions': siGithubactions,
  Linux: siLinux,
  // nube
  'Oracle Cloud': custom('M7 19a5 5 0 0 1-.9-9.9A6.5 6.5 0 0 1 18.6 9 4.5 4.5 0 0 1 18 19H7zm0-2h11a2.5 2.5 0 0 0 .3-5l-1.5-.2-.3-1.4a4.5 4.5 0 0 0-8.7-.5l-.4 1.1-1.2.2A3 3 0 0 0 7 17z', 'C74634'),
  Vercel: siVercel,
  Jira: siJira,
  Haskell: siHaskell,
  Prolog: prolog,
}
