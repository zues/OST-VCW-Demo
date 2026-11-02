# Drift-Log: Entscheidungen

Protokoll aller Entscheidungen zu den Einträgen in [DRIFT.md](DRIFT.md) – damit sich später
nachvollziehen lässt, **was der Ausgangszustand war**, **was entschieden wurde** und **was
konkret geändert wurde**. Neue Entscheidungen werden unten als neue Runde angehängt.

Legende: ⚪ akzeptiert · 🟢 gelöst · 🟡 entschieden, noch offen
„per Claude Code“ = Änderung wurde von Claude Code (KI-Assistent) im Auftrag von Alex umgesetzt.

---

## Runde 1 – 01.11.2026 (D-001 bis D-005)

Entschieden von: Alex · Umgesetzt per Claude Code

### D-001 · Avatar – Grössen `xl`/`xs` nur in Figma → ⚪ akzeptiert

- **Ausgangslage:** Figma-Variante `Size` hat fünf Werte: `xl` 48px, `lg` 40px, `default` 32px,
  `sm` 24px, `xs` 20px. Code (`avatar.tsx`): `size?: "default" | "sm" | "lg"`.
- **Gegenprüfung (auf Wunsch von Alex):**
  - offizielles shadcn-Registry abgefragt (`ui.shadcn.com/r/styles/<style>/avatar.json`) für
    `base-nova`, `radix-nova` und `new-york-v4` → überall nur `default | sm | lg`;
  - lokale Datei identisch mit dem Registry-Stand;
  - Figma-Pixelgrössen der drei gemeinsamen Werte stimmen mit dem Code überein
    (`sm` = `size-6`, `default` = `size-8`, `lg` = `size-10`).
  - → Die Abweichung ist echt; `xl`/`xs` sind eine Erweiterung des Kits.
- **Entscheidung:** akzeptieren. Im Code nicht nachbauen (würde gegen „shadcn strikt“ verstossen),
  in Figma nicht verwenden.
- **Änderungen:** `avatar.contract.json` – Issue auf `info` gesetzt, Hinweis „nicht verwenden“.
  Figma unverändert.

### D-002 · Avatar – keine Figma-Komponente für „+N“ → 🟢 gelöst

- **Ausgangslage:** Code nutzt `AvatarGroupCount` (Teilnehmenden-Karte „+4 weitere“). In Figma
  gab es keine Entsprechung; die Detailseite behalf sich mit `Avatar` `Type=Fallback` + Text „+2“.
  Risiko: Studierende bauen `<AvatarFallback>+2</AvatarFallback>` statt `AvatarGroupCount`.
- **Entscheidung:** in Figma lösen – neue Komponente anlegen, mit Hinweis, dass sie per
  Claude Code ergänzt wurde.
- **Änderungen:**
  - Figma, Seite „Avatar“, Section „Components“: neues Component Set **`Avatar / Group Count`**
    (`27477:604100`) mit Variante `Size` = `lg` | `default` | `sm` und Text-Property
    `Count Text`. Aufbau aus `Avatar Type=Fallback` abgeleitet (gleiche Variablen für Farbe,
    Radius, Schrift), dazu Kontur 2px aussen `base/background` (≙ `ring-2 ring-background`).
    Beschreibung der Komponente: „Hinzugefügt am 01.11.2026 per Claude Code (Drift D-002) – nicht
    Teil des originalen shadcndesign-Kits.“
  - Figma `MeetupAttendees`: das „+2“-Avatar per `swapComponent` durch
    `Avatar / Group Count` (lg) ersetzt – optisch unverändert (Screenshot geprüft).
  - `avatar.contract.json`: neuer Part `AvatarGroupCount`, aus `codeOnly` entfernt.
  - `meetup-attendees.contract.json`: neue Ebene `AvatarGroupCount`, aus `codeOnly` entfernt.

### D-003 · Dropdown Menu – Tippfehler `Distructive` → 🟢 gelöst

