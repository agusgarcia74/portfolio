import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ui, SECRETS } from '../data/ui'

// Estado global chico: idioma, tema (oscuro / papel), modo turbo y secretos encontrados.
const AppCtx = createContext(null)

const store = {
  get(k, fallback) {
    try {
      const v = localStorage.getItem(k)
      return v == null ? fallback : JSON.parse(v)
    } catch {
      return fallback
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v))
    } catch {
      /* modo privado: no pasa nada */
    }
  },
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => store.get('jag.lang', 'es'))
  const [theme, setTheme] = useState(() => store.get('jag.theme', 'dark'))
  const [turbo, setTurbo] = useState(false)
  const [found, setFound] = useState(() => store.get('jag.secrets', []))
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(0)

  useEffect(() => {
    document.documentElement.lang = lang
    store.set('jag.lang', lang)
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    store.set('jag.theme', theme)
  }, [theme])

  const notify = useCallback((msg) => {
    clearTimeout(toastTimer.current)
    setToast({ ...msg, key: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 3600)
  }, [])

  const unlock = useCallback(
    (id) => {
      setFound((prev) => {
        if (prev.includes(id) || !SECRETS[id]) return prev
        const next = [...prev, id]
        store.set('jag.secrets', next)
        notify({ kind: 'secret', id, count: next.length })
        return next
      })
    },
    [notify],
  )

  const value = useMemo(() => {
    const T = ui[lang]
    // t() acepta un string plano o un objeto { es, en }
    const t = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[lang] ?? v.es : v)
    return {
      lang, setLang, T, t,
      theme, setTheme,
      turbo, setTurbo,
      found, unlock, total: Object.keys(SECRETS).length,
      toast, notify,
    }
  }, [lang, theme, turbo, found, unlock, toast, notify])

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export const useApp = () => useContext(AppCtx)

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
