// Smoke-Test der Musterlösung im echten Browser (lokales Chrome, kein Playwright-Download).
//
//   npm run dev -- -p 3123          # in einem zweiten Terminal
//   npm run test:smoke              # BASE_URL / CHROME_PATH optional überschreiben
//   npm run test:smoke -- --shots   # zusätzlich Screenshots nach tests/screenshots/
//
// Hinweis: Next 16 lässt vorherige Routen versteckt im DOM, daher `>> visible=true`.

import { mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright-core"

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3123"
const CHROME_PATH =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const shotsDir = process.argv.includes("--shots")
  ? join(dirname(fileURLToPath(import.meta.url)), "screenshots")
  : null
if (shotsDir) mkdirSync(shotsDir, { recursive: true })

let failures = 0
function check(label, actual, expected) {
  const ok = actual === expected
  if (!ok) failures++
  console.log(`${ok ? "✔" : "✖"} ${label}: ${actual}${ok ? "" : ` (erwartet ${expected})`}`)
}

const browser = await chromium.launch({ executablePath: CHROME_PATH })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
await context.grantPermissions(["clipboard-read", "clipboard-write"])
const page = await context.newPage()
const errors = []
page.on("pageerror", (e) => errors.push(e.message))
page.on("console", (m) => m.type() === "error" && errors.push(m.text()))

const cards = () => page.locator('a[href^="/meetups/"] >> visible=true').count()
const shot = (name) => shotsDir && page.screenshot({ path: join(shotsDir, `${name}.png`) })

// Übersicht + Kategorienfilter (Default-Filter: Umkreis 30 km)
await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
await shot("overview")
check("Alle Meetups", await cards(), 27)
for (const [category, expected] of [["Outdoor", 3], ["Training", 3], ["Online", 5], ["Gesundheit", 4]]) {
  await page.getByRole("button", { name: category, exact: true }).click()
  check(`Kategorie ${category}`, await cards(), expected)
}
await page.getByRole("button", { name: "Alle Meetups", exact: true }).click()

// Suche behält gesetzte Filter
await page.getByRole("combobox", { name: "Datum" }).click()
await page.getByRole("option", { name: "Heute" }).click()
await page.getByRole("textbox", { name: "Meetups durchsuchen" }).fill("katz")
await page.keyboard.press("Enter")
await page.waitForURL(/q=katz/)
check("Suche „katz“ + Heute", await cards(), 3)

// Gruppen-Tab → Meetups einer Gruppe
await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
await page.getByRole("tab", { name: "Gruppen" }).click()
check("Gruppen", await page.locator("[data-slot=card-title] >> visible=true").count(), 8)
await page.getByRole("button", { name: "Meetups ansehen" }).first().click()
await page.waitForURL(/q=/)
check("Meetups der nächsten Gruppe (Clicker Cats)", await cards(), 3)

// Ort (Cookie): aus Bern sind nur Online-Meetups im Umkreis von 30 km
await page.getByRole("button", { name: "Ort" }).click()
await page.getByRole("menuitemradio", { name: "Bern" }).click()
await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
check("Ort Bern", await cards(), 5)

// Sprache (Cookie)
await page.getByRole("button", { name: "Sprache" }).click()
await page.getByRole("menuitemradio", { name: "English" }).click()
await page.waitForTimeout(800)
check("Englisch", await page.locator("h1 >> visible=true").textContent(), "Meetups near Bern, CH")
await context.clearCookies()

// Detailseite
await page.goto(`${BASE_URL}/meetups/leinenspaziergang-uetliberg`, { waitUntil: "networkidle" })
check("Detail-Titel", await page.locator("h1 >> visible=true").textContent(), "Leinenspaziergang auf den Uetliberg")
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: "networkidle" })
await shot("detail")
const attendees = () =>
  page.locator("h2:has-text('Teilnehmende') [data-slot=badge] >> visible=true").textContent()
check("Teilnehmende vorher", await attendees(), "3")

// Teilnehmen → Dialog → Toast → Status
await page.getByRole("button", { name: "Teilnehmen", exact: true }).last().click()
await shot("detail-dialog")
await page.getByRole("button", { name: "Teilnahme bestätigen" }).click()
await page.waitForTimeout(400)
check("Teilnehmende nach Zusage", await attendees(), "4")
await page.reload({ waitUntil: "networkidle" })
check("Status bleibt nach Reload", await page.getByRole("button", { name: "Du nimmst teil" }).count(), 1)

// Absagen
await page.getByRole("button", { name: "Du nimmst teil" }).click()
await page.getByRole("button", { name: "Absagen" }).click()
await page.waitForTimeout(400)
check("Teilnehmende nach Absage", await attendees(), "3")

// Teilnehmenden-Dialog
await page.getByRole("button", { name: "Alle anzeigen" }).click()
check("Einträge im Teilnehmenden-Dialog", await page.locator("[role=dialog] [data-slot=item]").count(), 3)
await page.keyboard.press("Escape")

// Unbekannter Slug – zeigt die 404-Seite. Der HTTP-Status ist (noch) 200, weil notFound()
// erst innerhalb der Suspense-Grenze aufgerufen wird (siehe TODO.md).
await page.goto(`${BASE_URL}/meetups/gibt-es-nicht`, { waitUntil: "networkidle" })
check(
  "404-Seite für unbekanntes Meetup",
  await page.getByText("This page could not be found.").isVisible(),
  true
)

check("Konsolen-Fehler", errors.length, 0)
errors.forEach((e) => console.log(`    ${e}`))

await browser.close()
console.log(failures ? `\n${failures} Prüfung(en) fehlgeschlagen` : "\nAlles grün")
process.exit(failures ? 1 : 0)