- **Ausgangslage:** `DropdownMenu / Item`, Variante `Variant=Distructive`; Code
  `variant="destructive"`. Im Prototyp nicht genutzt.
- **Entscheidung:** in Figma umbenennen.
- **Änderungen:** Figma `DropdownMenu / Item` (`330:8549`) – drei Varianten in
  `Variant=Destructive, State=Default|Hover|Disabled` umbenannt (Instanzen bleiben verbunden).
  `dropdown-menu.contract.json`: Wert-Mapping angepasst, Issue entfernt.

### D-004 · Dropdown Menu – doppeltes Leerzeichen in `SubTrigger` → 🟢 gelöst

- **Ausgangslage:** Komponentenname `DropdownMenu /  SubTrigger` (zwei Leerzeichen). Im Prototyp
  nicht genutzt.
- **Entscheidung:** in Figma umbenennen.
- **Änderungen:** Figma `330:24002` → `DropdownMenu / SubTrigger`.
  `dropdown-menu.contract.json`: Name angepasst, Issue entfernt.

### D-005 · Dropdown Menu – Shortcut als Variante → ⚪ akzeptiert

- **Ausgangslage:** Figma `Variant=Shortcut` am Menüeintrag; Code: Kind-Element
  `<DropdownMenuShortcut>` im `<DropdownMenuItem>`. Im Prototyp nicht genutzt.
- **Entscheidung:** akzeptieren – grundsätzlicher Unterschied Figma-Variante vs. Komposition,
  Zuordnung steht im Contract.
- **Änderungen:** nur Vermerk „Akzeptiert.“ im Issue von `dropdown-menu.contract.json`.

**Prüfung nach Runde 1:** `node contracts/scripts/check-code.mjs musterloesung` → 0 Fehler,
18 offene Warnungen (vorher 21).

---

## Runde 2 – 01.11.2026 (selbstständig entschieden)

Auftrag von Alex: „Alle Drifts selbst auflösen, wo hohe Confidence besteht, dass es Sinn macht;
kritische, aufwendige oder folgenreiche Punkte nachfragen.“ Entschieden und umgesetzt per
Claude Code. Grundsätze dabei:

- **Code (shadcn `base-nova`) ist massgeblich.** Kein Nachbauen von Kit-Extras im Code.
- **Kit nicht zerstören:** Varianten nicht löschen, sondern kennzeichnen. Neue Bausteine nur,
  wenn der Prototyp sie nutzt, und mit Vermerk „per Claude Code“ in der Beschreibung.
- **Bereits umgesetzte Overrides** in Figma (aus dem Screen-Bau am 30./31.10.) gelten als
  akzeptierte Workarounds.
- Akzeptierte Contract-Issues wurden auf `info` gesetzt und mit „Akzeptiert (01.11.2026)“
  markiert; gelöste Issues wurden entfernt.

Zurückgestellt (Alex fragen): D-019, D-020, D-031, D-032, D-040, D-045, D-047, D-050, D-051, D-053.

### In Figma gelöst 🟢

