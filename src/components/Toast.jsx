import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../lib/app'
import { SECRETS } from '../data/ui'
import { EASE } from './fx'

export default function Toast() {
  const { toast, T, t, total } = useApp()
  return (
    <div className="toast-wrap" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            className="toast"
            initial={{ y: 40, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {toast.kind === 'secret' ? (
              <>
                <span className="toast-count">
                  {toast.count}/{total}
                </span>
                <span>
                  <strong>{T.secrets.found}</strong>
                  <br />
                  {t(SECRETS[toast.id])}
                </span>
              </>
            ) : (
              <span>{toast.text}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
