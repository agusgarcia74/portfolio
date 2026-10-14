import { useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useApp } from '../lib/app'
import { journey } from '../data/journey'
import { Lines, EASE } from '../components/fx'

// Línea de tiempo: un cabezal recorre la línea a medida que bajás. Filtro trabajo / estudio.
export default function Journey() {
  const { T, t } = useApp()
  const ref = useRef(null)
  const [filter, setFilter] = useState('all')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })
  const items = journey.filter((j) => filter === 'all' || j.kind === filter)

  return (
    <section className="journey section" id="recorrido">
      <div className="journey-head">
        <Lines text={T.journey.title} className="display-2" />
        <div className="chips" role="tablist">
          {[['all', T.stackS.all], ['work', T.journey.work], ['study', T.journey.study]].map(([k, l]) => (
            <button
              key={k}
              role="tab"
              aria-selected={filter === k}
              className={`chip ${filter === k ? 'is-on' : ''}`}
              onClick={() => setFilter(k)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="journey-list" ref={ref}>
        <div className="journey-line" aria-hidden="true">
          <motion.span style={{ scaleY: fill }} />
        </div>
        {items.map((j) => (
          <motion.article
            key={t(j.title)}
            layout
            className={`journey-item k-${j.kind}`}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="journey-period tabular">{t(j.period)}</p>
            <div className="journey-body">
              <h3 className="h3">{t(j.title)}</h3>
              <p className="journey-place">
                {j.place} · <span>{j.kind === 'work' ? T.journey.work : T.journey.study}</span>
              </p>
              <ul>
                {t(j.points).map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