| ID | Ausgangslage | Änderung |
|---|---|---|
| D-007 | `Item / Media` hat `Icon` (32px-Kasten, `bg-muted`, Rahmen) und `Icon (Simple)` (nur Icon); Code nur `variant="icon"` ohne Kasten. **Ursache ermittelt:** Registry-Vergleich – `Icon` ist der Stil von `new-york-v4`, `Icon (Simple)` der von `base-nova`. | Beide Varianten (`18672:6043`) mit Beschreibung versehen: `Icon` = „new-york-v4, nicht verwenden“, `Icon (Simple)` = `<ItemMedia variant="icon">`. Nichts gelöscht. Contract: `Icon` → `null`. |
| D-008 | `ItemSeparator` (im Prototyp genutzt) und `ItemFooter` ohne Figma-Komponente; Detailseite nutzte allgemeinen `Separator`. | Neue Komponente **`Item / Separator`** (`27477:605109`, Seite „Item“): Separator horizontal + 8px oben/unten (≙ `my-2`). Beschreibung „Hinzugefügt am 01.11.2026 per Claude Code (Drift D-008)“. Auf der Detailseite (Datum & Ort) per `swapComponent` eingesetzt – Abstand jetzt wie im Code (Screenshot geprüft). `ItemFooter` akzeptiert (ungenutzt). |
| D-011 | Default-Variante des Buttons war `Size=xs` (neu gezogene Instanzen kamen als xs). | In `Button` (`37:931`) die Zeilen `Variant=Default` / `Size=xs` und `Size=default` vertauscht (Default-Variante = oben links) → Default jetzt `Variant=Default, State=Default, Size=default`. Bestehende Instanzen unverändert. |
| D-015 | Property `Show KdbGroup` (Tippfehler) im `Tooltip`. | In `Show KbdGroup` umbenannt (Key-Suffix `#18665:17` bleibt, Instanzen bleiben verbunden). Contract angepasst. |
| D-023 | Ort im Suchfeld als `InputGroup / Addon Inline` Variante `Text` („Zürich, CH“ ohne Pin); Code ist seit 31.10. ein Dropdown-Trigger mit `MapPinIcon`. | Im `SiteHeader` auf Kit-Variante **`Dropdown`** umgestellt: Button Ghost/sm, Text „Zürich, CH“, linkes Icon = Lucide `MapPin` (≙ `<InputGroupButton size="sm">` + `MapPinIcon`). Screenshot geprüft. Contract-Ebene mit Figma-ID ergänzt. |
| D-042 | `ItemGroup` Datum & Ort: Rahmen/Radius per Override, Trenner als `Separator`. | Overrides bleiben (≙ `rounded-xl border`), Trenner jetzt `Item / Separator` (D-008) → entspricht dem Code. |

### Akzeptiert ⚪

