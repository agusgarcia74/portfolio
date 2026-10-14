import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { useApp } from '../../lib/app'

// Carta de navegación: un pájaro recorre la ruta de las cinco etapas a medida que scrolleás.
const PATH = 'M 40 150 C 140 40, 230 40, 300 110 S 470 220, 560 120 S 760 20, 850 90 S 1000 190, 1060 90'
const STOPS = [0, 0.25, 0.5, 0.75, 1]

export default function GaviaDemo({ stops }) {
  const { t } = useApp()
  const wrap = useRef(null)
  const path = useRef(null)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start 100%', 'end 80%'] })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const [pos, setPos] = useState({ x: 30, y: 150, a: 0 })
  const [hover, setHover] = useState(null)
  const [pts, setPts] = useState([])
  const dash = useTransform(p, (v) => `${v} 1`)

  const measure = () => {
    if (!path.current || pts.length) return
    const L = path.current.getTotalLength()
    setPts(STOPS.map((s) => path.current.getPointAtLength(s * L)))
  }

  useMotionValueEvent(p, 'change', (v) => {
    if (!path.current) return
    measure()
    const L = path.current.getTotalLength()
    const k = Math.max(0, Math.min(1, v))
    const a = path.current.getPointAtLength(k * L)
    // la dirección se mide con un tramo que nunca se sale de la ruta (si no, al final queda torcido)
    const p0 = path.current.getPointAtLength(Math.max(0, k - 0.012) * L)
    const p1 = path.current.getPointAtLength(Math.min(1, k + 0.012) * L)
    const b = { x: a.x + (p1.x - p0.x), y: a.y + (p1.y - p0.y) }
    setPos({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI })
  })

  const reached = (i) => p.get() >= STOPS[i] - 0.02
  const list = pts.length ? pts : STOPS.map((_, i) => ({ x: 30 + i * 260, y: 120 }))

  return (
    <div className="gavia-chart" ref={wrap} onPointerEnter={measure}>
      <svg viewBox="0 0 1100 230" className="gavia-svg" role="img" aria-label={stops.map((s) => t(s)).join(', ')}>
        <path d={PATH} className="gavia-route-bg" />
        <motion.path ref={path} d={PATH} className="gavia-route" pathLength="1" style={{ strokeDasharray: dash }} />
        {list.map((pt, i) => (
          <g
            key={i}
            className={`gavia-stop ${reached(i) ? 'is-on' : ''} ${hover === i ? 'is-hover' : ''}`}
            transform={`translate(${pt.x} ${pt.y})`}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            data-cursor={t(stops[i])}
          >
            <circle r="22" className="gavia-stop-hit" />
            <circle r="9" className="gavia-stop-dot" />
            <text
              y={i % 2 ? 46 : -30}
              textAnchor={i === 0 ? 'start' : i === list.length - 1 ? 'end' : 'middle'}
              x={i === 0 ? -14 : i === list.length - 1 ? 14 : 0}
              className="gavia-stop-label"
            >
              {t(stops[i])}
            </text>
          </g>
        ))}
        <g transform={`translate(${pos.x} ${pos.y}) rotate(${pos.a})`} className="gavia-bird">
          <path d="M-14 -10 C -4 -6, 2 -2, 10 0 C 2 2, -4 6, -14 10 C -8 4, -8 -4, -14 -10 Z" />
        </g>
      </svg>
    </div>
  )
}
