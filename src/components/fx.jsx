import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { prefersReduced } from '../lib/app'

export const EASE = [0.16, 1, 0.3, 1]

// Entrada escalonada: cada hijo directo sube y aparece cuando la sección entra en vista.
export function Reveal({ children, as = 'div', className, delay = 0, stagger = 0.075, y = 24, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export const item = (y = 24) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
})

export function R({ as = 'div', y, children, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag variants={item(y)} {...rest}>
      {children}
    </Tag>
  )
}

// Título que sube línea por línea desde una máscara.
export function Lines({ text, as = 'h2', className, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const Tag = as
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mask" aria-hidden="true">
            <motion.span
              style={{ display: 'inline-block' }}
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : {}}
              transition={{ duration: 1, ease: EASE, delay: delay + i * 0.06 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  )
}

// Texto que se "decodifica" al pasar el mouse.
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/'
export function Scramble({ text, className }) {
  const [out, setOut] = useState(text)
  const timer = useRef(0)
  useEffect(() => setOut(text), [text])
  const run = () => {
    if (prefersReduced()) return
    let frame = 0
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      frame++
      setOut(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || i < frame / 2 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      )
      if (frame / 2 >= text.length) {
        clearInterval(timer.current)
        setOut(text)
      }
    }, 28)
  }
  useEffect(() => () => clearInterval(timer.current), [])
  return (
    <span className={className} onPointerEnter={run} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

// Elemento magnético: se corre un poco hacia el cursor.
export function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null)
  const [p, setP] = useState({ x: 0, y: 0 })
  const move = (e) => {
    if (prefersReduced()) return
    const r = ref.current.getBoundingClientRect()
    setP({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength })
  }
  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: 'inline-block' }}
      onPointerMove={move}
      onPointerLeave={() => setP({ x: 0, y: 0 })}
      animate={p}
      transition={{ type: 'spring', stiffness: 220, damping: 14, mass: 0.4 }}
    >
      {children}
    </motion.span>
  )
}

export function Arrow({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

// Fragmento de 'Lista de tecnologías' sin cajitas: texto separado por puntos.
export function TechList({ items }) {
  return (
    <p className="techlist">
      {items.map((t, i) => (
        <span key={t}>
          {t}
          {i < items.length - 1 && <span className="sep" aria-hidden="true"> · </span>}
        </span>
      ))}
    </p>
  )
}
