# Figma-Arbeitsweise

Wie an der Figma-Datei **„OST“** (Key `la64IYsP0s5iqsJ2ltpf4T`, Kopie des shadcndesign.com-Kits)
gearbeitet wird und welche Stolpersteine es dabei gibt. Gesammelt beim Bau der Screens
(30.10.–02.11.2026).

## Aufbau der Datei

- Alles für MeetCat liegt auf der Page **„MeetCat“** (`27459:595938`). Bitte nicht auf mehrere Pages verteilen.
- Oben liegen die Desktop-Screens: „Übersicht / Desktop“ `27459:595939`, „Übersicht – Gruppen / Desktop“ `27477:608285`
  und „Detail / Desktop“ `27462:597891`.
- Desktop- und Mobile-Screens (390 px): „Übersicht / Desktop“ x −1640 und „Übersicht / Mobile“ `27477:617775` x 525 (beide y 0), „Detail / Mobile“ `27477:620468` unter „Detail / Desktop“ (y 2000). Alex hat die Anordnung am 02.11.2026 selbst angepasst.
- Rechts liegen die Section „Overlays“ `27462:601792` und die Section „MeetCat Komponenten“ `27459:596894`.
  Dort sind das Logo „MeetCat Logo“ `27477:623867` und alle eigenen Komponenten.
- **Responsive** heisst immer: eine Variante `Breakpoint=Desktop/Mobile` im selben Component Set.
  Für Mobile wird keine eigene Komponente angelegt.
- **Zustände** (Teilnahme, Gemerkt, Plätze, Filter …) sind Varianten und keine Component Properties.

## Regeln

- **Code folgt shadcn/ui strikt.** Eigene Komponenten sind nur Kompositionen von shadcn-Komponenten.
- **Abweichungen zwischen Figma und Code** werden nicht stillschweigend angepasst. Sie kommen als neue Zeile
  in [DRIFT.md](DRIFT.md). Jede Entscheidung wird als Runde in [DRIFT-LOG.md](DRIFT-LOG.md) protokolliert.
  Im Contract verweist dann das Feld `issues` auf die Drift-ID.
- **Ergänzungen am Kit** werden in der Figma-Beschreibung markiert:
  „Hinzugefügt am <Datum> per Claude Code (Drift D-0xx)“.
- **Vor einer Drift-Entscheidung** wird gegen die offizielle shadcn-Registry und gegen das Live-Figma gegengeprüft.
- **Lizenz:** Das Kit darf nicht an Studierende weitergegeben werden. Die Figma-Datei selbst also nicht teilen.

## figma-console MCP (Desktop Bridge)

Bevorzugt wird figma-console (Desktop Bridge). Das offizielle Figma-Plugin und Code Connect werden nicht verwendet.

- Das Plugin läuft mit `documentAccess: dynamic-page`.
  - Immer `await node.getMainComponentAsync()` verwenden, nie `node.mainComponent`.
  - Vor der Suche über mehrere Pages `await figma.loadAllPagesAsync()` aufrufen.
- `clone()` legt den Klon auf `figma.currentPage`.
  - Liegt das Original woanders, schlägt `combineAsVariants` fehl („same page“).
  - Vorher `figma.setCurrentPageAsync(page)` aufrufen.
- **Bilder:**
  - `figma.createImageAsync(url)` scheitert an jeder URL.
  - `figma_set_image_fill` nimmt Base64 an und liefert einen `imageHash`. Den Hash danach wiederverwenden.
  - Langes Base64 wird bei der Übertragung beschädigt. Fotos am besten per Drag-and-drop setzen.
