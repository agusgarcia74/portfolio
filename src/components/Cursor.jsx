import { useEffect, useRef } from 'react'
import { isTouch, prefersReduced } from '../lib/app'

// Cursor propio: un punto exacto + una gota que lo sigue con inercia, se estira con la
// velocidad y se agranda con una etiqueta sobre lo que tenga [data-cursor="texto"].
// Deja una estela de tinta que se seca sola.
export default function Cursor() {
  const dot = useRef(null)
  const blob = useRef(null)
  const label = useRef(null)
  const shape = useRef(null)
  const ink = useRef(null)

  useEffect(() => {
    if (isTouch()) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    const reduced = prefersReduced()

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const lag = { x: pos.x, y: pos.y }
    let size = 34, targetSize = 34
    let hidden = true
    let pressed = false
    let raf = 0

    const c = ink.current
    const ctx = c.getContext('2d')
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      c.width = innerWidth * dpr
      c.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    // estela que "quema" el fondo: la tinta se va secando pero deja su rastro tenue
    let last = null

    let green = false
    const setTarget = (el) => {
      green = !!el?.closest?.('.field, .contact')
      dot.current.classList.toggle('is-green', green)
      const hit = el?.closest?.('[data-cursor], a, button, [role="button"], input, textarea, label')
      const text = hit?.getAttribute?.('data-cursor')
      if (text) {
        targetSize = 92
        label.current.textContent = text
        blob.current.classList.add('is-label')
      } else if (hit) {
        targetSize = 56
        label.current.textContent = ''
        blob.current.classList.remove('is-label')
      } else {
        targetSize = 34
        label.current.textContent = ''
        blob.current.classList.remove('is-label')
      }
      blob.current.classList.toggle('is-text', !hit && !!el?.closest?.('p, h1, h2, h3, li') && !el.closest('[data-cursor]'))
    }

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (hidden) {
        hidden = false
        lag.x = pos.x
        lag.y = pos.y
        root.classList.remove('cursor-hidden')
      }
      setTarget(e.target)
      if (!reduced) {
        if (last) {
          const d = Math.hypot(pos.x - last.x, pos.y - last.y)
          if (d > 1) {
            ctx.strokeStyle = getComputedStyle(root).getPropertyValue(green ? '--green' : '--accent').trim()
            ctx.globalAlpha = 0.55
            ctx.lineCap = 'round'
            ctx.lineWidth = Math.max(1, 4 - d * 0.06)
            ctx.beginPath()
            ctx.moveTo(last.x, last.y)
            ctx.lineTo(pos.x, pos.y)
            ctx.stroke()
          }
        }
        last = { x: pos.x, y: pos.y }
      }
    }
    const onLeave = () => {
      hidden = true
      last = null
      root.classList.add('cursor-hidden')
    }
    const onDown = () => { pressed = true }
    const onUp = () => { pressed = false }
    const onScroll = () => { last = null }

    const loop = () => {
      // se seca la tinta
      ctx.globalCompositeOperation = 'destination-out'
      ctx.globalAlpha = 0.07
      ctx.fillRect(0, 0, innerWidth, innerHeight)
      ctx.globalCompositeOperation = 'source-over'

      const k = reduced ? 1 : 0.17
      const px = lag.x, py = lag.y
      lag.x += (pos.x - lag.x) * k
      lag.y += (pos.y - lag.y) * k
      size += (targetSize * (pressed ? 0.8 : 1) - size) * 0.18
      const vx = lag.x - px, vy = lag.y - py
      const speed = Math.min(Math.hypot(vx, vy), 40)
      const stretch = targetSize > 60 ? 1 : 1 + speed * 0.018
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI
      dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      blob.current.style.transform =
        `translate3d(${lag.x}px, ${lag.y}px, 0) rotate(${angle}deg) scale(${stretch}, ${1 / stretch})`
      shape.current.style.width = shape.current.style.height = `${size}px`
      label.current.style.transform = `rotate(${-angle}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    root.classList.add('cursor-hidden')
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor', 'cursor-hidden')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <canvas ref={ink} className="cursor-ink" />
      <div ref={blob} className="cursor-blob">
        <div ref={shape} className="cursor-shape">
          <span ref={label} className="cursor-label" />
        </div>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}
