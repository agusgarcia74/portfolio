import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { useApp, prefersReduced } from '../lib/app'
import { featured as P } from '../data/projects'
import { Lines, Reveal, R, Magnetic, Arrow, TechList, EASE } from '../components/fx'

export default function Featured() {
  const { T, t } = useApp()
  return (
    <section className="featured section" id="proyectos">
      <div className="featured-head">
        <div className="featured-title">
          <Lines text={T.featured.title} className="h2 muted-h" />
          <Lines text={P.title} as="h3" className="display" delay={0.1} />
          <Reveal>
            <R as="p" className="statement">{t(P.tagline)}</R>
          </Reveal>
        </div>
        <Reveal className="featured-intro">
          <R as="p" className="body">{t(P.description)}</R>
          <R as="div" className="featured-meta">
            <span className="status"><span className="pulse" aria-hidden="true" />{t(P.status)}</span>
            <Magnetic>
              <a className="btn btn-accent" href={P.live} target="_blank" rel="noreferrer" data-cursor="abrir">
                {T.featured.visit} <Arrow />
              </a>
            </Magnetic>
          </R>
          <R><TechList items={P.tech} /></R>
        </Reveal>
      </div>

      <Gallery />
      <Flow />
    </section>
  )
}

// Recorrido de un pedido: navegador → proxy → API → base de datos.
function Flow() {
  const { T, t } = useApp()
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto || prefersReduced()) return
    const id = setInterval(() => setActive((a) => (a + 1) % P.flow.length), 2600)
    return () => clearInterval(id)
  }, [auto])
  const node = P.flow[active]
  return (
    <div className="flow">
      <div className="flow-head">
        <h4 className="h3">{T.featured.flow}</h4>
        <p className="note">{T.featured.flowHint}</p>
      </div>
      <div className="flow-track" role="tablist" aria-label={T.featured.flow}>
        <div className="flow-wire" aria-hidden="true">
          <motion.span
            className="flow-packet"
            animate={{ left: `${(active / (P.flow.length - 1)) * 100}%` }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </div>
        {P.flow.map((n, i) => (
          <button
            key={n.id}
            role="tab"
            aria-selected={i === active}
            className={`flow-node ${i === active ? 'is-active' : ''} ${i <= active ? 'is-passed' : ''}`}
            onClick={() => { setActive(i); setAuto(false) }}
            data-cursor="ver capa"
          >
            <span className="flow-host">{n.host}</span>
            <span className="flow-name">{t(n.name)}</span>
            <span className="flow-tech">{n.tech}</span>
          </button>
        ))}
      </div>
      <div className="flow-detail" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={node.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {t(node.detail)}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Gallery() {
  const { T } = useApp()
  const outer = useRef(null)
  const inner = useRef(null)
  const [limit, setLimit] = useState(0)
  const [big, setBig] = useState(null)
  const x = useMotionValue(0)
  const v = useVelocity(x)
  // al arrastrar, las capturas se inclinan según la velocidad y rebotan al soltar
  const tilt = useSpring(useTransform(v, [-3000, 0, 3000], [3.5, 0, -3.5], { clamp: true }), { stiffness: 200, damping: 16 })
  useEffect(() => {
    const calc = () => setLimit(Math.max(0, inner.current.scrollWidth - outer.current.clientWidth))
    calc()
    window.addEventListener('resize', calc)
    const imgs = inner.current.querySelectorAll('img')
    imgs.forEach((i) => i.addEventListener('load', calc))
    return () => window.removeEventListener('resize', calc)
  }, [])
  const images = [P.image, ...P.gallery]
  return (
    <div className="gallery" ref={outer}>
      <p className="note gallery-note">{T.featured.gallery}</p>
      <motion.div
        className="gallery-track"
        ref={inner}
        drag="x"
        style={{ x }}
        dragConstraints={{ left: -limit, right: 0 }}
        dragElastic={0.12}
        data-cursor="arrastrá"
      >
        {images.map((src, i) => (
          <motion.figure
            key={src}
            className={`gallery-item ${big === i ? 'is-big' : ''}`}
            style={{ rotate: tilt }}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
            onTap={() => setBig(big === i ? null : i)}
          >
            <img src={src} alt={`UTN Hub, pantalla ${i + 1}`} draggable="false" loading="lazy" />
          </motion.figure>
        ))}
      </motion.div>
    </div>
  )
}
