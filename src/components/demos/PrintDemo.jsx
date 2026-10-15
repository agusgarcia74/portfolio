import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../../lib/app'
import { EASE } from '../fx'

// Réplica de PrintServer: elegís páginas por hoja, doble faz y copias, ves la hoja armada
// y al imprimir las hojas viajan celular → PC → impresora, que saca un ticket del trabajo.
const DOC_PAGES = 12
const NUP = { 1: [1, 1], 2: [2, 1], 4: [2, 2], 6: [3, 2], 9: [3, 3] }
const FILE = 'apunte-sistemas-operativos.pdf'

export default function PrintDemo() {
  const { lang, unlock } = useApp()
  const es = lang === 'es'
  const [n, setN] = useState(4)
  const [duplex, setDuplex] = useState(false)
  const [copies, setCopies] = useState(1)
  const [stage, setStage] = useState('idle') // idle | wifi | pc | usb | done
  const [tickets, setTickets] = useState([])
  const [flip, setFlip] = useState(false)
  const [log, setLog] = useState([{ id: 0, t: '09:41:02', text: 'PrintServer listo · escuchando en la red local', kind: 'sys' }])
  const job = useRef(2005)
  const logId = useRef(1)
  const push = (text, kind = 'info') => {
    const t = new Date().toLocaleTimeString('es-AR', { hour12: false })
    setLog((l) => [...l, { id: logId.current++, t, text, kind }].slice(-7))
  }

  const faces = Math.ceil(DOC_PAGES / n)
  const sheets = (duplex ? Math.ceil(faces / 2) : faces) * copies
  const [cols, rows] = NUP[n]
  const landscape = cols > rows
  const busy = stage !== 'idle' && stage !== 'done'

  const print = () => {
    if (busy) return
    if (duplex && !flip) {
      // primera pasada de la doble faz manual
      setFlip(true)
    } else {
      setFlip(false)
    }
    job.current += 1
    const id = job.current
    const snap = { id, n, copies, sheets, duplex }
    setStage('wifi')
    push(`POST /api/upload 200 · ${FILE}`)
    setTimeout(() => {
      setStage('pc')
      push(`to_pdf ok · ${DOC_PAGES} págs · ${n} por hoja → ${faces} caras`)
    }, 900)
    setTimeout(() => push(`raster 300 dpi${duplex ? ' · doble faz manual' : ''}`), 1400)
    setTimeout(() => {
      setStage('usb')
      push('spooler OK → HP LaserJet Pro M12w')
    }, 1900)
    setTimeout(() => {
      push(`job #${id} impreso · ${sheets} ${sheets === 1 ? 'hoja' : 'hojas'}`, 'ok')
      setStage('done')
      setTickets((t) => [...t.slice(-1), snap])
      unlock('print')
    }, 2800)
  }

  const label = {
    idle: es ? 'Listo para imprimir' : 'Ready to print',
    wifi: es ? 'Subiendo por Wi-Fi a la PC…' : 'Uploading over Wi-Fi…',
    pc: es ? 'La PC convierte y arma las hojas…' : 'The PC converts and lays out the sheets…',
    usb: es ? 'A la cola de Windows…' : 'Into the Windows queue…',
    done: es ? 'Impreso. Retirá tu ticket.' : 'Printed. Take your receipt.',
  }[stage]

  return (
    <div className="pdemo" data-ui>
      <div className="pdemo-top">
        <div className="pdemo-phone">
          <div className="pdemo-notch" aria-hidden="true" />
          <div className="pdemo-header">
            <span className="pdemo-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M7 3h10v5H7zM4 9h16a1 1 0 0 1 1 1v6h-4v5H7v-5H3v-6a1 1 0 0 1 1-1zm5 7v3h6v-3z" fill="currentColor" /></svg>
            </span>
            <div>
              <p className="pdemo-title">{es ? 'Impresora' : 'Printer'}</p>
              <p className="pdemo-state"><span className="pdemo-led" />HP LaserJet · {busy ? (es ? 'Imprimiendo' : 'Printing') : es ? 'Lista' : 'Ready'}</p>
            </div>
          </div>
          <div className="pdemo-file">
            <span className="pdemo-file-icon" aria-hidden="true">PDF</span>
            <span>
              <strong>{FILE}</strong>
              <br />
              {DOC_PAGES} {es ? 'páginas' : 'pages'}
            </span>
          </div>

          <p className="pdemo-label">{es ? 'Páginas por hoja' : 'Pages per sheet'}</p>
          <div className="pdemo-seg" role="radiogroup">
            {Object.keys(NUP).map((k) => (
              <button key={k} role="radio" aria-checked={+k === n} className={+k === n ? 'is-on' : ''} onClick={() => setN(+k)} data-cursor={`${k} x hoja`}>
                {k}
              </button>
            ))}
          </div>

          <div className="pdemo-row">
            <button className={`pdemo-toggle ${duplex ? 'is-on' : ''}`} onClick={() => { setDuplex((d) => !d); setFlip(false) }} aria-pressed={duplex} data-cursor="doble faz">
              <span className="pdemo-switch" aria-hidden="true" />
              {es ? 'Doble faz' : 'Duplex'}
            </button>
            <div className="pdemo-copies">
              <button onClick={() => setCopies((c) => Math.max(1, c - 1))} aria-label="Menos copias">−</button>
              <span className="tabular">{copies}</span>
              <button onClick={() => setCopies((c) => Math.min(9, c + 1))} aria-label="Más copias">+</button>
            </div>
          </div>

          <div className="pdemo-summary">
            <span>{es ? 'Hojas' : 'Sheets'}</span>
            <strong className="tabular">{sheets}</strong>
          </div>

          <button className="pdemo-print" onClick={print} disabled={busy} data-cursor="imprimir">
            {busy
              ? es ? 'Imprimiendo…' : 'Printing…'
              : flip
                ? es ? 'Ya di vuelta las hojas' : 'Sheets flipped, continue'
                : `${es ? 'Imprimir' : 'Print'} · ${sheets} ${es ? (sheets === 1 ? 'hoja' : 'hojas') : sheets === 1 ? 'sheet' : 'sheets'}`}
          </button>
          <AnimatePresence>
            {flip && !busy && (
              <motion.p className="pdemo-flip" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                {es ? 'Pasada 1 de 2 lista. Dá vuelta el papel y volvé a ponerlo.' : 'Pass 1 of 2 done. Flip the paper and put it back.'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="pdemo-preview">
          <p className="pdemo-caption">{es ? 'Vista previa' : 'Preview'} · {es ? 'hoja 1 de' : 'sheet 1 of'} {faces}</p>
          <motion.div className={`pdemo-sheet ${landscape ? 'is-land' : ''}`} layout transition={{ duration: 0.5, ease: EASE }}>
            <div className="pdemo-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
              {Array.from({ length: n }, (_, i) => (
                <motion.div
                  key={`${n}-${i}`}
                  className="pdemo-page"
                  initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.035, ease: EASE }}
                >
                  <span className="pdemo-h" />
                  <span className="pdemo-l" />
                  <span className="pdemo-l w2" />
                  {i % 3 === 1 ? <span className="pdemo-fig" /> : <span className="pdemo-l w3" />}
                  <span className="pdemo-l" />
                  <span className="pdemo-l w2" />
                  <span className="pdemo-pnum">{i + 1}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* recorrido: celular → PC → impresora */}
      <div className="pdemo-lane">
        <div className="pdemo-wire" aria-hidden="true">
          <span className={`pdemo-wire-fill s-${stage}`} />
        </div>
        <Node icon="phone" cls="n-phone" label={es ? 'Tu celular' : 'Your phone'} on={stage !== 'idle'} />
        <div className="pdemo-console" aria-live="polite">
          <p className="pdemo-console-bar">python app.py</p>
          <AnimatePresence initial={false}>
            {log.map((l) => (
              <motion.p
                key={l.id}
                className={`pdemo-log ${l.kind}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span>{l.t}</span> {l.text}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
        <Node icon="pc" cls="n-pc" label={es ? 'Mi PC · Flask' : 'My PC · Flask'} on={['pc', 'usb', 'done'].includes(stage)} busy={stage === 'pc'} />
        <div className="pdemo-printer-node">
          <Node icon="printer" label="HP LaserJet" on={['usb', 'done'].includes(stage)} busy={stage === 'usb'} />
          <div className="pdemo-slot" aria-hidden="true" />
          <div className="pdemo-out">
            <AnimatePresence>
              {tickets.map((tk, i) => (
                <motion.button
                  key={tk.id}
                  className="pdemo-ticket"
                  style={{ zIndex: i }}
                  initial={{ y: '-100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '160%', rotate: 18, opacity: 0 }}
                  transition={{ duration: 1.1, ease: EASE }}
                  onClick={() => setTickets((t) => t.filter((x) => x.id !== tk.id))}
                  data-cursor={es ? 'arrancar' : 'tear off'}
                >
                  <span className="pt-head">PRINTSERVER</span>
                  <span className="pt-sub">JOB #{tk.id}</span>
                  <span className="pt-row"><span>{es ? 'Archivo' : 'File'}</span><span>SO.pdf</span></span>
                  <span className="pt-row"><span>{es ? 'Págs.' : 'Pages'}</span><span>{DOC_PAGES}</span></span>
                  <span className="pt-row"><span>{es ? 'Por hoja' : 'Per sheet'}</span><span>{tk.n}</span></span>
                  <span className="pt-row"><span>{es ? 'Copias' : 'Copies'}</span><span>{tk.copies}</span></span>
                  <span className="pt-row"><span>{es ? 'Doble faz' : 'Duplex'}</span><span>{tk.duplex ? (es ? 'sí' : 'yes') : 'no'}</span></span>
                  <span className="pt-total"><span>{es ? 'Hojas' : 'Sheets'}</span><span>{tk.sheets}</span></span>
                  <span className="pt-ok">OK ✓</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {busy && (
            <motion.span
              key={job.current}
              className="pdemo-packet"
              initial={{ left: '6%', opacity: 0 }}
              animate={{
                left: ['6%', '30%', '50%', '50%', '70%', '86%'],
                top: [38, 4, 30, 30, 0, 34],
                opacity: [0, 1, 1, 1, 1, 1],
                rotate: [-10, -18, 6, 0, -16, 10],
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 2.7, times: [0, 0.18, 0.36, 0.62, 0.8, 1], ease: 'easeInOut' }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 48 32" width="46" height="30">
                <path d="M2 14 L46 2 L30 30 L22 19 Z" fill="var(--paper)" />
                <path d="M46 2 L22 19 L20 28 L26 22" fill="#d8d3c4" />
                <path d="M2 14 L46 2 L22 19" fill="none" stroke="#bdb6a4" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <p className={`pdemo-status s-${stage}`} aria-live="polite">{label}</p>
    </div>
  )
}

function Node({ icon, label, on, busy, cls = '' }) {
  return (
    <div className={`pdemo-node ${cls} ${on ? 'is-on' : ''} ${busy ? 'is-busy' : ''}`}>
      <span className="pdemo-node-icon" aria-hidden="true">
        {icon === 'phone' && (
          <svg viewBox="0 0 48 48"><rect x="14" y="4" width="20" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" /><circle cx="24" cy="38" r="1.8" fill="currentColor" /></svg>
        )}
        {icon === 'pc' && (
          <svg viewBox="0 0 48 48"><rect x="5" y="7" width="38" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="M18 41h12M24 32v9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><path d="M12 15h14M12 20h20M12 25h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" /></svg>
        )}
        {icon === 'printer' && (
          <svg viewBox="0 0 48 48"><path d="M14 6h20v10H14z" fill="none" stroke="currentColor" strokeWidth="2.5" /><rect x="5" y="16" width="38" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" /><circle cx="36" cy="23" r="2" fill="currentColor" /><path d="M14 30h20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
        )}
      </span>
      <span className="pdemo-node-label">{label}</span>
    </div>
  )
}