| ID | Ausgangslage | Begründung |
|---|---|---|
| D-006 | Dropdown/Select: `Color=Inverted`, `Appearance=Translucent` nur in Figma. | Kit-Erweiterung, nicht in shadcn; nicht verwenden (wie D-001). |
| D-009 | Badge `variant="link"` fehlt in Figma. | Im Prototyp ungenutzt; bei Bedarf ergänzen. |
| D-010 | Button `State=Loading` nur in Figma. | shadcn hat keine `loading`-Prop. Muster im Contract: `<Button disabled><Spinner /> Text</Button>`. |
| D-012 | Carousel `Breakpoint` als Variante. | Im Code responsive `basis-*`-Klassen – grundsätzlicher Unterschied. |
| D-013 | `Select Menu / Item` hat `Size`. | Kit-Erweiterung, nicht verwenden. |
| D-014 | Werte teils gross (`Default`), teils klein. | Betrifft das ganze Kit (auch Button `Variant=Default`); Umbenennen aller Sets wäre ein grosser Eingriff ohne Nutzen – Mapping steht in den Contracts. |
| D-016 | `InputGroupButton` nur als Addon-Variante. | Addon-Varianten `Button`/`Dropdown` decken die Nutzung ab. |
| D-017 | Dialog ohne `DialogHeader`-Slot. | Struktur-Unterschied, Zuordnung im Contract. |
| D-018 | Sonner als Komponente vs. `toast()`. | Grundsätzlicher Unterschied, im Contract dokumentiert. |
| D-021 | MeetupCard: Gruppenzeile in `Card Content` statt zweiter `CardDescription`. | Kit-Card hat nur eine Description; Zuordnung im Contract. |
| D-022 | Badges absolut im Wrapper statt in `AspectRatio`. | Visuell identisch, Kit-Aspect-Ratio hat keinen Slot. |
| D-024–D-027 | Token-Unterschiede (Chart-Farben, Dark-Mode-Werte). | Code = aktueller shadcn-Default und damit massgeblich. Prototyp nutzt weder Charts noch Dark Mode. Figma-Variablen nicht geändert (würde das ganze Kit betreffen) – bei Bedarf später angleichen. |
| D-028–D-030 | `--destructive-foreground`, `--ring-offset`, `radius/xs`, `font-serif` nur in Figma. | Kit-Altlasten bzw. identische Werte, ungenutzt. |
| D-033 | Kit-Fehler: `Show Actions=false` blendet Actions nicht aus. | Workaround (Ebene ausblenden) überall umgesetzt; Kit nicht repariert. |
| D-034, D-035 | Card: Innenabstand / Slot-Richtung auf Instanzen. | Workarounds (Padding-Override, horizontaler Frame im Slot) umgesetzt. |
| D-036 | ItemGroup-Abstand 16px fest. | Geprüft: Override auf 10px in AttendDialog und Teilnehmenden-Dialog bereits gesetzt. |
| D-037 | Item-Media immer oben. | Geprüft: Items ohne Beschreibung im Teilnehmenden-Dialog bereits auf „zentriert“ überschrieben. |
| D-038 | Toggle `Pressed`: Icon im Code zusätzlich gefüllt. | Feines Detail, im Contract beschrieben. |
| D-039 | Host-Item `px-0`. | Layout-Override, erlaubt (className nur für Layout). |
| D-041 | Empty mit gestricheltem Rahmen. | Geprüft: Override (gestrichelt, Radius 14) in Figma bereits gesetzt. |
| D-043 | Bild mit `rounded-xl`. | Geprüft: Radius 14 in Figma bereits gesetzt. |
| D-044 | Aktionsleiste: Datum über Titel. | Kit-Card-Header hat Titel immer oben; Zuordnung im Contract. |
| D-046 | Ortsauswahl als Dropdown. | Trigger jetzt in Figma (D-023); geöffnetes Menü nicht gezeichnet, Städteliste steht in `src/data/cities.ts`. |
| D-048 | Mehrsprachigkeit nur im Code. | Figma zeigt die Standardsprache Deutsch. |
| D-049 | CategoryCarousel ohne Kit-`Carousel`. | Zuordnung im Contract; visuell gleich. |
| D-052 | Spacer-Frame vs. `ml-auto`. | Gleiches Ergebnis; „Space between“ würde bei drei Elementen das Suchfeld zentrieren. |

**Prüfung nach Runde 2:** `check-code musterloesung` → 0 Fehler, 12 offene Warnungen (vorher 18).
Die verbleibenden Warnungen gehören alle zu den zurückgestellten Punkten.

---

## Runde 3 – 01.11.2026 (Entscheidungen von Alex)

Alex hat die zurückgestellten Punkte per Rückfrage entschieden. Umgesetzt per Claude Code.

| Frage | Entscheidung |
|---|---|
| D-019 Kategorien: Icon neben oder über dem Text? | **Figma an Code** (Icon über Text) |
| D-020 Pill-Form von Suche und Filtern | **Code an Figma** (Standard-Radius) |
| D-031/D-032/D-051/D-053 Zustände und Properties | **Nur fehlende Zustände** als Varianten, keine Component Properties |
| Zusätzlich bauen | **Sterne als Icons** (D-040/D-050), **Screen Gruppen-Tab** (D-047), **Mobile-Header** (D-045) |

### D-019 · Kategorie-Toggles vertikal → 🟢 Figma an Code

- **Ausgangslage:** Figma `Toggle` (Size lg) mit Icon neben dem Text; Code
  `className="h-auto flex-col gap-1.5 px-3 py-2"`, Icon `size-5`, Text `text-xs`.
- **Hindernis:** Figma erlaubt kein Überschreiben der Auto-Layout-Richtung auf Instanzen
  (Override wurde stillschweigend ignoriert).
