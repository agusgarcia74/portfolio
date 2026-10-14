import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useApp, prefersReduced } from '../lib/app'

// La garza (así le dicen a Juan sus amigos). Cuando el footer entra en vista llega volando
// y se posa sobre la tilde de la í de "García"; si volvés a subir, se va volando.
export default function HeronPerch({ footer, accent }) {
  const { unlock, lang } = useApp()
  const [state, setState] = useState('away') // away | in | perched | out
  const [target, setTarget] = useState({ x: 0, y: 0 })
  const [talk, setTalk] = useState(false)
  const [landed, setLanded] = useState(0)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const measure = () => {
      const f = footer.current.getBoundingClientRect()
      const a = accent.current.getBoundingClientRect()
      const size = parseFloat(getComputedStyle(accent.current).fontSize)
      // la tilde queda arriba del palito de la i, levemente a la derecha del centro
      setTarget({ x: a.left - f.left + a.width * 0.6, y: a.top - f.top + size * 0.06 })
    }
    measure()
    window.addEventListener('resize', measure)
    const io = new IntersectionObserver(
      ([e]) => {
        measure()
        const s = stateRef.current
        if (e.isIntersecting && (s === 'away' || s === 'out')) setState('in')
        if (!e.isIntersecting && (s === 'in' || s === 'perched')) setState('out')
      },
      { threshold: 0.2 },
    )
    io.observe(accent.current)
    return () => {
      io.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [footer, accent])

  const W = typeof window === 'undefined' ? 1200 : window.innerWidth
  const reduced = prefersReduced()
  const pos = {
    away: { x: W + 120, y: -360, scale: 0.8, opacity: 0 },
    in: { x: [W + 120, target.x + (W - target.x) * 0.35, target.x], y: [-360, target.y - 150, target.y], scale: [0.8, 1, 1], opacity: [1, 1, 1] },
    perched: { x: target.x, y: target.y, scale: 1, opacity: 1 },
    out: { x: [target.x, target.x - 220, -200], y: [target.y, target.y - 120, -460], scale: [1, 1, 0.8], opacity: [1, 1, 1] },
  }[state]

  const flying = state === 'in' || state === 'out'
  const poke = () => {
    if (state !== 'perched') return
    unlock('heron')
    setTalk(true)
    setTimeout(() => setTalk(false), 2600)
  }

  return (
    <motion.div
      className={`heron-perch is-${state}`}
      initial={false}
      animate={pos}
      transition={
        // 'away' es solo reubicarse fuera de pantalla: instantáneo e invisible
        reduced || state === 'perched' || state === 'away'
          ? { duration: 0 }
          : state === 'in'
            ? { duration: 2.6, ease: 'easeInOut', times: [0, 0.55, 1] }
            : { duration: 1.8, ease: 'easeIn', times: [0, 0.4, 1] }
      }
      onAnimationComplete={() => {
        if (stateRef.current === 'in') {
          setState('perched')
          setLanded((n) => n + 1)
        }
        if (stateRef.current === 'out') setState('away')
      }}
    >
      <button
        className="heron-btn"
        onClick={poke}
        aria-label={lang === 'es' ? 'La garza' : 'The heron'}
        data-cursor={flying ? '' : '¿una garza?'}
        tabIndex={state === 'perched' ? 0 : -1}
      >
        {flying ? (
          <HeronFlying />
        ) : (
          <motion.span key={landed} className="heron-land" initial={{ scaleY: 0.82, scaleX: 1.1 }} animate={{ scaleY: 1, scaleX: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 9 }}>
            <HeronStanding />
          </motion.span>
        )}
      </button>
      <AnimatePresence>
        {talk && (
          <motion.p
            className="heron-bubble"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {lang === 'es' ? 'Así me dicen mis amigos.' : "That's what my friends call me."}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Parada, mirando a la izquierda, en trazo fino. El ancla (0,0) es la punta de las patas.
function HeronStanding() {
  return (
    <svg className="heron-svg standing" viewBox="-34 -74 64 76" width="58" height="69">
      <g className="h-idle">
        <path className="h-leg l1" d="M-1 -24 L-2 0 M-6 0 H3" />
        <path className="h-leg l2" d="M4 -24 L5 -12 L5 0 M1 0 H10" />
        <g className="h-torso">
          <path className="h-body" d="M-9 -30 C -5 -39, 11 -39, 16 -28 C 11 -21, -2 -20, -9 -30 Z" />
          <path className="h-wing" d="M-3 -33 C 4 -36, 12 -33, 15 -28" />
          <g className="h-neck">
            <path className="h-neckline" d="M-6 -32 C -13 -40, -3 -47, -8 -56" />
            <circle className="h-head" cx="-8.5" cy="-58" r="3" />
            <path className="h-beak" d="M-11 -58.5 L-24 -56.5" />
            <path className="h-plume" d="M-6 -59 L1 -62" />
          </g>
        </g>
      </g>
    </svg>
  )
}

// En vuelo: cuello recogido, patas atrás y alas que aletean (trazo fino).
function HeronFlying() {
  return (
    <svg className="heron-svg flying" viewBox="-40 -30 84 40" width="92" height="44">
      <path className="h-leg" d="M10 -2 L34 2" />
      <path className="h-body" d="M-12 -6 C -6 -12, 10 -11, 14 -4 C 8 1, -6 1, -12 -6 Z" />
      <path className="h-neckline" d="M-11 -6 C -18 -4, -20 -12, -16 -14" />
      <circle className="h-head" cx="-16" cy="-15" r="2.6" />
      <path className="h-beak" d="M-18 -15.5 L-30 -13" />
      <path className="h-wingfly" d="M-4 -8 C 0 -26, 14 -28, 22 -22" />
    </svg>
  )
}