- **Bilder hochladen:** <a id="bilder-hochladen"></a>
  - Geht zuverlässig mit dem offiziellen Figma-MCP (`claude_ai_Figma`).
    1. Mit `create_session` eine Session öffnen.
    2. `upload_assets` mit `count` und `currentPageId` aufrufen.
    3. Jede Datei per `curl -F "file=@bild.jpg;type=image/jpeg" <submitUrl>` hochladen.
  - Die Antwort enthält den `imageHash`, auf der Page entsteht ein Frame mit dem Bild.
  - In figma-console den Hash dann per `node.fills = [{ type: 'IMAGE', imageHash, scaleMode: 'FILL' }]` setzen.
  - Die Hashes der 20 MeetCat-Bilder (auf 800 px verkleinert) stehen in [figma-images.json](figma-images.json).
- **Grosse Skripte:**
  - Ein Durchlauf über das ganze Component Set `MeetupActionBar` (über 7000 Knoten) dauert sehr lange.
    Danach ist das Plugin am 02.11.2026 abgestürzt.
  - Deshalb pro Variante oder Instanz arbeiten.
  - Ist die Bridge mit mehreren Dateien verbunden, vor jedem Aufruf prüfen, dass „OST“ aktiv ist (`figma_list_open_files`).
- `findOne`/`findAll` und das Lesen von `fills` können auf Instanzen mit getauschten Icons abstürzen.
  Deshalb mit einem eigenen Walker mit try/catch durchlaufen und Icon-Instanzen überspringen.
- **Kit-Struktur:**
  - Bilder sind der Fill der `Aspect Ratio`-Instanz, Avatare tragen den Fill auf der `Avatar`-Instanz.
  - Card, Tabs, Avatar Group und Empty haben echte SLOT-Nodes.
- **Icons:**
  - Ein Lucide-Icon in einer Instanz wird per `swapComponent()` getauscht.
  - Danach kann `findOne` auf der äusseren Instanz abstürzen. Deshalb Icons zuletzt tauschen.
- Property-Keys haben ein `#id`-Suffix, z. B. `Button Text#37:10`. In den Contracts heisst das Feld `figmaKey`.
- **`layoutMode` lässt sich auf Instanzen und Slot-Kindern nicht ändern.** Das wird stillschweigend ignoriert.
  Padding, Gap und Ausrichtung lassen sich dagegen ändern.
  - Für eine andere Richtung kann man im Slot einen neuen Frame anlegen und die Unterebenen hineinverschieben.
  - Nach jedem Verschieben die Ebenen neu aus der Instanz holen, sonst veralten die Pfad-IDs.
  - Alternativ eine neue Variante anlegen, z. B. Toggle `Layout=Vertical`.
- Ebenen in Slots haben Pfad-IDs, z. B. `I27459:596896;17374:183173;27459:596934`.
  - Normale IDs liefern dafür `null`.
  - Zum Finden die Instanz durchlaufen.
- Beim `clone()` einer Variante gehen die `componentPropertyReferences` verloren. Danach wieder setzen.
- Ist der Slot-Inhalt einer Instanz überschrieben, erbt sie keine Änderungen der Hauptkomponente mehr.
- Nach `combineAsVariants` und Auto-Layout auf dem Set können Varianten auf FILL springen. Breite wieder auf FIXED setzen.
- Wird ein Frame von horizontal auf vertikal umgestellt, `primaryAxisAlignItems` prüfen.
  `SPACE_BETWEEN` verschluckt sonst das `itemSpacing`.
- `Item` → `Show Actions=false` blendet die Actions im Slot `Flex` nicht aus. Dafür die Ebene auf `visible=false` setzen.

## Prüfen

- Der Abgleich der Figma-Seite läuft über [README.md](README.md#figma-seite-prüfen) mit `figma-check.mjs`.
  - Die Ausgabe mit `figma_execute` ausführen.
  - `problems` muss leer sein.
- Prototyp lokal: `npm run dev -- -p 3123`. Smoke-Test: `npm run test:smoke`.
  - Dafür braucht es `playwright-core` und ein lokales Chrome.
  - Next 16 lässt alte Routen versteckt im DOM. Deshalb Selektoren mit `>> visible=true` verwenden.