- **Lösung:** Am Kit-`Toggle` (`124:27`) neue Variante **`Layout`** = `Horizontal` (alle
  bisherigen 30 Varianten, Instanzen unverändert) | `Vertical` (nur `Variant=Default, Size=lg`,
  alle 5 States). Vertical: Auto-Layout vertikal, Abstand 6, Padding 8/12, Icon 20px, Text
  12/16px. Beschreibung: „Hinzugefügt am 01.11.2026 per Claude Code (Drift D-019)“.
  Property-Verknüpfungen (`Toggle Text`, `Show Text`, `Show Icon`) nach dem Klonen neu gesetzt.
- **Eingesetzt:** alle 11 Toggles in `CategoryCarousel` → `Layout=Vertical` (Höhe 58px wie
  im Code, Screenshot geprüft).
- **Contracts:** `toggle` (neue Variante `Layout` → `className`), `category-carousel`
  (Issue entfernt).

### D-020 · Pill-Form → 🟢 Code an Figma

- **Ausgangslage:** `InputGroup className="h-10 rounded-full"`, Such-Button
  `className="rounded-full"`, `SelectTrigger className="rounded-full"`. Verstösst gegen
  „className nur für Layout“.
- **Änderung (Code):** alle drei `rounded-full` entfernt, dazu **`h-10`** am Suchfeld
  (ebenfalls Styling; Figma zeigt das Suchfeld 32px hoch = shadcn-Standard). Dateien:
  `src/components/site-header.tsx`, `src/components/meetup-filter-bar.tsx`.
- **Geprüft:** ESLint, `tsc`, `npm run test:smoke` → „Alles grün“, Screenshot Header.
- **Contracts:** Issues in `site-header` und `meetup-filter-bar` entfernt.

### D-051 / D-053 / D-032 / D-031 · Zustände als Varianten → 🟢 (Properties ⚪)

Alle neuen Varianten tragen in der Set-Beschreibung den Vermerk „ergänzt am 01.11.2026 per
Claude Code“. Bestehende Instanzen auf den Screens bleiben verbunden.

| Komponente | Vorher | Jetzt |
|---|---|---|
| `MeetupActionBar` (`27473:11846`) | `Teilnahme` Nein/Ja (Ja zeigte zugleich „gemerkt“) | `Teilnahme` × `Gemerkt` × `Plätze` (Frei/Voll) = 8 Varianten. Gemerkt ≙ Toggle `Pressed`; Voll ≙ Badge + Button „Warteliste“ (bei Teilnahme=Ja bleibt „Du nimmst teil“). |
| `MeetupChatTeaser` (jetzt Set `27477:607362`) | eine Komponente | `Teilnahme` Nein/Ja; Ja: „Der Chat öffnet 24 Stunden vor dem Meetup.“, ohne Button. |
| `AttendDialog` (jetzt Set `27477:607953`) | eine Komponente | `Plätze` Frei/Voll; Voll: „Auf die Warteliste?“ / „Auf Warteliste setzen“. |
| `MeetupFilterBar` (jetzt Set `27477:608075`) | eine Komponente | `Filter` Standard/Geändert; Geändert: Button `Link` „Zurücksetzen“ vorne, Datum „Heute“ (D-053). |
| `MeetupCard` (jetzt Set `27477:608133`) | eine Komponente | `State` Default/Hover; Hover: Effect Style `shadow/md` (≙ `group-hover:shadow-md`, D-032). |

- **D-031 (Component Properties der MeetupCard) und der Properties-Teil von D-051:** ⚪ akzeptiert
  nach Entscheidung Alex; die betroffenen Contract-Issues stehen auf `info`.
- **Section „MeetCat Komponenten“** neu angeordnet und vergrössert (2070 × 2254).

### D-040 / D-050 · Sterne als Lucide-Icons → 🟢

- **Ausgangslage:** Bewertung als Textzeichen „★“ (Detail: „4.9 ★★★★★“, GroupCard
  „4.9 ★ · 4 Meetups“, MeetupCard „von … · 4.9 ★“); Code: Lucide `StarIcon`.
