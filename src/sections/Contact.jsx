import { useRef, useState } from 'react'
import HeronPerch from '../components/Heron'
import { motion } from 'motion/react'
import { useApp } from '../lib/app'
import { site } from '../data/site'
import { Lines, Reveal, R, Magnetic, Arrow, EASE } from '../components/fx'

export default function Contact() {
  const { T, t, found, total } = useApp()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }
  return (
    <section className="contact" id="contacto">
      <div className="contact-inner">
        <Lines text={T.contact.title} className="contact-title" />
        <Reveal className="contact-grid">
          <R as="p" className="statement">{T.contact.body}</R>
          <R className="contact-actions">
            <button className="contact-mail" onClick={copy} data-cursor={copied ? T.contact.copied : 'copiar'}>
              <span className="contact-mail-text">{site.email}</span>
              <motion.span
                className="contact-mail-state"
                key={copied ? 'y' : 'n'}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {copied ? T.contact.copied : T.contact.copy}
              </motion.span>
            </button>
            <div className="contact-links">
              <Magnetic>
                <a className="btn btn-green" href={`mailto:${site.email}`} data-cursor="escribir">
                  Email <Arrow />
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn-ghost" href={site.github} target="_blank" rel="noreferrer" data-cursor="github">
                  GitHub <Arrow />
                </a>
              </Magnetic>
              {site.linkedin && (
                <Magnetic>
                  <a className="btn btn-ghost" href={site.linkedin} target="_blank" rel="noreferrer" data-cursor="linkedin">
                    LinkedIn <Arrow />
                  </a>
                </Magnetic>
              )}
              {site.cv ? (
                <a className="btn btn-ghost" href={t(site.cv)} download data-cursor="descargar">CV <Arrow /></a>
              ) : (
                <span className="note">{T.contact.cv}</span>
              )}
            </div>
          </R>
        </Reveal>
      </div>
      <Footer found={found.length} total={total} />
    </section>
  )
}

function Footer({ found, total }) {
  const { T } = useApp()
  const footer = useRef(null)
  const accent = useRef(null)
  return (
    <footer className="footer" ref={footer}>
      <HeronPerch footer={footer} accent={accent} />
      <p className="footer-name" aria-hidden="true">
        Garc<span ref={accent} className="footer-i">í</span>a
      </p>
      <div className="footer-row">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>{T.contact.made}</span>
        <span className="tabular">
          {found}/{total} {T.secrets.label}
        </span>
      </div>
    </footer>
  )
}
