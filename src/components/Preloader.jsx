import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE } from './fx'
import { prefersReduced } from '../lib/app'

// Al entrar, el sitio "se imprime": sale una hoja de la ranura con los datos y el porcentaje.
// Se muestra una vez por sesión y se saltea con click o cualquier tecla.
const LINES = ['JUAN AGUSTÍN GARCIA', 'FULL STACK DEVELOPER', 'CÓRDOBA · ARGENTINA', 'UTN · SISTEMAS + IA']

export default function Preloader({ onDone }) {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('jag.printed') && !prefersReduced()
    } catch {
      return !prefersReduced()
    }
  })
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (!show) {
      onDone()
      return
    }
    const start = performance.now()
    const total = 2100
    let raf = 0
    const tick = (t) => {
      const p = Math.min(1, (t - start) / total)
      setPct(Math.round((1 - Math.pow(1 - p, 2.2)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else finish()
    }
    const finish = () => {
      cancelAnimationFrame(raf)
      try { sessionStorage.setItem('jag.printed', '1') } catch { /* nada */ }
      setShow(false)
      onDone()
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('keydown', finish, { once: true })
    window.addEventListener('pointerdown', finish, { once: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: EASE }}
          data-cursor="saltear"
        >
          <div className="preloader-printer">
            <div className="preloader-slot" />
            <div className="preloader-paper-wrap" style={{ height: `${pct * 3}px` }}>
              <div className="preloader-paper">
                <p className="preloader-head">PRINTSERVER · JOB #2005</p>
                {LINES.map((l, i) => (
                  <p key={l} className="preloader-line" style={{ opacity: pct > 18 + i * 16 ? 1 : 0 }}>
                    {l}
                  </p>
                ))}
                <div className="preloader-barcode" aria-hidden="true">
                  {Array.from({ length: 34 }, (_, i) => (
                    <span key={i} style={{ width: ((i * 7) % 4) + 1 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="preloader-pct" aria-live="polite">
            {pct}
            <span>%</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
