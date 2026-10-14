import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import Flock from '../components/Flock'
import { EASE, Magnetic, Arrow } from '../components/fx'
import { useApp, isTouch, prefersReduced } from '../lib/app'
import { site } from '../data/site'
import { Jupiter, Moon } from '../components/Planet'

export default function Hero({ ready }) {
  const { T } = useApp()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])

  const enter = (i) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, ease: EASE, delay: 0.35 + i * 0.09 },
  })

  return (
    <section id="top" className="hero" ref={ref}>
      <motion.div className="hero-sky" style={{ y: skyY }}>
        <Sky />
      </motion.div>
      <Flock />
      <motion.div className="hero-inner" style={{ opacity: fade }}>
        <div className="hero-top">
          <motion.p className="hero-intro" {...enter(0)}>
            {T.hero.intro}
          </motion.p>
          <motion.div className="hero-meta" {...enter(1)}>
            <p className="hero-status">
              <span className="pulse" aria-hidden="true" />
              {T.hero.available}
            </p>
            <Clock />
            <p className="hero-hint">{isTouch() ? T.hero.hintTouch : T.hero.hint}</p>
          </motion.div>
        </div>

        <motion.div className="hero-photo-wrap" style={{ y: photoY }} {...enter(2)}>
          <Photo />
        </motion.div>



        <motion.div className="hero-name" style={{ y: nameY }}>
          <Name text={site.first} className="hero-first" ready={ready} delay={0.1} />
          <Name text={site.last} className="hero-last" ready={ready} delay={0.25} as="h1" full={site.name} />
        </motion.div>

        <motion.div className="hero-cta" {...enter(3)}>
          <Magnetic>
            <a href="#proyectos" className="btn btn-accent" data-cursor="bajar">
              {T.hero.cta}
              <Arrow className="rot-down" />
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Cada letra cambia de peso y ancho según la distancia al cursor (fuente variable).
function Name({ text, className, ready, delay, as = 'p', full }) {
  const ref = useRef(null)
  const Tag = as
  useEffect(() => {
    if (isTouch() || prefersReduced()) return
    const letters = [...ref.current.querySelectorAll('.ch')]
    let mx = -9999, my = -9999, raf = 0
    const state = letters.map(() => ({ w: 640, d: 100 }))
    const onMove = (e) => { mx = e.clientX; my = e.clientY }
    const loop = () => {
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect()
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2))
        const k = Math.max(0, 1 - d / 420)
        const tw = 640 - k * 440 // se afina cerca del cursor
        const td = 100 - k * 25
        state[i].w += (tw - state[i].w) * 0.12
        state[i].d += (td - state[i].d) * 0.12
        el.style.fontVariationSettings = `"wght" ${state[i].w.toFixed(0)}, "wdth" ${state[i].d.toFixed(1)}, "opsz" 96`
      })
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])
  return (
    <Tag ref={ref} className={className} aria-label={full ?? text}>
      {text.split('').map((c, i) => (
        <span key={i} className="mask" aria-hidden="true">
          <motion.span
            className="ch"
            initial={{ y: '105%' }}
            animate={ready ? { y: '0%' } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.045 }}
          >
            {c === ' ' ? ' ' : c}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

function Clock() {
  const { T, lang } = useApp()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString(lang === 'es' ? 'es-AR' : 'en-US', {
    timeZone: site.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return (
    <p className="hero-clock">
      <span className="tabular">{time}</span> {T.hero.local}
    </p>
  )
}

// Foto con inclinación 3D. Cinco clicks: secreto.
function Photo() {
  const { unlock, lang } = useApp()
  const [clicks, setClicks] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const rx = useSpring(0, { stiffness: 150, damping: 15 })
  const ry = useSpring(0, { stiffness: 150, damping: 15 })
  const move = (e) => {
    if (prefersReduced()) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16)
  }
  const click = () => {
    const n = clicks + 1
    setClicks(n)
    if (n === 5) {
      unlock('photo')
      setFlipped(true)
      setTimeout(() => setFlipped(false), 2600)
      setClicks(0)
    }
  }
  return (
    <motion.button
      className="hero-photo"
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={move}
      onPointerLeave={() => { rx.set(0); ry.set(0) }}
      onClick={click}
      data-cursor={clicks > 0 ? `${5 - clicks}…` : 'hola'}
      aria-label="Foto de Juan Agustín García"
      data-no-shock
    >
      <motion.div
        className="hero-photo-card"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="hero-photo-front">
          <span className="tape" aria-hidden="true" />
          <img src={site.photo} alt="Juan Agustín García, de camisa negra, en una terraza con árboles de fondo" />
          <span className="hero-photo-caption">
            <span>Córdoba, AR</span>
            <span className="tabular">@agusgarcia74</span>
          </span>
        </div>
        <div className="hero-photo-back">
          <p>{lang === 'es' ? 'Sí, soy yo.' : "Yes, that's me."}</p>
          <p className="small">{lang === 'es' ? 'Gracias por insistir.' : 'Thanks for insisting.'}</p>
        </div>
      </motion.div>
    </motion.button>
  )
}

// Fondo: un Júpiter gigante "en negro" (la Luna en modo papel). Click: aparecen las lunas.
function Sky() {
  const { theme, unlock } = useApp()
  const [open, setOpen] = useState(false)
  const paper = theme === 'paper'
  const click = () => {
    setOpen((o) => !o)
    unlock('sky')
  }
  return (
    <button className={`sky ${open ? 'is-open' : ''}`} onClick={click} data-no-shock aria-label={paper ? 'La Luna' : 'Júpiter'} tabIndex={-1}>
      {paper ? <Moon size={900} light /> : <Jupiter size={900} moons={open} dark />}
    </button>
  )
}
