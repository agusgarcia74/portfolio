import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { AnimatePresence, motion } from 'motion/react'
import { techIcons } from '../data/techIcons'
import { useApp, prefersReduced, isTouch } from '../lib/app'
import { stack } from '../data/stack'
import { Lines, EASE } from '../components/fx'

// Fichas con física real (matter-js): caen cuando la sección entra en vista,
// se agarran, se tiran, y si tirás una muy fuerte para arriba se escapa (secreto).
export default function Stack() {
  const { T, t, unlock } = useApp()
  const box = useRef(null)
  const chipEls = useRef([])
  const [group, setGroup] = useState(null)
  const [tidy, setTidy] = useState(false)
  const api = useRef({})
  const all = stack.flatMap((g) => g.items.map((name) => ({ name, g: g.id })))

  useEffect(() => {
    const el = box.current
    if (prefersReduced()) {
      el.classList.add('is-static')
      return
    }
    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter
    const engine = Engine.create({ gravity: { y: 1 } })
    const runner = Runner.create()
    let W = el.clientWidth, H = el.clientHeight
    const wallOpts = { isStatic: true, restitution: 0.4 }
    let walls = []
    const makeWalls = () => {
      Composite.remove(engine.world, walls)
      walls = [
        Bodies.rectangle(W / 2, H + 50, W * 3, 100, wallOpts),
        Bodies.rectangle(-50, H / 2 - 2000, 100, H * 2 + 4000, wallOpts),
        Bodies.rectangle(W + 50, H / 2 - 2000, 100, H * 2 + 4000, wallOpts),
      ]
      Composite.add(engine.world, walls)
    }
    makeWalls()

    const bodies = chipEls.current.map((node, i) => {
      const w = node.offsetWidth, h = node.offsetHeight
      const b = Bodies.rectangle(
        40 + Math.random() * (W - 80), -60 - i * 38, w, h,
        { chamfer: { radius: h / 2 }, restitution: 0.5, friction: 0.08, frictionAir: 0.012, density: 0.002 },
      )
      Body.setAngle(b, (Math.random() - 0.5) * 0.8)
      b.plugin = { node, w, h, escaped: false }
      return b
    })

    // En pantallas táctiles no se agarra (bloquearía el scroll): un toque las sacude.
    let mouse = null
    const touch = isTouch()
    if (!touch) {
      mouse = Mouse.create(el)
      // que la rueda del mouse siga scrolleando la página
      mouse.element.removeEventListener('wheel', mouse.mousewheel)
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
      const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } })
      Composite.add(engine.world, mc)
    }
    const onTap = () => api.current.shake?.()
    if (touch) el.addEventListener('click', onTap)

    let started = false
    const start = () => {
      if (started) return
      started = true
      Composite.add(engine.world, bodies)
      Runner.run(runner, engine)
    }

    Events.on(engine, 'afterUpdate', () => {
      for (const b of bodies) {
        const { node, w, h } = b.plugin
        node.style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`
        if (!b.plugin.escaped && b.position.y < -260 && b.velocity.y < -8) {
          b.plugin.escaped = true
          unlock('throw')
          // vuelve a caer al rato
          setTimeout(() => {
            Body.setPosition(b, { x: W / 2, y: -80 })
            Body.setVelocity(b, { x: 0, y: 0 })
          }, 1800)
        }
      }
    })

    const io = new IntersectionObserver(([e]) => e.isIntersecting && start(), { threshold: 0.35 })
    io.observe(el)

    const onResize = () => {
      W = el.clientWidth
      H = el.clientHeight
      makeWalls()
    }
    window.addEventListener('resize', onResize)

    api.current.shake = () => {
      for (const b of bodies) {
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 18, y: -12 - Math.random() * 14 })
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.4)
      }
    }

    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
      Runner.stop(runner)
      Engine.clear(engine)
      if (touch) el.removeEventListener('click', onTap)
    }
  }, [unlock])

  return (
    <section className="stack section" id="stack">
      <div className="stack-head">
        <Lines text={T.stackS.title} className="display-2" />
        <p className="note">{isTouch() ? T.stackS.hintTouch : T.stackS.hint}</p>
        <div className="chips" role="tablist">
          <button className={`chip ${group === null ? 'is-on' : ''}`} onClick={() => setGroup(null)}>
            {T.stackS.all}
          </button>
          {stack.map((g) => (
            <button
              key={g.id}
              className={`chip g-${g.id} ${group === g.id ? 'is-on' : ''}`}
              onClick={() => setGroup(group === g.id ? null : g.id)}
            >
              {t(g.label)}
            </button>
          ))}
          <button
            className="chip chip-ghost"
            onClick={() => {
              setTidy((v) => !v)
              if (tidy) setTimeout(() => api.current.shake?.(), 50)
            }}
            data-cursor={tidy ? 'desordenar' : 'ordenar'}
          >
            {tidy ? T.stackS.messy : T.stackS.reset}
          </button>
        </div>
      </div>
      <div className={`stack-box ${group ? 'has-filter' : ''} ${tidy ? 'is-away' : ''}`} ref={box} data-cursor="agarrá" aria-hidden={tidy}>
        {all.map((c, i) => (
          <span
            key={c.name}
            ref={(n) => (chipEls.current[i] = n)}
            className={`stack-chip g-${c.g} ${group && group !== c.g ? 'is-dim' : ''}`}
          >
            {c.name}
          </span>
        ))}
      </div>
      <AnimatePresence>
        {tidy && (
          <motion.div
            className="stack-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {stack.filter((g) => !group || g.id === group).map((g, gi) => (
              <div className="stack-row" key={g.id}>
                <p className="stack-row-label">{t(g.label)}</p>
                <div className="stack-tiles">
                  {g.items.map((name, i) => (
                    <TechTile key={name} name={name} delay={gi * 0.06 + i * 0.03} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* versión en texto para lectores de pantalla y buscadores */}
      <dl className="sr-only">
        {stack.map((g) => (
          <div key={g.id}>
            <dt>{t(g.label)}</dt>
            <dd>{g.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

// Logo + nombre. En reposo el logo va en tono neutro; al pasar el mouse crece y toma su color.
function TechTile({ name, delay }) {
  const icon = techIcons[name]
  const hex = icon ? `#${icon.hex}` : null
  const dark = hex && parseInt(icon.hex, 16) < 0x333333
  return (
    <motion.div
      className="tech-tile"
      style={{ '--brand': dark ? 'var(--ink)' : hex }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
      whileHover={{ scale: 1.14, y: -4, zIndex: 3 }}
    >
      {icon?.parts ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="tech-multi">
          {icon.parts.map((part, i) => (
            <path
              key={i}
              d={part.d}
              className={`tech-part ${part.rest ? `rest-${part.rest}` : ''} ${part.stroke ? 'is-stroke' : ''}`}
              style={{ '--c': part.c }}
            />
          ))}
        </svg>
      ) : icon ? (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg>
      ) : (
        <span className="tech-mono" aria-hidden="true">{name.slice(0, 2)}</span>
      )}
      <span>{name}</span>
    </motion.div>
  )
}
