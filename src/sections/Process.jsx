import { useEffect, useId, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useApp } from '../lib/app'
import { process } from '../data/journey'

// Scroll vertical que mueve los pasos en horizontal (sección fijada). Entre paso y paso
// se dibuja una flecha punteada a medida que avanzás, y el fondo tiene dibujitos tenues.
export default function Process() {
  const { T, t } = useApp()
  const ref = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const doodleX = useTransform(scrollYProgress, [0, 1], [0, -dist * 0.35])
  const bird = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const calc = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const n = process.length
  return (
    <section className="process" ref={ref} style={{ height: `calc(100vh + ${dist}px)` }} aria-label={T.process.title}>
      <div className="process-sticky">
        <motion.div className="process-doodles" style={{ x: doodleX }} aria-hidden="true">
          <Doodles />
        </motion.div>
        <motion.div className="process-track" ref={track} style={{ x }}>
          <div className="process-intro">
            <h2 className="display-2">{T.process.title}</h2>
          </div>
          {process.map((s, i) => (
            <div className="process-pair" key={t(s.title)}>
              <ProcessArrow progress={scrollYProgress} from={(i - 0.6) / n} to={(i + 0.1) / n} variant={i} />
              <div className="process-step">
                <h3 className="process-title">{t(s.title)}</h3>
                <p className="process-detail">{t(s.detail)}</p>
                <p className="process-example">
                  <strong>{T.process.example}:</strong> {t(s.example)}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
        <div className="process-rail" aria-hidden="true">
          <motion.span className="process-rail-fill" style={{ scaleX: scrollYProgress }} />
          <motion.span className="process-rail-bird" style={{ left: bird }} />
        </div>
      </div>
    </section>
  )
}

// Flecha punteada que se "dibuja" según el progreso del scroll. Tres formas que se alternan:
// arco hacia arriba, un loop y arco hacia abajo. La punta es un marker, así siempre sigue la curva.
const ARROWS = [
  'M10 78 C 44 22, 112 18, 150 62',
  'M10 72 C 50 72, 80 62, 90 42 C 100 22, 82 6, 68 18 C 54 30, 78 56, 110 58 C 130 59, 144 54, 152 48',
  'M10 34 C 46 92, 112 96, 150 46',
]

function ProcessArrow({ progress, from, to, variant }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const draw = useTransform(progress, [Math.max(0, from), Math.max(0.01, to)], [0, 1])
  const tip = useTransform(draw, [0.92, 1], [0, 1])
  const reveal = useTransform(draw, [0, 1], [0, 170])
  const d = ARROWS[variant % ARROWS.length]
  return (
    <svg className="process-arrow" viewBox="0 0 160 100" aria-hidden="true">
      <defs>
        <clipPath id={`m${id}`}>
          <motion.rect x="0" y="-20" height="140" style={{ width: reveal }} />
        </clipPath>
        <marker id={`h${id}`} viewBox="0 0 12 12" refX="7" refY="6" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 2 L9 6 L2 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <path d={d} className="process-arrow-line" clipPath={`url(#m${id})`} />
      <motion.path d={d} className="process-arrow-head" markerEnd={`url(#h${id})`} style={{ opacity: tip }} />
    </svg>
  )
}

// Dibujitos a mano alzada: herramientas, el cielo y alguna garza.
function Doodles() {
  return (
    <svg className="doodles-svg" viewBox="0 0 2400 800" preserveAspectRatio="xMinYMid slice">
      <g fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Júpiter con bandas */}
        <g transform="translate(330 140)">
          <circle r="46" />
          <path d="M-44 -12 Q0 -4 44 -14 M-46 8 Q0 16 46 6 M-38 26 Q0 32 38 24" />
          <ellipse cx="14" cy="11" rx="10" ry="5" />
        </g>
        {/* estrellas */}
        <path d="M120 600 l8 18 18 8 -18 8 -8 18 -8 -18 -18 -8 18 -8z" />
        <path d="M760 90 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5z" />
        <path d="M1540 650 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" />
        <path d="M2180 120 l7 16 16 7 -16 7 -7 16 -7 -16 -16 -7 16 -7z" />
        {/* código */}
        <path d="M560 610 l-34 30 34 30 M640 610 l34 30 -34 30 M612 600 l-22 80" />
        {/* lamparita */}
        <g transform="translate(1000 130)">
          <path d="M-26 0 a26 26 0 1 1 52 0 c0 14 -12 20 -12 34 h-28 c0 -14 -12 -20 -12 -34z" />
          <path d="M-12 44 h24 M-9 54 h18 M0 -42 v-14 M-34 -30 l-10 -10 M34 -30 l10 -10" />
        </g>
        {/* mate con bombilla */}
        <g transform="translate(1280 600)">
          <path d="M-34 -20 q0 60 34 60 q34 0 34 -60 z" />
          <path d="M-30 -20 q30 -14 60 0" />
          <path d="M12 -26 l26 -60 h14" />
        </g>
        {/* engranaje */}
        <g transform="translate(1720 160)">
          <circle r="22" />
          <path d="M0 -44 v12 M0 32 v12 M-44 0 h12 M32 0 h12 M-31 -31 l9 9 M22 22 l9 9 M-31 31 l9 -9 M22 -22 l9 -9" />
        </g>
        {/* avión de papel */}
        <path d="M1900 620 l110 -50 -40 90 -20 -34 z M1950 626 l60 -56" />
        {/* cohete */}
        <g transform="translate(2260 560) rotate(30)">
          <path d="M0 -60 q26 30 18 80 h-36 q-8 -50 18 -80z" />
          <circle cy="-16" r="8" />
          <path d="M-18 10 l-14 22 14 -4 M18 10 l14 22 -14 -4 M-8 24 q8 26 16 0" />
        </g>
        {/* impresora */}
        <g transform="translate(160 260)">
          <rect x="-40" y="-10" width="80" height="40" rx="8" />
          <path d="M-24 -10 v-24 h48 v24 M-24 30 v26 h48 v-26 M-14 44 h28" />
        </g>
        {/* garza en vuelo */}
        <path d="M1440 120 q40 -30 80 0 q30 -20 60 -6 M1520 120 q10 20 40 20 l30 -4" />
        {/* luna */}
        <path d="M2050 400 a40 40 0 1 0 40 52 a32 32 0 1 1 -40 -52z" />
        {/* órbita */}
        <ellipse cx="820" cy="430" rx="90" ry="26" />
        <circle cx="820" cy="430" r="14" />
      </g>
    </svg>
  )
}
