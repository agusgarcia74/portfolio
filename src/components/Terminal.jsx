import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../lib/app'
import { site } from '../data/site'
import { projects, featured } from '../data/projects'
import { stack } from '../data/stack'
import { SECRETS } from '../data/ui'
import { EASE } from './fx'

// Terminal de juguete. Se abre con la tecla "/" o el botón >_ de la barra.
const MATE = String.raw`
       )  )
      (  (
    .-------.
   /  ~~~~~  \__
  |   yerba   | |
   \_________/ /
     '-----'`

const HERON = String.raw`
        __
      <(o )___
       ( ._> /
        \___/
         ||
        _||_`

export default function Terminal({ open, onClose }) {
  const app = useApp()
  const { lang, setLang, setTheme, setTurbo, unlock, found, total, t } = app
  const [lines, setLines] = useState([])
  const [value, setValue] = useState('')
  const [hist, setHist] = useState([])
  const [hi, setHi] = useState(-1)
  const input = useRef(null)
  const body = useRef(null)

  useEffect(() => {
    if (!open) return
    unlock('terminal')
    setLines((l) =>
      l.length
        ? l
        : [
            { k: 'sys', v: `jag-os 1.0 · ${new Date().toLocaleDateString(lang)}` },
            { k: 'sys', v: lang === 'es' ? 'Escribí "help" para ver los comandos.' : 'Type "help" to see the commands.' },
          ],
    )
    setTimeout(() => input.current?.focus(), 60)
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open, lang, onClose, unlock])

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight })
  }, [lines])

  const es = lang === 'es'
  const commands = {
    help: () => [
      'whoami      ' + (es ? 'quién soy' : 'who I am'),
      'proyectos   ' + (es ? 'lo que construí' : 'what I built'),
      'stack       ' + (es ? 'con qué trabajo' : 'what I work with'),
      'contacto    ' + (es ? 'cómo hablarme' : 'how to reach me'),
      'secretos    ' + (es ? 'cuántos encontraste' : 'how many you found'),
      'tema        ' + 'paper | dark',
      'idioma      ' + 'es | en',
      'mate        ' + (es ? 'cebar uno' : 'brew one'),
      'clear · exit',
    ],
    whoami: () => [
      `${site.name} — ${t(site.role)}`,
      es ? 'Ingeniería en Sistemas + Lic. en IA @ UTN' : 'Systems Engineering + AI degree @ UTN',
      site.location,
    ],
    proyectos: () => [featured, ...projects].map((p) => `• ${p.title.padEnd(18)} ${t(p.tagline)}`),
    projects: () => commands.proyectos(),
    stack: () => stack.map((g) => `${t(g.label).padEnd(16)} ${g.items.join(', ')}`),
    contacto: () => [`mail    ${site.email}`, `github  ${site.github}`],
    contact: () => commands.contacto(),
    secretos: () => [
      `${found.length}/${total}`,
      ...Object.entries(SECRETS).map(([id, l]) => (found.includes(id) ? `✓ ${t(l)}` : '· ? ? ?')),
      es ? 'Pista: hay un pájaro escondido abajo de todo.' : 'Hint: there is a bird hiding at the very bottom.',
    ],
    secrets: () => commands.secretos(),
    mate: () => [MATE, es ? 'Ahí tenés. Cuidado que quema.' : 'There you go. Careful, it is hot.'],
    garza: () => { unlock('heron'); return [HERON, 'heron.exe'] },
    heron: () => commands.garza(),
    sudo: () => [es ? 'Buen intento. Este portfolio no tiene root.' : 'Nice try. This portfolio has no root.'],
    konami: () => { setTurbo(true); unlock('konami'); return ['↑ ↑ ↓ ↓ ← → ← → B A', 'turbo: on'] },
    ls: () => ['proyectos/  stack/  contacto.txt  secretos.lock'],
    cv: () => { window.open(t(site.cv), '_blank'); return [es ? 'Abriendo el CV…' : 'Opening the CV…'] },
    clear: () => { setLines([]); return null },
    exit: () => { onClose(); return null },
  }

  const run = (raw) => {
    const [cmd, arg] = raw.trim().toLowerCase().split(/\s+/)
    if (!cmd) return
    let out
    if (cmd === 'tema' || cmd === 'theme') {
      const v = arg === 'paper' || arg === 'papel' ? 'paper' : 'dark'
      setTheme(v)
      if (v === 'paper') unlock('paper')
      out = [`theme → ${v}`]
    } else if (cmd === 'idioma' || cmd === 'lang') {
      setLang(arg === 'en' ? 'en' : 'es')
      out = [`lang → ${arg === 'en' ? 'en' : 'es'}`]
    } else if (commands[cmd]) {
      out = commands[cmd]()
    } else {
      out = [es ? `comando no encontrado: ${cmd}. Probá "help".` : `command not found: ${cmd}. Try "help".`]
    }
    if (out === null) return
    setLines((l) => [...l, { k: 'in', v: raw }, ...out.map((v) => ({ k: 'out', v }))])
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      run(value)
      if (value.trim()) setHist((h) => [value, ...h])
      setValue('')
      setHi(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = Math.min(hi + 1, hist.length - 1)
      if (n >= 0) { setHi(n); setValue(hist[n]) }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = hi - 1
      setHi(n)
      setValue(n >= 0 ? hist[n] : '')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="term-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerDown={onClose}
        >
          <motion.div
            className="term"
            role="dialog"
            aria-label="Terminal"
            initial={{ y: 30, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => input.current?.focus()}
          >
            <div className="term-bar">
              <button className="term-close" onClick={onClose} aria-label="Cerrar terminal" data-cursor="cerrar" />
              <span>juan@cordoba: ~</span>
            </div>
            <div className="term-body" ref={body}>
              {lines.map((l, i) => (
                <pre key={i} className={`term-line ${l.k}`}>
                  {l.k === 'in' ? <span className="term-prompt">❯ </span> : null}
                  {l.v}
                </pre>
              ))}
              <label className="term-input">
                <span className="term-prompt">❯</span>
                <input
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKey}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Comando"
                />
              </label>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
