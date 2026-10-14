import { useId } from 'react'

// Júpiter (modo oscuro) o la Luna (modo papel), en SVG. Las bandas de Júpiter se
// desplazan para simular la rotación; la Gran Mancha Roja viaja con su banda.
const BANDS = [
  ['#f1e2c8', 10], ['#d9a978', 7], ['#efd9b8', 6], ['#b97a4a', 9], ['#e8c9a0', 7],
  ['#f4e6cf', 12], ['#c88d5c', 8], ['#e9cfa8', 6], ['#a8683f', 7], ['#e2c29a', 8],
  ['#f0dcc0', 10], ['#c4875a', 10],
]

// Versión "en negro" para el fondo: mismas bandas, tonos casi negros.
const DARK = ['#151612', '#1d1e19', '#121310', '#24251f', '#181915', '#101110', '#212219', '#171814', '#2a2620', '#1a1b16', '#131411', '#22201b']

export function Jupiter({ size = 200, moons = false, spin = true, dark = false }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  let y = 0
  const rows = BANDS.map(([c0, h], i) => {
    const c = dark ? DARK[i] : c0
    const r = { c, y, h }
    y += h
    return r
  })
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="planet planet-jupiter" aria-hidden="true">
      <defs>
        <clipPath id={`c${id}`}>
          <circle cx="50" cy="50" r="40" />
        </clipPath>
        <radialGradient id={`s${id}`} cx="35%" cy="35%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#c${id})`} transform="rotate(-8 50 50)">
        <g className={spin ? 'jupiter-bands' : ''}>
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${k * 100} 10)`}>
              {rows.map((r) => (
                <rect key={r.y} x="0" y={r.y} width="100" height={r.h + 0.4} fill={r.c} />
              ))}
              {/* turbulencia en los bordes de las bandas */}
              <path d="M0 29 q8 -2 16 0 t16 0 t16 0 t16 0 t16 0 t20 0" stroke={dark ? "#2d2a22" : "#a8683f"} strokeWidth="0.8" fill="none" opacity="0.5" />
              <path d="M0 55 q6 2 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t16 0" stroke={dark ? "#26241e" : "#c88d5c"} strokeWidth="0.7" fill="none" opacity="0.6" />
              <ellipse cx="62" cy="52" rx="7.5" ry="4.2" fill={dark ? '#2e1a12' : '#c0573a'} />
              <ellipse cx="62" cy="52" rx="5" ry="2.6" fill={dark ? '#3a2015' : '#d9744f'} />
            </g>
          ))}
        </g>
        <circle cx="50" cy="50" r="40" fill={`url(#s${id})`} />
      </g>
      {moons && (
        <g className="moons">
          <circle className="moon m1" r="2.8" fill="#e9d36b" />
          <circle className="moon m2" r="2.5" fill="#d8d2c4" />
          <circle className="moon m3" r="3.6" fill="#b5ab9c" />
          <circle className="moon m4" r="3.3" fill="#77706a" />
        </g>
      )}
    </svg>
  )
}

export function Moon({ size = 200, spin = true, light = false }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="planet planet-moon" aria-hidden="true">
      <defs>
        <clipPath id={`m${id}`}>
          <circle cx="50" cy="50" r="40" />
        </clipPath>
      </defs>
      <g clipPath={`url(#m${id})`}>
        <circle cx="50" cy="50" r="40" fill={light ? '#e6e2d6' : '#e9e6dc'} />
        <g className={spin ? 'moon-craters' : ''} fill={light ? '#dcd7c9' : '#cfcabd'}>
          <circle cx="35" cy="34" r="9" />
          <circle cx="60" cy="58" r="12" />
          <circle cx="66" cy="30" r="5" />
          <circle cx="30" cy="66" r="6" />
          <circle cx="48" cy="80" r="4" />
          <circle cx="78" cy="48" r="3.5" />
          <circle cx="44" cy="50" r="2.5" />
        </g>
        <g fill="none" stroke="#bdb7a8" strokeWidth="0.8">
          <circle cx="35" cy="34" r="9" />
          <circle cx="60" cy="58" r="12" />
        </g>
        {/* terminador: la sombra de la fase */}
        <circle className="moon-shadow" cx="78" cy="44" r="42" fill={light ? '#d6d0c0' : '#151511'} opacity={light ? 0.5 : 0.82} />
      </g>
      {!light && <circle cx="50" cy="50" r="40" fill="none" stroke="#151511" strokeWidth="1.2" />}
    </svg>
  )
}
