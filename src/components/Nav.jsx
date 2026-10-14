import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useApp } from '../lib/app'
import { SECRETS } from '../data/ui'
import { Scramble, EASE } from './fx'
import { Jupiter, Moon } from './Planet'

export default function Nav({ onTerminal }) {
  const { T, lang, setLang, theme, setTheme, unlock, found, total } = useApp()
  const { scrollY, scrollYProgress } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 400)
    setSolid(y > 40)
  })

  const togglePaper = () => {
    const next = theme === 'paper' ? 'dark' : 'paper'
    setTheme(next)
    if (next === 'paper') unlock('paper')
  }

  const links = [
    ['#proyectos', T.nav.work],
    ['#recorrido', T.nav.journey],
    ['#stack', T.nav.stack],
    ['#contacto', T.nav.contact],
  ]

  return (
    <motion.header
      className={`nav ${solid ? 'is-solid' : ''}`}
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <a href="#top" className="nav-mark" data-cursor="arriba" aria-label="Juan Agustín García, inicio">
        JAG<span className="nav-mark-dot">.</span>
      </a>
      <nav className="nav-links" aria-label="Secciones">
        {links.map(([href, label]) => (
          <a key={href} href={href}>
            <Scramble text={label} />
          </a>
        ))}
      </nav>
      <div className="nav-tools">
        <SecretCounter found={found.length} total={total} />
        <button className="nav-tool" onClick={onTerminal} data-cursor="terminal" aria-label="Abrir terminal">
          &gt;_
        </button>
        <button
          className="nav-tool"
          onClick={togglePaper}
          data-cursor={theme === 'paper' ? 'noche' : 'día'}
          aria-label={theme === 'paper' ? 'Modo oscuro' : 'Modo papel'}
        >
          <span className="theme-icon">{theme === 'paper' ? <Moon size={24} spin={false} /> : <Jupiter size={24} spin={false} />}</span>
        </button>
        <button
          className="nav-tool nav-lang"
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          data-cursor={lang === 'es' ? 'english' : 'español'}
          aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
        >
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
      <motion.div className="nav-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </motion.header>
  )
}

function SecretCounter({ found, total }) {
  const { T, found: ids, t } = useApp()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('pointerdown', close)
    return () => window.removeEventListener('pointerdown', close)
  }, [open])
  return (
    <div className="secret-counter">
      <button
        className="nav-tool secret-btn"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        onPointerDown={(e) => e.stopPropagation()}
        data-cursor="pistas"
        aria-label={`${found} ${T.secrets.of} ${total} ${T.secrets.label}`}
      >
        <span className="secret-num">{found}</span>/{total}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="secret-pop"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <p className="secret-pop-title">
              {found} {T.secrets.of} {total} {T.secrets.label}
            </p>
            <ul>
              {Object.entries(SECRETS).map(([id, label]) => (
                <li key={id} className={ids.includes(id) ? 'is-found' : ''}>
                  {ids.includes(id) ? t(label) : '? ? ? ? ? ?'}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
