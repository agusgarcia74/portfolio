import { useRef, useState } from 'react'
import {
  motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity,
} from 'motion/react'
import { useApp, prefersReduced } from '../lib/app'
import { about } from '../data/site'
import { Lines, Reveal, R } from '../components/fx'

// Cinta que corre sola y acelera / cambia de dirección con el scroll.
export function Marquee() {
  const { T } = useApp()
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [-2000, 0, 2000], [-5, 1, 5], { clamp: false })
  const dir = useRef(1)
  const reduced = prefersReduced()
  useAnimationFrame((_, delta) => {
    if (reduced) return
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    let v = x.get() - dir.current * 0.03 * (delta / 16) * (1 + Math.abs(f))
    if (v < -50) v += 50
    if (v > 0) v -= 50
    x.set(v)
  })
  const items = [...T.marquee, ...T.marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x: useTransform(x, (v) => `${v}%`) }}>
        {items.map((w, i) => (
          <span key={i} className="marquee-item">
            {w}
            <Bird />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export function Bird({ className = 'marquee-bird' }) {
  return (
    <svg className={className} viewBox="0 0 40 20" aria-hidden="true">
      <path d="M2 6c6 0 11 3 18 10C27 9 32 6 38 6c-6 2-12 6-18 13C14 12 8 8 2 6z" fill="currentColor" />
    </svg>
  )
}

// La garza "impresa" en el dorso del ticket, como sale de una consola.
const ASCII_HERON = String.raw`
    __
 =<(o )
     \ \
      ) )
     / /
    ( (____
     \_____)
       | |
       | |
      _| |_`

// Código de barras de ancho completo (anchos fijos para que no cambie entre renders).
const BARS = Array.from({ length: 58 }, (_, i) => ((i * 7 + (i % 5) * 3) % 4) + 1)

export default function About() {
  const { T, t, unlock, lang } = useApp()
  const area = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const es = lang === 'es'
  // al arrastrar, el ticket se balancea un poco según la velocidad
  const x = useMotionValue(0)
  const vx = useVelocity(x)
  const sway = useSpring(useTransform(vx, [-1500, 0, 1500], [-7, 0, 7], { clamp: true }), { stiffness: 220, damping: 12 })
  const flip = () => {
    setFlipped((f) => !f)
    unlock('flip')
  }
  const stop = (e) => e.stopPropagation()
  return (
    <section className="about section" id="sobre-mi" ref={area}>
      <div className="about-grid">
        <div className="about-text">
          <Lines text={T.about.title} className="display-2" />
          <Reveal className="proj-copy">
            <R as="p" className="statement">
              {t(about.statement)}
            </R>
            <R as="p" className="body">
              {t(about.second)}
            </R>
          </Reveal>
        </div>
        <div className="about-ticket-area">
          <motion.div
            className="ticket-drag"
            drag
            dragSnapToOrigin
            dragConstraints={area}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
            style={{ x, rotate: sway }}
            whileDrag={{ scale: 1.04 }}
            initial={{ y: -60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            onDoubleClick={flip}
            data-cursor={es ? 'arrastrame' : 'drag me'}
          >
            <div className="ticket-float">
              <motion.div
                className="ticket-card"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 90, damping: 14 }}
              >
                <div className="ticket">
                  <div className="ticket-teeth top" aria-hidden="true" />
                  <p className="ticket-head">JAG · {T.about.ticket} #2005</p>
                  <p className="ticket-sub">{new Date().toLocaleDateString()} · Córdoba</p>
                  <dl className="ticket-rows">
                    {about.ticket.map((row) => (
                      <div key={t(row.k)} className="ticket-row">
                        <dt>{t(row.k)}</dt>
                        <dd>{t(row.v)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="ticket-total">
                    <span>{T.about.total}</span>
                    <span>{T.about.totalV}</span>
                  </div>
                  <div className="ticket-barcode" aria-hidden="true">
                    {BARS.map((w, i) => (
                      <span key={i} style={{ width: w }} />
                    ))}
                  </div>
                  <p className="ticket-thanks">{T.about.thanks}</p>
                  <button
                    className="ticket-flip"
                    onClick={flip}
                    onPointerDownCapture={stop}
                    aria-label={es ? 'Dar vuelta el ticket' : 'Flip the receipt'}
                    data-cursor={es ? 'dar vuelta' : 'flip'}
                  >
                    ↻
                  </button>
                  <div className="ticket-teeth bottom" aria-hidden="true" />
                </div>
                <div className="ticket ticket-back">
                  <div className="ticket-teeth top" aria-hidden="true" />
                  <p className="ticket-head">{es ? 'Dorso' : 'Back'}</p>
                  <div className="ticket-back-rows">
                    <p>
                      <span>{es ? 'Vencimiento' : 'Expires'}</span>
                      <strong>{es ? 'Nunca' : 'Never'}</strong>
                    </p>
                    <p>
                      <span>{es ? 'Devolución' : 'Refunds'}</span>
                      <strong>{es ? 'Sin devolución' : 'No refunds'}</strong>
                    </p>
                  </div>
                  <pre className="ticket-ascii" aria-label={es ? 'Una garza impresa' : 'A printed heron'}>{ASCII_HERON}</pre>
                  <p className="ticket-back-sign">{es ? 'Firma' : 'Signed'}: JAG</p>
                  <svg className="ticket-stamp" viewBox="0 0 100 100" aria-hidden="true">
                    <defs>
                      <clipPath id="stamp-clip">
                        <circle cx="50" cy="50" r="34" />
                      </clipPath>
                    </defs>
                    {/* bandas de Júpiter adentro del sello */}
                    <g clipPath="url(#stamp-clip)" fill="currentColor">
                      <rect x="0" y="18" width="100" height="7" opacity="0.35" />
                      <rect x="0" y="30" width="100" height="5" opacity="0.6" />
                      <rect x="0" y="40" width="100" height="9" opacity="0.25" />
                      <rect x="0" y="55" width="100" height="6" opacity="0.55" />
                      <rect x="0" y="66" width="100" height="8" opacity="0.3" />
                      <rect x="0" y="78" width="100" height="5" opacity="0.5" />
                      <ellipse cx="62" cy="58" rx="9" ry="5" opacity="0.8" />
                    </g>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                    <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path id="stamp-arc" d="M 14 50 A 36 36 0 0 1 86 50" fill="none" />
                    <text fontSize="9" fontWeight="700" fill="currentColor" letterSpacing="1.5">
                      <textPath href="#stamp-arc" startOffset="50%" textAnchor="middle">
                        {es ? 'APROBADO' : 'APPROVED'}
                      </textPath>
                    </text>
                  </svg>
                  <button
                    className="ticket-flip"
                    onClick={flip}
                    onPointerDownCapture={stop}
                    aria-label={es ? 'Volver al frente' : 'Back to front'}
                    data-cursor={es ? 'dar vuelta' : 'flip'}
                  >
                    ↻
                  </button>
                  <div className="ticket-teeth bottom" aria-hidden="true" />
                </div>
              </motion.div>
            </div>
          </motion.div>
          <p className="note ticket-hint">
            {es ? 'Arrastralo y soltalo. Doble click para darlo vuelta.' : 'Drag it and let go. Double-click to flip it.'}
          </p>
        </div>
      </div>
    </section>
  )
}
