// Exporta el CV a PDF (y una vista previa PNG) con el Chrome/Edge instalado.
// Uso: node cv/build.mjs [es|en]
import { chromium } from 'playwright-core'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const lang = process.argv[2] || 'es'
const dir = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(dir, '..', 'public', 'cv')
const name = lang === 'es' ? 'Juan-Agustin-Garcia-CV.pdf' : 'Juan-Agustin-Garcia-Resume.pdf'
const candidates = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]
const executablePath = candidates.find((p) => existsSync(p))

const browser = await chromium.launch({ executablePath })
const page = await browser.newPage({ viewport: { width: 900, height: 1200 } })
await page.goto(pathToFileURL(path.join(dir, `cv-${lang}.html`)).href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
// avisa si el contenido no entra en una hoja
const overflow = await page.evaluate(() =>
  [...document.querySelectorAll('.side, .main')].map((el) => el.scrollHeight - el.clientHeight),
)
console.log('overflow (px, side/main):', overflow)
await page.pdf({ path: path.join(out, name), format: 'A4', printBackground: true, preferCSSPageSize: true })
await page.emulateMedia({ media: 'print' })
await page.locator('.page').screenshot({ path: path.join(dir, `preview-${lang}.png`), scale: 'device' })
await browser.close()
console.log('ok →', path.join('public', 'cv', name))
