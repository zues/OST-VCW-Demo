# Contracts: Figma ↔ shadcn/ui

Ein Contract pro shadcn-Komponente beschreibt, wie die Komponente im Figma-File **„OST“**
(shadcn/ui kit von shadcndesign.com) und im Code (`src/components/ui/*.tsx`, Stil `base-nova`)
zusammenhängen. Das Format ist angelehnt an
[southleft/ds-contracts-poc](https://github.com/southleft/ds-contracts-poc), aber bewusst schlank.

```
contracts/
├── contract.schema.json      ← JSON-Schema
├── components/*.contract.json
├── tokens.json               ← Design-Tokens aus Figma (Farben, Radien, Schriften)
├── DRIFT.md                  ← Abweichungen Figma ↔ Code (ID, Typ, Status)
├── DRIFT-LOG.md              ← Protokoll der Entscheidungen (Ausgangslage → Entscheidung → Änderung)
└── scripts/
    ├── check-code.mjs        ← prüft die Contracts gegen den Code
    ├── figma-check.mjs       ← erzeugt ein Prüfscript für die Figma-Seite (figma-console MCP)
    └── tokens.mjs            ← vergleicht tokens.json mit globals.css
```

## Aufbau eines Contracts

- `parts[]`: je eine Figma-Komponente bzw. ein Component Set (mit `id` und `key`) und ihr
  Gegenstück im Code (`export`).
- `parts[].props[]`: je eine Figma-Property und wie sie im Code umgesetzt wird:
  - `prop` – React-Prop, `values` bildet Figma-Werte auf Code-Werte ab
  - `part` – Unterkomponente (z. B. `CardTitle`)
  - `children` / `child` – Inhalt bzw. JSX-Muster
  - `state` – Interaktionszustand (Hover, Focus …), im Code CSS/ARIA statt Prop
  - `composition` – Wert wählt eine andere Zusammensetzung
  - `inherited` – Wert ergibt sich aus der Eltern-Komponente
  - `code: null` bzw. Wert `null` – gibt es nur in Figma
- `codeOnly`: Exports ohne eigene Figma-Komponente
- `kind: "composition"` (eigene Komponenten wie `MeetupCard`): zusätzlich `uses` (IDs der
  verwendeten shadcn-Contracts) und `layers[]` – je Figma-Ebene das shadcn-Teil im Code
  (`code.part`, feste `code.props`), die Datenquelle (`data`) und ggf. eine Bedingung (`when`)
- `issues`: bekannte Abweichungen (`info`, `warn`, `error`), mit Verweis `drift` auf die ID in [DRIFT.md](DRIFT.md)

Das Schema ist geschlossen (`additionalProperties: false`): Neue Felder erst im Schema
beschreiben, sonst meldet `check-code.mjs` sie als Fehler.

## Prüfen

```bash
node contracts/scripts/check-code.mjs                   # gegen dieses Repo (Musterlösung)
node contracts/scripts/check-code.mjs ../OST-VC-Base     # gegen den Starter (Pfad zum geklonten Repo)
```

Das Script prüft:
- jeden Contract gegen `contract.schema.json` (Typen, Pflichtfelder, unbekannte Felder)
- ob jede `drift`-ID in `DRIFT.md` existiert
- ob alle referenzierten Exports existieren
- ob jeder gemappte Wert eine echte Variante ist (`cva`-Varianten bzw. String-Union im Prop-Typ der
  Komponente) und ob umgekehrt jede Code-Variante gemappt oder in `codeOnlyValues` steht. Werte aus
  Paketen (`valuesFrom.package`, z. B. Base UI) werden nur grob in den Typdefinitionen gesucht.
- bei Kompositionen, ob die shadcn-Teile importiert und feste Props gesetzt sind. Fehlt die
  Datei (Starter), gilt die Komposition als „noch nicht umgesetzt“ statt als Fehler.

```bash
node contracts/scripts/tokens.mjs                  # Tokens: Figma ↔ globals.css
node contracts/scripts/tokens.mjs --write          # Figma-Werte in globals.css übernehmen
```

`tokens.json` verweist auf die Tailwind-Palette (`neutral-100`, `red-600` …). Das Script
übersetzt das über die `theme.css` des Projekts in exakte oklch-Werte. `--write` ändert nur
Variablen, die es in `globals.css` schon gibt.
### Figma-Seite prüfen

```bash
node contracts/scripts/figma-check.mjs > /tmp/figma-check.js
```

Die Ausgabe im figma-console MCP mit `figma_execute` ausführen (Desktop Bridge, File „OST“).
Geprüft werden Node-IDs, Keys, Namen, Typen, Property-Namen (inkl. `#id`), Variantenwerte und
die `figmaId` jeder Ebene; `problems` muss leer sein. Letzter Abgleich: 31.10.2026 alle
Komponenten; 01.11.2026 alle geänderten Komponenten (19) und alle Ebenen (35).
Inhalte in Slots einer Instanz haben Pfad-IDs (`I<instanz>;<…>;<node>`).

**Kit-Erweiterungen:** Was nicht aus dem originalen shadcndesign-Kit stammt, trägt in der
Figma-Beschreibung den Vermerk „per Claude Code“ (z. B. `Avatar / Group Count`, `Item / Separator`,
Toggle `Layout=Vertical`). Liste und Begründung: [DRIFT-LOG.md](DRIFT-LOG.md).

## Stand (01.11.2026)

19 Contracts für shadcn-Komponenten und 9 eigene Komponenten (`kind: "composition"`), alle als
`draft`. Die eigenen Figma-Komponenten liegen in der Section „MeetCat Komponenten“ auf der Seite
„MeetCat“; die Screens verwenden Instanzen davon. Alle 54 Drift-Einträge sind
entschieden; `check-code` meldet 0 Fehler und 0 offene Warnungen.

| Komponente | Figma-Komponenten | Code | Bemerkung (Drift akzeptiert bzw. gelöst) |
|---|---|---|---|
| alert-dialog | 1 | ✔ | – |
| aspect-ratio | 1 | ✔ | – |
| avatar | 4 | ✔ | `xl`/`xs` nur in Figma; `Avatar / Group Count` ergänzt (D-001, D-002) |
| badge | 2 | ✔ | Variante `link` fehlt in Figma, ungenutzt (D-009) |
| button | 1 | ✔ | State `Loading` → `disabled` + `Spinner`; Default-Grösse jetzt `default` (D-010, D-011) |
| card | 1 | ✔ | Workarounds Padding/Slot-Richtung (D-034, D-035) |
| carousel | 4 | ✔ | `Breakpoint` ist im Code keine Prop (D-012) |
| dialog | 2 | ✔ | kein `DialogHeader`-Slot (D-017) |
| dropdown-menu | 6 | ✔ | Shortcut als Variante; Tippfehler behoben (D-003–D-006) |
| empty | 2 | ✔ | – |
| input-group | 3 | ✔ | `InputGroupButton` über Addon-Variante (D-016, D-023) |
| item | 5 | ✔ | `Icon` = new-york-v4, `Item / Separator` ergänzt, Kit-Fehler `Show Actions` (D-007, D-008, D-033) |
| scroll-area | 2 | ✔ | – |
| select | 5 | ✔ | `Size` bei Select-Items nur in Figma (D-013) |
| separator | 1 | ✔ | – |
| sonner | 3 | ✔ | im Code Funktionsaufruf `toast()` (D-018) |
| tabs | 2 | ✔ | – |
| toggle | 1 | ✔ | Variante `Layout=Vertical` ergänzt (D-019), Pressed füllt Icon (D-038) |
| tooltip | 1 | ✔ | Tippfehler behoben (D-015) |
| meetup-card | 1 Set (eigene) | ✔ | `State` Default/Hover; keine Component Properties (D-031, D-032) |
| site-header | 1 Set (eigene) | ✔ | `Breakpoint` Desktop/Mobile + Frame „Menü offen“ (D-045) |
| meetup-filter-bar | 1 Set (eigene) | ✔ | `Filter` Standard/Geändert (D-053) |
| category-carousel | 1 (eigene) | ✔ | Figma ohne Kit-Carousel (D-049) |
| group-card | 1 (eigene) | ✔ | Screen „Übersicht – Gruppen“ (D-047), Sterne als Icons (D-050) |
| meetup-attendees | 1 (eigene) | ✔ | – |
| meetup-chat-teaser | 1 Set (eigene) | ✔ | `Teilnahme` Nein/Ja (D-051) |
| attend-dialog | 1 Set (eigene) | ✔ | `Plätze` Frei/Voll (D-051) |
| meetup-action-bar | 1 Set (eigene) | ✔ | `Teilnahme` × `Gemerkt` × `Plätze` (D-051) |
