import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { useApp, prefersReduced } from './lib/app'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Toast from './components/Toast'
import Terminal from './components/Terminal'
import Hero from './sections/Hero'
import About, { Marquee } from './sections/About'
import Featured from './sections/Featured'
import Projects from './sections/Projects'
import Process from './sections/Process'
import Journey from './sections/Journey'
import Stack from './sections/Stack'
import Contact from './sections/Contact'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function App() {
  const { T, setTurbo, unlock, notify, lang, total } = useApp()
  const [ready, setReady] = useState(false)
  const [term, setTerm] = useState(false)
  const done = useCallback(() => setReady(true), [])
  const closeTerm = useCallback(() => setTerm(false), [])

  // scroll suave
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -20 } })
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })
    window.__lenis = lenis
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    if (window.__lenis) term ? window.__lenis.stop() : window.__lenis.start()
  }, [term])

  // teclado: "/" abre la terminal, Konami activa el modo turbo
  useEffect(() => {
    let seq = []
    const onKey = (e) => {
      const typing = e.target.closest?.('input, textarea')
      if (!typing && e.key === '/') {
        e.preventDefault()
        setTerm(true)
      }
      seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length)
      if (KONAMI.every((k, i) => seq[i] === k)) {
        setTurbo((v) => !v)
        unlock('konami')
        seq = []
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setTurbo, unlock])

  // título cuando te vas de la pestaña
  useEffect(() => {
    const base = document.title
    const onVis = () => { document.title = document.hidden ? T.title.away : base }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [T])

  // un saludo para quien abra la consola
  useEffect(() => {
    console.log(
      '%cHola, curioso.%c\nSi llegaste hasta acá, probá apretar "/" o el código Konami.\njuanagustingarcia74@gmail.com',
      'font: 700 20px sans-serif; color: #ff5a1f',
      'font: 13px sans-serif',
    )
  }, [])

  useEffect(() => {
    if (!ready) return
    const id = setTimeout(() => {
      notify({ kind: 'info', text: lang === 'es' ? `Hay ${total} secretos escondidos. Suerte.` : `There are ${total} hidden secrets. Good luck.` })
    }, 6000)
    return () => clearTimeout(id)
    // solo una vez al cargar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <>
      <Preloader onDone={done} />
      <Cursor />
      <Nav onTerminal={() => setTerm(true)} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Featured />
        <Projects />
        <Process />
        <Journey />
        <Stack />
        <Contact />
      </main>
      <Terminal open={term} onClose={closeTerm} />
      <Toast />
    </>
  )
}