- **Änderung:** Textzeichen durch Instanzen von **`Lucide Icon / Star`** (`5197:3173`) ersetzt,
  Kontur und Füllung an `base/muted-foreground` gebunden (≙ `fill-current` in
  `CardDescription`), Grösse per `rescale` (Strichstärke skaliert mit wie im Browser):
  - Detail `Item / Gruppe`: Zeile „4.9“ + 5 Sterne à 14px (≙ `size-3.5`).
  - `MeetupCard` (beide Varianten) und **alle 11 Instanzen** auf Übersicht und Detail: Zeile
    „von … · 4.9“ + Stern 12px (≙ `size-3`). Hinweis: Slot-Inhalte von Instanzen erben
    Änderungen am Main Component nicht, sobald sie überschrieben sind – deshalb in jeder
    Instanz einzeln umgebaut, Texte vorher gesichert.
  - `GroupCard`: Kit-`Card Description` lässt keine Icons zu → ausgeblendet, Bewertungszeile
    „4.9 ★ · 4 Meetups“ als Frame im Slot `Card Content` (wie D-021 bei der MeetupCard).
- **Contracts:** `meetup-card` (Ebene „Group“ neue Figma-ID `27477:608201`), `group-card`
  (neue Ebene `27477:608278`).

### D-047 · Screen Gruppen-Tab → 🟢

- **Neu:** Frame **„Übersicht – Gruppen / Desktop“** (`27477:608285`, Seite Übersicht, unter dem
  Meetup-Screen). Kopie der Übersicht mit Tab „Gruppen“ aktiv, Überschrift „Gruppen in der
  Nähe von Zürich, CH“, ohne Filter/Kategorien (wie `GroupList` im Code), 8 `GroupCard`-Instanzen.
- **Daten** aus dem laufenden Prototyp ausgelesen (Ort Zürich, sortiert nach Entfernung):
  Clicker Cats Schweiz, Zürich Cat Lovers, Stubentiger Stammtisch, Tierheim Pfötli,
  Leinenkatzen Ostschweiz, Cat Photography Club, Fellfreunde Winterthur, Remote Cat Parents.
- **Einschränkung:** Bilder wiederverwendet aus den Meetup-Karten; Leinenkatzen (Bild 10)
  und Clicker Cats haben Platzhalterbilder → gehört zum TODO „Figma-Bilder reparieren“.

### D-045 · Mobile-Header → 🟢

- **Neu:** `SiteHeader` ist jetzt ein Set (`27477:611704`) mit `Breakpoint` = `Desktop` (bisher)
  | `Mobile` (390px): Nav und Spacer ausgeblendet, Orts-Trigger ausgeblendet (`hidden sm:flex`),
  Suchfeld füllt, Abstand 12 (`gap-3`), neuer `Button` Ghost/icon mit Lucide `Menu`.
- **Neu:** Frame **„SiteHeader – Mobile, Menü offen“** (`27477:611725`): Mobile-Header +
  `DropdownMenu / Menu` (192px ≙ `w-48`) mit Anmelden, Registrieren | Ort (5 Städte, Zürich
  ✓) | Sprache (Deutsch ✓, English, Français).
- Screens nutzen weiterhin `Breakpoint=Desktop` (geprüft).

### D-054 · ChatTeaser-Button-Grösse → 🟢 (neu gefunden)

- Beim Anlegen der ChatTeaser-Varianten aufgefallen: Figma-Button `Size=default`, Code
  `size="sm"`. In Figma auf `sm` gesetzt.

**Prüfung nach Runde 3:**
- `check-code musterloesung` → **0 Fehler, 0 offene Warnungen**.
- Figma-Live-Check aller geänderten Contract-Verweise: 19/19 Komponenten (Name, Typ,
  Properties, Variantenwerte) und 35/35 Ebenen-IDs gefunden.
- Screenshots: Übersicht, Detail, Gruppen-Screen, Section „MeetCat Komponenten“.
- **Alle 54 Drift-Einträge entschieden** (keiner mehr 🔴 offen).
