import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useApp, prefersReduced } from '../../lib/app'
import { EASE } from '../fx'

// Réplica en miniatura de UTN Manager con sus tres caras: la app (changelog clasificado),
// el bot de Telegram y el calendario de Google donde se agendan las evaluaciones.
// Todo con datos de ejemplo.
const TOPICS = {
  eval: { es: 'Evaluaciones', en: 'Exams' },
  clase: { es: 'Clases y avisos', en: 'Classes' },
  material: { es: 'Material', en: 'Material' },
  tramite: { es: 'Trámites', en: 'Paperwork' },
}

const POOL = [
  { src: 'Moodle', course: 'Sistemas Operativos', title: { es: 'Parcial 2: se mueve al jueves 23', en: 'Midterm 2 moved to Thursday 23rd' }, topic: 'eval', change: 'mod', day: 3, why: { es: '"parcial" en el título · fecha cambió', en: '"parcial" in title · date changed' } },
  { src: 'Autogestión', course: 'Comunicación de Datos', title: { es: 'No hay clase el lunes por paro', en: 'No class on Monday (strike)' }, topic: 'clase', change: 'new', why: { es: '"paro" en el mensaje', en: '"paro" in message' } },
  { src: 'Moodle', course: 'Diseño de Sistemas', title: { es: 'Entrega TP integrador', en: 'Final project due' }, topic: 'eval', change: 'new', day: 4, why: { es: 'entrega con fecha', en: 'dated assignment' } },
  { src: 'Moodle', course: 'Análisis Matemático II', title: { es: 'Apunte: integrales dobles (PDF)', en: 'Notes: double integrals (PDF)' }, topic: 'material', change: 'new', why: { es: 'recurso nuevo', en: 'new resource' } },
  { src: 'Autogestión', course: 'Secretaría', title: { es: 'Abre la inscripción a finales', en: 'Final exam enrollment opens' }, topic: 'tramite', change: 'new', why: { es: '"inscripción" en el mensaje', en: '"inscripción" in message' } },
  { src: 'Moodle', course: 'Física II', title: { es: 'Laboratorio 3 pasa al aula 312', en: 'Lab 3 moves to room 312' }, topic: 'eval', change: 'mod', day: 1, why: { es: '"laboratorio" · aula cambió', en: '"laboratorio" · room changed' } },
  { src: 'Moodle', course: 'Probabilidad y Estadística', title: { es: 'Grabación de la clase del martes', en: "Tuesday's class recording" }, topic: 'material', change: 'new', why: { es: '"grabación" en el título', en: '"grabación" in title' } },
  { src: 'Autogestión', course: 'Sistemas Operativos', title: { es: 'Clase virtual el miércoles', en: 'Virtual class on Wednesday' }, topic: 'clase', change: 'new', why: { es: '"virtual" en el mensaje', en: '"virtual" in message' } },
]

