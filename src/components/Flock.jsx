import { useEffect, useRef } from 'react'
import { useApp, prefersReduced } from '../lib/app'

// Bandada (boids) en canvas. El cursor es un depredador: la bandada lo esquiva.
// Click = espantar. Modo turbo (Konami) = más rápida y en color de acento.
export default function Flock() {
  const ref = useRef(null)
  const { turbo, theme } = useApp()
  const opts = useRef({ turbo, theme })
  opts.current = { turbo, theme }

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = prefersReduced()
    let w = 0, h = 0, dpr = 1
    let birds = []
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999, active: false }
    const shocks = []

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.round(Math.min(260, Math.max(70, (w * h) / 6500)))
      while (birds.length < target) birds.push(spawn())
      birds.length = target
    }

    const spawn = () => {
      const a = Math.random() * Math.PI * 2
      return {
        x: Math.random() * (w || 1200),
        y: Math.random() * (h || 800),
        vx: Math.cos(a) * 1.5,
        vy: Math.sin(a) * 1.5,
        flap: Math.random() * Math.PI * 2,
        size: 0.7 + Math.random() * 0.7,
      }
    }

    const step = () => {
      const { turbo } = opts.current
      const maxSpeed = turbo ? 5.2 : 2.3
      const minSpeed = turbo ? 2.4 : 1.1
      const view = 46, sep = 18
      const n = birds.length
      for (let i = 0; i < n; i++) {
        const b = birds[i]
        let ax = 0, ay = 0, cx = 0, cy = 0, vx = 0, vy = 0, sx = 0, sy = 0, count = 0
        for (let j = 0; j < n; j++) {
          if (i === j) continue
          const o = birds[j]
          const dx = o.x - b.x, dy = o.y - b.y
          if (dx > view || dx < -view || dy > view || dy < -view) continue
          const d2 = dx * dx + dy * dy
          if (d2 > view * view) continue
          count++
          cx += o.x; cy += o.y; vx += o.vx; vy += o.vy
          if (d2 < sep * sep) { sx -= dx / (d2 + 1); sy -= dy / (d2 + 1) }
        }
        if (count) {
          ax += (cx / count - b.x) * 0.0009 + (vx / count - b.vx) * 0.045
          ay += (cy / count - b.y) * 0.0009 + (vy / count - b.vy) * 0.045
        }
        ax += sx * 1.4
        ay += sy * 1.4
        // depredador
        if (mouse.active) {
          const dx = b.x - mouse.x, dy = b.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < 170 * 170) {
            const f = (1 - Math.sqrt(d2) / 170) * 0.9
            const d = Math.sqrt(d2) || 1
            ax += (dx / d) * f
            ay += (dy / d) * f
          }
        }
        // ondas de click
        for (const s of shocks) {
          const dx = b.x - s.x, dy = b.y - s.y
          const d = Math.sqrt(dx * dx + dy * dy) || 1
          if (Math.abs(d - s.r) < 40) { ax += (dx / d) * 2.2; ay += (dy / d) * 2.2 }
        }
        // bordes suaves
        const m = 60
        if (b.x < m) ax += 0.06
        if (b.x > w - m) ax -= 0.06
        if (b.y < m) ay += 0.06
        if (b.y > h - m) ay -= 0.06

        b.vx += ax; b.vy += ay
        const sp = Math.hypot(b.vx, b.vy) || 1
        const clamped = Math.min(maxSpeed, Math.max(minSpeed, sp))
        b.vx = (b.vx / sp) * clamped
        b.vy = (b.vy / sp) * clamped
        b.x += b.vx; b.y += b.vy
        b.flap += 0.18 + clamped * 0.05
        if (b.x < -20) b.x = w + 20
        if (b.x > w + 20) b.x = -20
        if (b.y < -20) b.y = h + 20
        if (b.y > h + 20) b.y = -20
      }
      for (let i = shocks.length - 1; i >= 0; i--) {
        shocks[i].r += 9
        if (shocks[i].r > 520) shocks.splice(i, 1)
      }
    }

    const draw = () => {
      const { turbo, theme } = opts.current
      const styles = getComputedStyle(document.documentElement)
      const ink = styles.getPropertyValue('--flock').trim() || '#eeede6'
      const accent = styles.getPropertyValue('--accent').trim() || '#ff5a1f'
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const s of shocks) {
        ctx.strokeStyle = accent
        ctx.globalAlpha = Math.max(0, 0.35 * (1 - s.r / 520))
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.stroke()
      }
      for (let i = 0; i < birds.length; i++) {
        const b = birds[i]
        const a = Math.atan2(b.vy, b.vx)
        const wing = Math.sin(b.flap) * 3.2 * b.size
        const len = 5.5 * b.size
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(a)
        const near = mouse.active && Math.hypot(b.x - mouse.x, b.y - mouse.y) < 170
        ctx.strokeStyle = turbo || near ? accent : ink
        ctx.globalAlpha = theme === 'paper' ? 0.75 : 0.55 + b.size * 0.25
        ctx.lineWidth = 1.3 * b.size
        ctx.beginPath()
        ctx.moveTo(-len, -len - wing)
        ctx.quadraticCurveTo(-len * 0.2, -1, len * 0.6, 0)
        ctx.quadraticCurveTo(-len * 0.2, 1, -len, len + wing)
        ctx.stroke()
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }

    const loop = () => {
      if (visible) {
        step()
        draw()
      }
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = mouse.y > -40 && mouse.y < r.height + 40
    }
    const onLeave = () => { mouse.active = false }
    const onDown = (e) => {
      const r = canvas.getBoundingClientRect()
      const y = e.clientY - r.top
      if (y < 0 || y > r.height) return
      if (e.target.closest('a,button,input,[data-no-shock]')) return
      shocks.push({ x: e.clientX - r.left, y, r: 0 })
    }

    resize()
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)

    if (reduced) {
      for (let i = 0; i < 60; i++) step()
      draw()
    } else {
      raf = requestAnimationFrame(loop)
    }
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return <canvas ref={ref} className="flock" aria-hidden="true" />
}
