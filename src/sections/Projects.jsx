import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useApp } from '../lib/app'
import { projects } from '../data/projects'
import { Lines, Reveal, R, Arrow, TechList, Magnetic } from '../components/fx'
import ManagerDemo from '../components/demos/ManagerDemo'
import PrintDemo from '../components/demos/PrintDemo'
import GaviaDemo from '../components/demos/GaviaDemo'
import OrdenDemo from '../components/demos/OrdenDemo'

const DEMOS = { manager: ManagerDemo, print: PrintDemo, gavia: GaviaDemo, orden: OrdenDemo }

export default function Projects() {
  const { T } = useApp()
  return (
    <section className="projects" id="mas-proyectos">
      <div className="section-pad">
        <Lines text={T.work.title} className="display-2" />
      </div>
      {projects.map((p, i) => (
        <Project key={p.id} p={p} index={i} />
      ))}
    </section>
  )
}

function Links({ p }) {
  const { T, t } = useApp()
  const repos = !p.repo ? [] : typeof p.repo === 'string' ? [{ label: T.work.code, url: p.repo }] : p.repo
  return (
    <div className="proj-links">
      {p.live && (
        <Magnetic>
          <a className="btn btn-accent" href={p.live} target="_blank" rel="noreferrer" data-cursor="abrir">
            {T.work.live} <Arrow />
          </a>
        </Magnetic>
      )}
      {repos.map((r) => (
        <a key={r.url} className="btn btn-ghost" href={r.url} target="_blank" rel="noreferrer" data-cursor="github">
          {r.label} <Arrow />
        </a>
      ))}
      {!repos.length && p.repoNote && <span className="note">{t(p.repoNote)}</span>}
    </div>
  )
}

function Head({ p }) {
  const { t } = useApp()
  return (
    <>
      <div className="proj-kicker">
        <span className="status"><span className="pulse" aria-hidden="true" />{t(p.status)}</span>
        {p.role && <span className="note">{t(p.role)}</span>}
      </div>
      <Lines text={p.title} as="h3" className="display-2" />
      <Reveal className="proj-copy">
        <R as="p" className="statement">{t(p.tagline)}</R>
        <R as="p" className="body">{t(p.description)}</R>
      </Reveal>
    </>
  )
}

function Features({ p }) {
  const { T, t } = useApp()
  if (!p.features) return null
  return (
    <div className="proj-features">
      <h4 className="h3">{T.work.features}</h4>
      <Reveal as="ul" stagger={0.05}>
        {t(p.features).map((f) => (
          <R as="li" key={f} y={14}>{f}</R>
        ))}
      </Reveal>
    </div>
  )
}

function Project({ p }) {
  const { T } = useApp()
  const Demo = DEMOS[p.demo]
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [60, -60])

  if (p.demo === 'manager') {
    return (
      <article className="proj proj-manager" ref={ref}>
        <div className="proj-manager-grid">
          <div className="proj-text"><Head p={p} /><Links p={p} /></div>
          <motion.div className="proj-demo" style={{ y: drift }}><Demo /></motion.div>
        </div>
        <div className="proj-bottom">
          <Features p={p} />
          <div><h4 className="h3">{T.work.stack}</h4><TechList items={p.tech} /></div>
        </div>
      </article>
    )
  }

  if (p.demo === 'print') {
    return (
      <article className="proj proj-print field" ref={ref}>
        <div className="proj-print-grid">
          <motion.div className="proj-demo" style={{ y: drift }}><Demo /></motion.div>
          <div className="proj-text">
            <Head p={p} />
            <Links p={p} />
            <Features p={p} />
            <h4 className="h3">{T.work.stack}</h4>
            <TechList items={p.tech} />
          </div>
        </div>
      </article>
    )
  }

  if (p.demo === 'gavia') {
    return (
      <article className="proj proj-gavia" ref={ref}>
        <div className="proj-gavia-top">
          <div className="proj-text"><Head p={p} /><Links p={p} /><TechList items={p.tech} /></div>
          <div className="proj-gavia-shots">
            {p.images.map((src, i) => (
              <motion.img
                key={src}
                src={src}
                alt={`Gavia, captura ${i + 1}`}
                loading="lazy"
                className={`shot shot-${i}`}
                style={{ y: useTransformSafe(scrollYProgress, i) }}
              />
            ))}
          </div>
        </div>
        <Demo stops={p.stops} />
      </article>
    )
  }

  return (
    <article className="proj proj-orden" ref={ref}>
      <div className="proj-orden-grid">
        <div className="proj-text">
          <Head p={p} />
          <Links p={p} />
          <TechList items={p.tech} />
        </div>
        <motion.div className="proj-demo" style={{ y: drift }}><Demo /></motion.div>
      </div>
      <div className="proj-orden-shots">
        {p.images.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt={`Orden 66 Viandas, captura ${i + 1}`}
            loading="lazy"
            className="shot"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          />
        ))}
      </div>
    </article>
  )
}

// Cada captura con su propia velocidad de parallax (hook llamado en orden estable).
function useTransformSafe(progress, i) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useTransform(progress, [0, 1], [40 * (i + 1), -40 * (i + 1)])
}
