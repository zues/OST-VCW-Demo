#!/usr/bin/env node
// Prüft die Contracts gegen Schema, DRIFT.md und Code: Sind die Contracts gültig, gibt es
// alle referenzierten Drift-IDs, Exports und gemappten Prop-Werte?
//
//   node contracts/scripts/check-code.mjs [pfad]   (Default: dieses Repo, z. B. ../OST-VC-Base für den Starter)

import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const project = process.argv[2] ? resolve(process.argv[2]) : root
const contractsDir = join(root, "contracts", "components")
const schema = JSON.parse(readFileSync(join(root, "contracts", "contract.schema.json"), "utf8"))
const driftIds = new Set(
  [...readFileSync(join(root, "contracts", "DRIFT.md"), "utf8").matchAll(/^\| (D-\d+) \|/gm)].map((m) => m[1])
)

// Schlanker Schema-Check (Typ, Pflichtfelder, Enum, Pattern, unbekannte Felder) – ohne Abhängigkeit
function validate(value, rule, path, errors) {
  if (rule.$ref) rule = rule.$ref.split("/").slice(1).reduce((o, k) => o[k], schema)
  const types = [rule.type ?? []].flat()
  const actual = value === null ? "null" : Array.isArray(value) ? "array" : typeof value
  if (types.length && !types.some((t) => t === actual || (t === "integer" && Number.isInteger(value)))) {
    errors.push(`${path}: ${actual} statt ${types.join("|")}`)
    return
  }
  if (rule.enum && !rule.enum.includes(value)) errors.push(`${path}: "${value}" nicht in ${rule.enum.join("|")}`)
  if (rule.pattern && typeof value === "string" && !new RegExp(rule.pattern).test(value)) {
    errors.push(`${path}: "${value}" passt nicht zu ${rule.pattern}`)
  }
  if (actual === "array" && rule.items) value.forEach((v, i) => validate(v, rule.items, `${path}[${i}]`, errors))
  if (actual === "object") {
    for (const key of rule.required ?? []) if (!(key in value)) errors.push(`${path}: Pflichtfeld ${key} fehlt`)
    for (const [key, v] of Object.entries(value)) {
      const sub = rule.properties?.[key] ?? (typeof rule.additionalProperties === "object" ? rule.additionalProperties : null)
      if (sub) validate(v, sub, `${path}.${key}`, errors)
      else if (rule.additionalProperties === false) errors.push(`${path}: unbekanntes Feld ${key}`)
    }
  }
}

const hasExport = (src, name) =>
  new RegExp(`(function|const)\\s+${name}\\b`).test(src)

// Wert kommt als Variant-Key (`outline:` / `"icon-sm":`) oder String-Literal vor
const hasValue = (src, value) =>
  new RegExp(`(^|[\\s{,])("${value}"|${value.replace(/[-]/g, "\\-")})\\s*:`, "m").test(src) ||
  src.includes(`"${value}"`)

// Quelltext einer Komponente: von `function Name(` bis zur nächsten Top-Level-Funktion
function functionBody(src, name) {
  const start = src.search(new RegExp(`^function ${name}\\b`, "m"))
  if (start < 0) return null
  const next = src.slice(start + 1).search(/^(function|const|export) /m)
  return next < 0 ? src.slice(start) : src.slice(start, start + 1 + next)
}

// Varianten eines cva()-Aufrufs: { variant: Set("default", "outline", …), size: … }
function cvaVariants(src, cvaName) {
  const start = src.indexOf(`const ${cvaName} = cva(`)
  const open = start < 0 ? -1 : src.indexOf("variants: {", start)
  if (open < 0) return {}
  const variants = {}
  let depth = 0, quote = null, token = "", current = null
  for (let i = open + "variants: ".length; i < src.length; i++) {
    const ch = src[i]
    if (quote) {
      if (ch === quote && src[i - 1] !== "\\") quote = null
      else token += ch
      continue
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; token = ""; continue }
    if (ch === "{") { depth++; continue }
    if (ch === "}") { if (--depth === 0) break; continue }
    if (ch === ":") {
      const key = token.trim()
      if (depth === 1 && key) variants[(current = key)] = new Set()
      else if (depth === 2 && key && current) variants[current].add(key)
      token = ""
      continue
    }
    if (ch === "," || ch === "\n") { token = ""; continue }
    token += ch
  }
  return variants
}

