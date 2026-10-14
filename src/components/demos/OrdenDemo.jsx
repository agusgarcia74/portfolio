import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../../lib/app'
import { EASE } from '../fx'

// Cupos del día: pedís viandas hasta que se agotan; los pedidos avanzan de estado solos.
const QUOTA = 8
const MENU = [
  { id: 'a', name: { es: 'Milanesa con puré', en: 'Milanesa with mash' } },
  { id: 'b', name: { es: 'Wok de verduras', en: 'Vegetable wok' } },
  { id: 'c', name: { es: 'Tarta de jamón y queso', en: 'Ham and cheese pie' } },
]
const STATES = [
  { es: 'Pendiente', en: 'Pending' },
  { es: 'Confirmado', en: 'Confirmed' },
  { es: 'Entregado', en: 'Delivered' },
]

export default function OrdenDemo() {
  const { t, lang, unlock } = useApp()
  const es = lang === 'es'
  const [orders, setOrders] = useState([])
  const [flights, setFlights] = useState([])
  const left = QUOTA - orders.length

  useEffect(() => {
    if (!orders.some((o) => o.state < 2)) return
    const id = setTimeout(() => {
      const now = Date.now()
      const due = (o) => o.state < 2 && now - o.at > 1400 * (o.state + 1)
      const delivered = orders.filter((o) => due(o) && o.state === 1).map((o) => o.id)
      setOrders((list) => list.map((o) => (due(o) ? { ...o, state: o.state + 1 } : o)))
      // cada entrega la hace una nave
      if (delivered.length) setFlights((f) => [...f, ...delivered.map((d) => ({ id: d + Math.random() }))])
    }, 500)
    return () => clearTimeout(id)
  }, [orders])

  const order = (m) => {
    if (left <= 0) return
    setOrders((list) => [{ id: Date.now(), menu: m, state: 0, at: Date.now() }, ...list])
    if (left === 1) unlock('order')
  }

  return (
    <div className="orden" data-ui>
      <Emblem />
      <div className="orden-sky" aria-hidden="true">
        <AnimatePresence>
          {flights.map((f) => (
            <motion.span
              key={f.id}
              className="orden-ship"
              initial={{ left: '-15%', top: '62%', rotate: -6, opacity: 0 }}
              animate={{ left: '112%', top: ['62%', '30%', '8%'], rotate: [-6, -14, -4], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, ease: [0.45, 0, 0.3, 1] }}
              onAnimationComplete={() => setFlights((all) => all.filter((x) => x.id !== f.id))}
            >
              <Ship />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="orden-head">
        <p className="orden-title">{es ? 'Viandas de hoy' : "Today's meals"}</p>
        <p className="orden-quota">
          <span className="tabular">{left}</span>/{QUOTA} {es ? 'cupos' : 'left'}
        </p>
      </div>
      <div className="orden-bar" aria-hidden="true">
        <motion.span animate={{ scaleX: left / QUOTA }} transition={{ duration: 0.5, ease: EASE }} />
      </div>
      <ul className="orden-menu">
        {MENU.map((m) => (
          <li key={m.id}>
            <span>{t(m.name)}</span>
            <button onClick={() => order(m)} disabled={left <= 0} data-cursor={left > 0 ? 'pedir' : 'agotado'}>
              {left > 0 ? (es ? 'Pedir' : 'Order') : es ? 'Agotado' : 'Sold out'}
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {left <= 0 && (
          <motion.p className="orden-out" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {es ? 'Sin cupos por hoy. El backend no deja pasar ni uno más.' : 'No quota left today. The backend lets nothing through.'}
            <button onClick={() => setOrders([])} data-cursor="reiniciar">{es ? 'Mañana' : 'Tomorrow'}</button>
          </motion.p>
        )}
      </AnimatePresence>
      <ul className="orden-orders">
        <AnimatePresence initial={false}>
          {orders.slice(0, 4).map((o) => (
            <motion.li
              key={o.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <span>{t(o.menu.name)}</span>
              <span className={`orden-state s${o.state}`}>{t(STATES[o.state])}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

// Nave de reparto (inspirada en los cazas de la saga): cabina redonda y dos alas hexagonales.
function Ship() {
  return (
    <svg viewBox="0 0 120 60" width="84" height="42">
      <path d="M-60 30 H30" stroke="url(#trail)" strokeWidth="3" />
      <defs>
        <linearGradient id="trail" x1="0" x2="1">
          <stop offset="0" stopColor="#ff5a1f" stopOpacity="0" />
          <stop offset="1" stopColor="#ff5a1f" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
        <path d="M40 4 L52 4 L58 30 L52 56 L40 56 L34 30 Z" fill="var(--bg-3)" />
        <path d="M80 4 L92 4 L98 30 L92 56 L80 56 L74 30 Z" fill="var(--bg-3)" />
        <path d="M56 30 H76" />
        <circle cx="66" cy="30" r="11" fill="var(--bg-2)" />
        <circle cx="66" cy="30" r="5" />
      </g>
    </svg>
  )
}

// Logo de la app (el emblema imperial), de fondo y muy tenue.
function Emblem() {
  return (
    <svg className="orden-emblem" viewBox="-50 -50 100 100" aria-hidden="true">
      <circle r="45" fill="none" stroke="currentColor" strokeWidth="6" />
      {Array.from({ length: 6 }, (_, k) => (
        <g key={k} transform={`rotate(${k * 60})`}>
          <path d="M-5 -14 L5 -14 L10 -39 L-10 -39 Z" fill="currentColor" />
          <rect x="-4" y="-46" width="8" height="10" fill="currentColor" transform="rotate(30)" />
        </g>
      ))}
      <circle r="15" fill="currentColor" />
      <circle r="7" fill="var(--bg-2)" />
    </svg>
  )
}
