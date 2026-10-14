# Portfolio — Juan Agustín García

React 19 + Vite, Motion para las animaciones, Lenis para el scroll suave y matter-js para la física del stack. Sin framework de CSS: todo en `src/styles.css` con tokens (modo oscuro y modo papel).

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # genera dist/ para Vercel o cualquier hosting estático
```

## Dónde se edita el contenido

Todo el texto vive en `src/data/` (en español e inglés):

| Archivo | Qué tiene |
|---|---|
| `site.js` | Nombre, mail, GitHub, LinkedIn, link al CV, foto y el ticket de "Sobre mí" |
| `projects.js` | Proyecto destacado (UTN Hub) y el resto de proyectos |
| `journey.js` | Recorrido (trabajo y estudio) y los pasos de "Cómo trabajo" |
| `stack.js` | Tecnologías por grupo |
| `ui.js` | Textos de interfaz y la lista de secretos |

Para sumar un proyecto, agregalo a `projects` en `projects.js`. Si querés que tenga una demo interactiva propia, creala en `src/components/demos/` y registrala en `DEMOS` dentro de `src/sections/Projects.jsx`.

Cuando esté el CV nuevo: copiá el PDF a `public/` y poné su ruta en `site.cv`. Lo mismo con `site.linkedin`.

## Detalles escondidos

- Fondo: bandada (boids) que esquiva el cursor; click la espanta.
- Cursor propio con estela de tinta y etiquetas según lo que señalás.
- El nombre del hero cambia de peso según la distancia al cursor.
- `/` abre una terminal (`help`, `mate`, `secretos`, `tema paper`…).
- Código Konami: modo turbo.
- 10 secretos con contador en la barra: terminal, Konami, 5 clicks en la foto, imprimir en la demo de PrintServer, agotar los cupos de Orden 66, tirar una ficha del stack fuera de la caja, modo papel, la garza del footer, click en Júpiter y dar vuelta el ticket.
- Respeta `prefers-reduced-motion`.

Las capturas de UTN Hub, Gavia y Orden 66 son las mismas que usa Vicente Aznar (proyectos compartidos).

## CV

El CV vive en `cv/` (`cv-es.html` + `cv.css`, una hoja A4). Para regenerar el PDF después de editarlo:

```bash
node cv/build.mjs es
```

Usa el Chrome o Edge instalado, deja el PDF en `public/cv/` (el botón "CV" del portfolio apunta ahí) y una vista previa en `cv/preview-es.png`. Si algo no entra en la hoja, el script avisa con un valor de `overflow` mayor a 0.
