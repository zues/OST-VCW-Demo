#!/usr/bin/env node
// Vergleicht contracts/tokens.json (aus Figma) mit src/app/globals.css.
// Tailwind-Verweise (z. B. "neutral-100") werden über die theme.css des
// Projekts in exakte oklch-Werte übersetzt.
//
//   node contracts/scripts/tokens.mjs [pfad]           Abweichungen anzeigen (Default: dieses Repo)
//   node contracts/scripts/tokens.mjs [pfad] --write   Werte in :root / .dark übernehmen
//
// --write ändert nur Variablen, die es in globals.css schon gibt. Figma-only-Tokens
// (z. B. ring-offset) werden nicht ergänzt. Exit-Code 1, wenn Abweichungen bestehen.

import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname, resolve as resolvePath } from "node:path"
import { fileURLToPath } from "node:url"

const args = process.argv.slice(2)
const write = args.includes("--write")
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const projectArg = args.find((a) => !a.startsWith("--"))
const project = projectArg ? resolvePath(projectArg) : root
const cssPath = join(project, "src/app/globals.css")

const tokens = JSON.parse(readFileSync(join(root, "contracts/tokens.json"), "utf8"))
const themeCss = readFileSync(join(project, "node_modules/tailwindcss/theme.css"), "utf8")

// ---------- Werte ----------

const num = (n, digits = 3) => String(+n.toFixed(digits))

// "oklch(97% 0 none)" | "oklch(0.97 0 0 / 10%)" → { l, c, h, a }
function parseOklch(value) {
  const m = value.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+|none)\s+([\d.]+|none)\s*(?:\/\s*([\d.]+%?))?\s*\)/)
  if (!m) return null
  const pct = (s, scale) => (s.endsWith("%") ? parseFloat(s) / scale : parseFloat(s))
  return {
    l: pct(m[1], 100),
    c: m[2] === "none" ? 0 : +m[2],
    h: m[3] === "none" ? 0 : +m[3],
    a: m[4] ? pct(m[4], 100) : 1,
  }
}

const formatOklch = ({ l, c, h, a }) =>
  `oklch(${num(l)} ${num(c)} ${num(h)}${a < 1 ? ` / ${num(a * 100, 1)}%` : ""})`

function hexToOklch(hex, alpha = 1) {
  const lin = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255))
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  const C = Math.hypot(A, B)
  const H = C < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360
  return { l: L, c: C < 1e-4 ? 0 : C, h: H, a: alpha }
}

function resolve(ref) {
  if (typeof ref === "object") return hexToOklch(ref.hex, ref.alpha)
  if (ref === "white") return { l: 1, c: 0, h: 0, a: 1 }
  if (ref === "black") return { l: 0, c: 0, h: 0, a: 1 }
  const m = themeCss.match(new RegExp(`--color-${ref}:\\s*([^;]+);`))
  if (!m) throw new Error(`Tailwind-Farbe "${ref}" nicht in theme.css gefunden`)
  return parseOklch(m[1])
}

const same = (x, y) =>
  Math.abs(x.l - y.l) < 0.002 &&
  Math.abs(x.c - y.c) < 0.002 &&
  (x.c < 0.002 || Math.abs(x.h - y.h) < 0.5) &&
  Math.abs(x.a - y.a) < 0.005

const label = (ref) => (typeof ref === "object" ? `${ref.hex} / ${ref.alpha * 100}%` : ref)

// ---------- globals.css ----------

let css = readFileSync(cssPath, "utf8")

function block(selector) {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`${selector} { … } nicht in globals.css gefunden`)
  const end = css.indexOf("}", start)
  return { start, end, body: css.slice(start, end) }
}

function vars(body) {
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
}

// ---------- Vergleich ----------

const problems = []
const modes = { light: ":root", dark: ".dark" }

for (const [mode, selector] of Object.entries(modes)) {
  const { start, end, body } = block(selector)
  const code = vars(body)
  let newBody = body

  for (const [name, refs] of Object.entries(tokens.colors)) {
    const want = resolve(refs[mode])
    if (!(name in code)) {
      problems.push(`${mode.padEnd(5)} --${name}: nur in Figma (${label(refs[mode])})`)
      continue
    }
    const have = parseOklch(code[name])
    if (!have || !same(have, want)) {
      problems.push(
        `${mode.padEnd(5)} --${name}: Figma ${label(refs[mode])} = ${formatOklch(want)}, Code ${code[name]}`
      )
      newBody = newBody.replace(`--${name}: ${code[name]};`, `--${name}: ${formatOklch(want)};`)
    }
  }
  for (const name of Object.keys(code)) {
    if (name !== "radius" && !(name in tokens.colors)) {
      problems.push(`${mode.padEnd(5)} --${name}: nur im Code`)
    }
  }

  // Radius: --radius = Figma radius/lg, Stufen über calc(var(--radius) * f) im @theme-Block
  if (mode === "light") {
    const base = parseFloat(code.radius) * 16
    if (base !== tokens.radius.lg) {
      problems.push(`radius --radius: Figma lg = ${tokens.radius.lg}px, Code ${code.radius}`)
      newBody = newBody.replace(`--radius: ${code.radius};`, `--radius: ${tokens.radius.lg / 16}rem;`)
    }
    for (const [step, px] of Object.entries(tokens.radius)) {
      if (step.startsWith("$")) continue
      const m = css.match(new RegExp(`--radius-${step}:\\s*([^;]+);`))
      if (!m) {
        problems.push(`radius --radius-${step}: nur in Figma (${px}px)`)
        continue
      }
      const factor = m[1].match(/\*\s*([\d.]+)/)
      const codePx = tokens.radius.lg * (factor ? +factor[1] : 1)
      if (Math.abs(codePx - px) > 0.01) {
        problems.push(`radius --radius-${step}: Figma ${px}px, Code ${num(codePx, 2)}px (${m[1]})`)
      }
    }
  }

  css = css.slice(0, start) + newBody + css.slice(end)
}

// Schriften: Figma-Familie muss in layout.tsx über next/font geladen werden
const layout = readFileSync(join(project, "src/app/layout.tsx"), "utf8")
for (const [slot, family] of Object.entries(tokens.font)) {
  if (!layout.includes(family.replace(/ /g, "_"))) {
    problems.push(`font  ${slot}: Figma "${family}" wird in layout.tsx nicht geladen`)
  }
}

if (write) writeFileSync(cssPath, css)

if (problems.length === 0) {
  console.log("✔ Tokens stimmen mit globals.css überein")
} else {
  console.log(problems.join("\n"))
  console.log(`\n${problems.length} Abweichung(en)${write ? " – Farb- und Radiuswerte übernommen" : ""}`)
  process.exitCode = write ? 0 : 1
}