const CHANGE = { new: { es: 'nuevo', en: 'new' }, mod: { es: 'cambió', en: 'changed' } }
const DAYS = { es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
const DATES = [19, 20, 21, 22, 23]

export default function ManagerDemo() {
  const { t, lang } = useApp()
  const es = lang === 'es'
  const [view, setView] = useState('app')
  const [items, setItems] = useState(() => POOL.slice(0, 3).map((p, i) => ({ ...p, id: i })))
  const [next, setNext] = useState(3)
  const [filter, setFilter] = useState('all')
  const [syncing, setSyncing] = useState(false)
  const [open, setOpen] = useState(null)
  const [cal, setCal] = useState([5]) // ids agendados (el 5 = laboratorio, ya agendado)
  const [chat, setChat] = useState(() => [
    { from: 'bot', text: { es: 'Hola Juan. Te aviso apenas haya algo nuevo en Moodle o Autogestión.', en: "Hi Juan. I'll ping you as soon as something new shows up on Moodle or Autogestión." } },
  ])
  const [ping, setPing] = useState(0)
  const visible = useRef(true)
  const ref = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const sync = () => {
    if (syncing) return
    setSyncing(true)
    setTimeout(() => {
      const item = { ...POOL[next % POOL.length], id: next }
      setItems((list) => [item, ...list].slice(0, 7))
      setNext((n) => n + 1)
      setSyncing(false)
      if (item.topic === 'eval') {
        setChat((c) => [...c, { from: 'bot', alert: true, text: { es: `Nueva evaluación en ${item.course}: ${item.title.es}`, en: `New exam in ${item.course}: ${item.title.en}` } }].slice(-6))
        setPing((p) => p + 1)
      }
    }, 700)
  }

  useEffect(() => {
    if (prefersReduced()) return
    const id = setInterval(() => visible.current && sync(), 4800)
    return () => clearInterval(id)
  })

  const schedule = (e, id) => {
    e.stopPropagation()
    setCal((c) => (c.includes(id) ? c : [...c, id]))
  }

  const evals = items.filter((i) => i.topic === 'eval')
  const command = (cmd) => {
    let reply
    if (cmd === '/evaluaciones') {
      reply = evals.length
        ? evals.map((i) => `• ${i.course}: ${t(i.title)}`).join('\n')
        : es ? 'No hay evaluaciones nuevas.' : 'No new exams.'
    } else if (cmd === '/hoy') {
      reply = es ? `Hoy: ${items.length} novedades, ${evals.length} evaluaciones.` : `Today: ${items.length} updates, ${evals.length} exams.`
    } else {
      reply = items.slice(0, 3).map((i) => `• [${t(TOPICS[i.topic])}] ${t(i.title)}`).join('\n')
    }
    setChat((c) => [...c, { from: 'me', text: cmd }, { from: 'bot', text: reply }].slice(-6))
  }

  const shown = items
    .filter((i) => filter === 'all' || i.topic === filter)
    .sort((a, b) => ((a.topic === 'eval') === (b.topic === 'eval') ? b.id - a.id : a.topic === 'eval' ? -1 : 1))
  const count = (k) => items.filter((i) => k === 'all' || i.topic === k).length

  const VIEWS = [
    ['app', es ? 'App web' : 'Web app'],
    ['telegram', 'Telegram'],
    ['calendar', 'Google Calendar'],
  ]

  return (
    <div className="mgr-wrap" ref={ref}>
      <div className="mgr-views" role="tablist">
        {VIEWS.map(([k, l]) => (
          <button key={k} role="tab" aria-selected={view === k} className={view === k ? 'is-on' : ''} onClick={() => setView(k)}>
            {l}
            {k === 'telegram' && ping > 0 && view !== 'telegram' && <span className="mgr-ping">{ping}</span>}
            {k === 'calendar' && <span className="mgr-ping is-quiet">{cal.length}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'app' && (
          <motion.div key="app" className="mgr" data-ui initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: EASE }}>
            <aside className="mgr-side">
              <p className="mgr-logo">UTN Manager</p>
              {[['all', { es: 'Novedades', en: 'Updates' }], ...Object.entries(TOPICS)].map(([k, l]) => (
                <button key={k} className={`mgr-tab ${filter === k ? 'is-on' : ''}`} onClick={() => setFilter(k)} data-cursor="filtrar">
                  <span>{t(l)}</span>
                  <span className="mgr-count">{count(k)}</span>
                </button>
              ))}
            </aside>
            <div className="mgr-main">
              <div className="mgr-top">
                <p>{es ? 'Changelog de hoy' : "Today's changelog"}</p>
                <button className="mgr-sync" onClick={sync} data-cursor="sincronizar">
                  <svg className={`mgr-spin ${syncing ? 'is-on' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 11a8 8 0 0 0-14.3-4.9M4 13a8 8 0 0 0 14.3 4.9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M5 2.5v4h4M19 21.5v-4h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {syncing ? (es ? 'Sincronizando…' : 'Syncing…') : es ? 'Sincronizar' : 'Sync'}
                </button>
              </div>
              <ul className="mgr-list">
                <AnimatePresence initial={false}>
                  {shown.map((i) => (
                    <motion.li
                      key={i.id}
                      layout
                      initial={{ opacity: 0, y: -16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className={`mgr-item t-${i.topic}`}
                      onClick={() => setOpen(open === i.id ? null : i.id)}
                      data-cursor="¿por qué?"
                    >
                      <div className="mgr-item-row">
                        <span className={`mgr-topic t-${i.topic}`}>{t(TOPICS[i.topic])}</span>
                        <span className="mgr-change">{t(CHANGE[i.change])}</span>
                        <span className="mgr-src">{i.src}</span>
                      </div>
                      <div className="mgr-item-main">
                        <div>
                          <p className="mgr-title">{t(i.title)}</p>
                          <p className="mgr-course">{i.course}</p>
                        </div>
                        {i.topic === 'eval' && (
                          <button
                            className={`mgr-add ${cal.includes(i.id) ? 'is-done' : ''}`}
                            onClick={(e) => schedule(e, i.id)}
                            data-cursor={cal.includes(i.id) ? 'agendado' : 'agendar'}
                          >
                            {cal.includes(i.id) ? (es ? 'Agendado' : 'Added') : es ? '+ Agendar' : '+ Add'}
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {open === i.id && (
                          <motion.p className="mgr-why" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            {es ? 'Motivo: ' : 'Reason: '}
                            {t(i.why)}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        )}

        {view === 'telegram' && (
          <motion.div key="tg" className="tg" data-ui initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: EASE }} onAnimationComplete={() => setPing(0)}>
            <div className="tg-head">
              <span className="tg-avatar" aria-hidden="true">UM</span>
              <div>
                <p className="tg-name">UTN Manager Bot</p>
                <p className="tg-sub">bot</p>
              </div>
            </div>
            <div className="tg-body">
              <AnimatePresence initial={false}>
                {chat.map((m, i) => (
                  <motion.p
                    key={`${i}-${typeof m.text === 'string' ? m.text : m.text.es}`}
                    layout
                    className={`tg-msg ${m.from} ${m.alert ? 'alert' : ''}`}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {t(m.text)}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
            <div className="tg-commands">
              {['/hoy', '/evaluaciones', '/novedades'].map((c) => (
                <button key={c} onClick={() => command(c)} data-cursor="enviar">{c}</button>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'calendar' && (
          <motion.div key="cal" className="gcal" data-ui initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="gcal-head">
              <p className="gcal-title">{es ? 'Octubre 2026' : 'October 2026'}</p>
              <p className="gcal-calname"><span className="gcal-dot" />{es ? 'Calendario "UTN Manager"' : '"UTN Manager" calendar'}</p>
            </div>
            <div className="gcal-grid">
              {DAYS[lang].map((d, i) => (
                <div key={d} className="gcal-col">
                  <p className="gcal-day">{d} <span className="tabular">{DATES[i]}</span></p>
                  <div className="gcal-slots">
                    <AnimatePresence>
                      {cal
                        .map((id) => items.find((it) => it.id === id) || POOL.map((p, k) => ({ ...p, id: k })).find((p) => p.id === id))
                        .filter((ev) => ev && ev.day === i)
                        .map((ev) => (
                          <motion.div key={ev.id} className="gcal-event" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>
                            <strong>{t(ev.title)}</strong>
                            <span>{ev.course}</span>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
            <p className="gcal-note">
              {es
                ? 'Solo se agenda lo que elegís, en un calendario propio de la app (permiso calendar.app.created).'
                : 'Only what you pick is added, to a calendar of its own (calendar.app.created scope).'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