// Erlaubte Werte einer Prop: cva-Varianten der Komponente oder String-Union im Prop-Typ.
// null = nicht ermittelbar (dann nur schwache Prüfung über hasValue)
function allowedValues(src, exportName, prop) {
  const body = functionBody(src, exportName)
  if (!body) return null
  for (const [, cvaName] of body.matchAll(/(\w+Variants)\(/g)) {
    const values = cvaVariants(src, cvaName)[prop]
    if (values) return values
  }
  const union = body.match(new RegExp(`\\b${prop}\\?:\\s*((?:"[^"]+"\\s*\\|?\\s*)+)`))
  return union ? new Set([...union[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])) : null
}

// Alle Typdefinitionen eines Pakets als ein String (für Werte wie side="bottom" aus Base UI)
const packageCache = new Map()
function packageTypes(name) {
  if (!packageCache.has(name)) {
    const dir = join(project, "node_modules", name)
    const files = existsSync(dir)
      ? readdirSync(dir, { recursive: true }).filter((f) => String(f).endsWith(".d.ts"))
      : []
    packageCache.set(name, files.map((f) => readFileSync(join(dir, String(f)), "utf8")).join("\n"))
  }
  return packageCache.get(name)
}

function valueSource(src, valuesFrom) {
  if (valuesFrom?.component) {
    return readFileSync(join(project, "src/components/ui", `${valuesFrom.component}.tsx`), "utf8")
  }
  if (valuesFrom?.package) {
    return packageTypes(valuesFrom.package).replaceAll("'", '"')
  }
  return src
}

let errors = 0
let warnings = 0
let open = 0

for (const file of readdirSync(contractsDir).sort()) {
  const contract = JSON.parse(readFileSync(join(contractsDir, file), "utf8"))
  const codePath = join(project, contract.code.file)
  const problems = []

  validate(contract, schema, contract.id, problems)
  for (const issue of contract.issues ?? []) {
    if (issue.drift && !driftIds.has(issue.drift)) problems.push(`${issue.drift} gibt es nicht in DRIFT.md`)
  }

  // Eigene Kompositionen sind im Starter Aufgabe der Studierenden → offen statt Fehler
  if (!existsSync(codePath) && contract.kind === "composition") {
    console.log(`○ ${contract.id}: ${contract.code.file} noch nicht umgesetzt`)
    problems.forEach((p) => console.log(`    ✖ ${p}`))
    errors += problems.length
    open++
    continue
  }
  if (!existsSync(codePath)) {
    console.log(`✖ ${contract.id}: ${contract.code.file} fehlt`)
    problems.forEach((p) => console.log(`    ✖ ${p}`))
    errors += 1 + problems.length
    continue
  }
  const src = readFileSync(codePath, "utf8")

  // Eigene Komposition: verwendete shadcn-Teile müssen importiert sein,
  // feste Props (z. B. variant="secondary") im JSX vorkommen
  if (contract.kind === "composition") {
    for (const id of contract.uses ?? []) {
      if (!existsSync(join(contractsDir, `${id}.contract.json`))) {
        problems.push(`Contract "${id}" (uses) fehlt`)
      }
    }
    const used = new Set(contract.codeOnly ?? [])
    for (const layer of contract.layers ?? []) {
      if (layer.code?.part) used.add(layer.code.part)
      for (const [prop, value] of Object.entries(layer.code?.props ?? {})) {
        const literal = new RegExp(`${prop}=(\\{\\s*)?"?${value.replace(/\s/g, "\\s*")}"?`)
        if (!literal.test(src)) problems.push(`${layer.code.part}: ${prop}=${value} nicht im Code`)
      }
    }
    for (const name of used) {
      if (!new RegExp(`import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`).test(src)) {
        problems.push(`${name} wird nicht importiert`)
      }
    }
  }

  const exportsToCheck = new Set(contract.kind === "composition" ? [] : contract.codeOnly ?? [])
  // Pro Export + Prop: Werte aus Figma bzw. codeOnlyValues → Vollständigkeit gegen den Code
  const covered = new Map()
  const cover = (exp, prop, value) => {
    const key = `${exp}.${prop}`
    if (!covered.has(key)) covered.set(key, { exp, prop, values: new Set() })
    covered.get(key).values.add(value)
  }
  function checkValue(exp, prop, value, label, valuesFrom) {
    if (value === "true" || value === "false") {
      // Boolean-Prop: es reicht, dass die Komponente die Prop kennt
      if (!new RegExp(`\\b${prop}\\b`).test(functionBody(src, exp) ?? src)) problems.push(`${label}: ${exp} kennt ${prop} nicht`)
      return
    }
    let allowed = valuesFrom ? null : allowedValues(src, exp, prop)
    if (valuesFrom?.component) {
      // Werte aus einer anderen ui-Komponente, z. B. InputGroupButton → Button
      const other = readFileSync(join(project, "src/components/ui", `${valuesFrom.component}.tsx`), "utf8")
      const cvaNames = [...other.matchAll(/const (\w+) = cva\(/g)].map((m) => m[1])
      allowed = cvaNames.map((n) => cvaVariants(other, n)[prop]).find(Boolean) ?? null
    }
    if (allowed) {
      cover(exp, prop, value)
      if (!allowed.has(value)) problems.push(`${label}: ${exp} ${prop}="${value}" gibt es im Code nicht (${[...allowed].join("|")})`)
    } else if (!hasValue(valueSource(src, valuesFrom), value)) {
      problems.push(`${label}: Wert "${value}" nicht im Code`)
    }
  }
  for (const part of contract.parts) {
    const partExport = part.code?.export?.split("|")[0].trim()
    if (part.code?.export) {
      part.code.export.split("|").map((s) => s.trim()).forEach((e) => exportsToCheck.add(e))
    }
    for (const prop of part.props) {
      if (prop.code?.part) exportsToCheck.add(prop.code.part)
      const target = prop.code?.part ?? partExport
      if (prop.code?.prop && prop.code.value) {
        checkValue(target, prop.code.prop, prop.code.value, `Figma ${prop.figma}`, prop.code.valuesFrom)
      }
      if (prop.code?.prop && prop.values && !prop.code.expression) {
        for (const [figmaValue, codeValue] of Object.entries(prop.values)) {
          if (codeValue === null) continue
          checkValue(target, prop.code.prop, codeValue, `Figma ${prop.figma}=${figmaValue}`, prop.code.valuesFrom)
        }
      }
    }
  }
  for (const { export: exp, prop, values, valuesFrom } of contract.codeOnlyValues ?? []) {
    for (const value of values) checkValue(exp, prop, value, "codeOnlyValues", valuesFrom)
  }
  // Code-Werte, die weder aus Figma gemappt noch als codeOnlyValues eingetragen sind
  for (const { exp, prop, values } of covered.values()) {
    const missing = [...(allowedValues(src, exp, prop) ?? [])].filter((v) => !values.has(v))
    if (missing.length) {
      problems.push(`${exp} ${prop}: Code-Werte ohne Mapping: ${missing.join(", ")} (in Figma-Mapping oder codeOnlyValues eintragen)`)
    }
  }
  for (const name of exportsToCheck) {
    if (!hasExport(src, name)) problems.push(`Export ${name} nicht gefunden`)
  }

  const openIssues = (contract.issues ?? []).filter((i) => i.severity !== "info")
  warnings += openIssues.length
  errors += problems.length

  const mark = problems.length ? "✖" : openIssues.length ? "△" : "✔"
  console.log(`${mark} ${contract.id} (${contract.status}, ${contract.parts.length} Figma-Komponenten)`)
  problems.forEach((p) => console.log(`    ✖ ${p}`))
  openIssues.forEach((i) => console.log(`    △ ${i.message}`))
}

console.log(`\n${errors} Fehler, ${warnings} offene Warnungen${open ? `, ${open} Komposition(en) noch nicht umgesetzt` : ""}`)
process.exit(errors ? 1 : 0)
