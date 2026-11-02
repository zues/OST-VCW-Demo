# TODO

Stand: 02.11.2026. Hintergrund und Entscheidungen: [KONZEPT.md](KONZEPT.md).

## Nächste Schritte

- [x] **Figma-Inhalte auf die neuen Daten umstellen** (02.11.2026):
  - [x] Alle 20 Bilder sind in der Datei. Die Hashes stehen in
        [contracts/figma-images.json](contracts/figma-images.json); der Weg ist in
        [FIGMA-ARBEITSWEISE.md](contracts/FIGMA-ARBEITSWEISE.md#bilder-hochladen) beschrieben.
  - [x] Übersicht Desktop und Mobile, Gruppen / Desktop, Detail Desktop und Mobile sowie die Dialoge
        in „Overlays“ zeigen dieselben Inhalte wie die App (Detail = „Countdown im Kinderzimmer: Raketenbau“).
  - [x] **Standardinhalte der Komponenten** (02.11.2026) in „MeetCat Komponenten“: MeetupCard (beide
        States), MeetupActionBar (alle 16 Varianten), MeetupAttendees, AttendDialog (beide) zeigen
        „Countdown im Kinderzimmer: Raketenbau“ / Mission Miau, GroupCard zeigt Schnurrlock Holmes.
        Hinweis: In den Mobile-Varianten der ActionBar waren die Textebenen im Slot defekt („no text data“);
        die Card wurde pro Variante durch eine Kopie ersetzt. Instanzen dieser Varianten verlieren dabei
        ihre Text-Overrides.
  - [x] **„Übersicht – Gruppen / Mobile“** (`27511:628703`, x 1640 / y 2000, 02.11.2026): Tabs mit aktivem
        „Gruppen“, Titel, GroupCards einspaltig (Schnurrlock Holmes, Schnurr & Knips, Das Blubberlabor,
        Camping unterm Sofazelt).
  - [x] Die 20 Upload-Frames liegen auf einer eigenen Page (von Alex verschoben, 02.11.2026).
- [ ] **Aufräumen: [docs/setup-anleitung.html](docs/setup-anleitung.html)** (02.11.2026) ist eine Kopie der
      Setup-Anleitung für die Studierenden (Artifact https://claude.ai/artifact/WHPH66Tnb1dq9hYqfgmLE9),
      ohne Drive-Link. Sie zieht als erste Lektion in die App „Lektionen“ (`~/Documents/dev/lektionen`).
      Danach die Datei löschen.
- [x] **Git-Repositories** (02.11.2026): `musterloesung/` → https://github.com/zues/OST-VCW-Demo,
      `starter/` → https://github.com/zues/OST-VC-Base (beide öffentlich, Branch `main`).
      `KONZEPT.md`, `TODO.md` und `contracts/` liegen seit 02.11.2026 im Demo-Repo.
- [x] `npm run lint` grün (02.11.2026): Regel `react-hooks/set-state-in-effect` für
      `src/components/ui/**` abgeschaltet (in beiden Repos). Grund: shadcn-`Carousel` gleicht im
      Effect einmal `canScrollPrev/Next` ab – gewollt, unkritisch, und die shadcn-Dateien bleiben unverändert.

## Mobile (Review 31.10.2026)

- [x] Header: Navigation unter `lg` als Menü (`DropdownMenu`), kein horizontales Scrollen mehr
      (dadurch passen auch Aktionsleiste und Dialoge wieder) – D-045.
- [ ] Detail: Bild, Datum und Ort stehen mobil erst nach „Verwandte Themen“ (~1440 px) → unter
      den Titel holen.
- [ ] Aktionsleiste mobil: Titel wird abgeschnitten, Preis/Plätze sind ausgeblendet.
- [ ] Suchfeld bei 320–390 px sehr schmal (Platzhalter abgeschnitten). Seit D-020 (01.11.2026)
      ohne `h-10`/`rounded-full`, das Platzproblem bleibt.
- [ ] Übersicht: Filterleiste bricht auf 3 Zeilen um → horizontal scrollbar machen.
- [x] Mobile-Frames in Figma (01.11.2026): „Übersicht / Mobile“ (`27477:617775`) und
      „Detail / Mobile“ (`27477:620468`), je 390 px. Neue Varianten `Breakpoint=Desktop/Mobile` bei
      CategoryCarousel, MeetupAttendees (beide jetzt Component Sets), MeetupFilterBar und MeetupActionBar;
      SiteHeader hatte sie schon. Figma zeigt dabei das Zielbild für die drei offenen Punkte oben
      (D-055 Reihenfolge Detail, D-056 Aktionsleiste, D-057 Filterleiste) → mit Alex entscheiden.
- [ ] Mobile-Screen für „Übersicht – Gruppen“ fehlt noch (GroupCard braucht keine Variante, nur volle Breite).

## Logo (02.11.2026)

- [x] Figma-Pages „MeetCat – Übersicht“ und „MeetCat – Detail“ zu einer Page „MeetCat“ zusammengelegt
      (Desktop-Screens oben, Mobile darunter, rechts Overlays + Komponenten); Contracts `page` angepasst.
- [x] Wortmarke „MeetCat“ (#FF5054) als `public/logo.svg` in Musterlösung und Starter; Header nutzt
      `next/image` (h-8) statt Lucide `CatIcon` + Text. Figma: Komponente „MeetCat Logo“ (`27477:623867`)
      in der Section „MeetCat Komponenten“, in beiden SiteHeader-Varianten eingesetzt.
- [ ] Favicon/App-Icon: die Wortmarke ist zu breit, dafür bräuchte es ein quadratisches Zeichen.

## Startseite ausbauen (31.10.2026)

- [x] Tailscale-Zugriff: `allowedDevOrigins` um den vollen Hostnamen ergänzt (vorher kein
      JavaScript über Tailscale → Menü, Kategorien, Tabs ohne Funktion).
- [x] Suche behält gesetzte Filter; „Alle Filter zurücksetzen“ leert auch den Suchbegriff.
- [x] Ortsauswahl im Header (Cookie), Entfernungen über Koordinaten (`src/data/cities.ts`) – D-046.
- [x] Tab „Gruppen“ mit `GroupCard`, „Meetups ansehen“ springt gefiltert in den Meetups-Tab – D-047.
- [x] Sprache DE/EN/FR für alle Oberflächentexte (Cookie, auch Detailseite) – D-048.
- [ ] Anmelden/Registrieren haben noch keine Funktion.
- [ ] Gruppenkarte zählt alle Meetups, „Meetups ansehen“ zeigt aber nur die im gewählten Umkreis
      (z. B. Leinenkatzen Ostschweiz ab Zürich: 4 vs. 3).

## Design-System / Contracts

- [x] Alle 54 Drift-Einträge entschieden (01.11.2026): Runde 1 mit Alex (D-001–D-005),
      Runde 2 selbstständig (eindeutige Fälle), Runde 3 Rückfragen an Alex. Protokoll:
      `contracts/DRIFT-LOG.md`. Token-Drift (D-024–D-030): Code massgeblich, kein `tokens.mjs --write`.
- [ ] Neue Abweichungen weiterhin in `DRIFT.md` (nächste ID: D-058) und jede Entscheidung als
      neue Runde in `DRIFT-LOG.md` eintragen.
- [ ] Contracts von `draft` auf `reviewed` setzen, sobald die Zuordnung bestätigt ist.
- [x] Prüfscript für die Figma-Seite: `node contracts/scripts/figma-check.mjs` erzeugt Code für
      `figma_execute` (01.11.2026). Geprüft: 31.10. alle Komponenten, 01.11. alle geänderten
      Komponenten (19) und alle Ebenen (35).
- [ ] `figma-check.mjs` einmal vollständig ausführen (57 Parts, 35 Ebenen), bevor die Contracts
      auf `reviewed` gehen.
- [x] Contract-Review (31.10.2026): Schema geschlossen und um verwendete Felder ergänzt,
      `check-code.mjs` prüft jetzt Schema und Drift-IDs, Kompositionen im Starter gelten als offen;
      `meetup-card` an i18n angepasst; D-033–D-038 mit Item/Card/Toggle verknüpft.
- [x] `check-code.mjs`: Werte werden gegen `cva`-Varianten bzw. Prop-Typen geprüft, inkl.
      Vollständigkeit (jede Code-Variante gemappt oder in `codeOnlyValues`) (31.10.2026).
- [x] Tokens aus Figma in `contracts/tokens.json`, Abgleich per `contracts/scripts/tokens.mjs`
      (30.10.2026).
- [x] Figma-Page „MeetCat – Detail“: Seite (`Detail / Desktop`) plus Section „Overlays“ mit
      Teilnehmen-Dialog, AlertDialog, Teilnehmenden-Dialog und Aktionsleiste „Du nimmst teil“ (30.10.2026).
- [x] Contract `meetup-card` (erste Komposition, Schema um `kind`/`uses`/`layers` erweitert).
- [x] Eigene Komponenten als Figma-Komponenten (Section „MeetCat Komponenten“, Screens nutzen
      Instanzen) und Contracts: SiteHeader, MeetupFilterBar, CategoryCarousel, MeetupAttendees,
      MeetupChatTeaser, AttendDialog, MeetupActionBar (Variante `Teilnahme`), GroupCard (neu) (31.10.2026).
- [x] Drift D-049 bis D-053 entschieden (01.11.2026): Zustände als Varianten, keine Properties.
      Neu: Mobile-Header, Screen „Übersicht – Gruppen“, Sterne als Lucide-Icons.

## Starter-Repo

- [ ] shadcn-Komponenten installieren, die der Prototyp nutzt (gleiche Liste wie Musterlösung).
- [x] Mock-Daten `src/data/meetcat.json` und Bilder `public/images/meetcat/` übernommen (02.11.2026).
- [ ] Typen und Hilfsfunktionen (`lib/format.ts`, `lib/filter-meetups.ts`) übernehmen?
- [ ] Leere Seiten `/` und `/meetups/[slug]` mit TODO-Hinweisen anlegen.
- [ ] Theme-Varianten vorbereiten: MeetCat-Theme (aus Figma) und neutrales shadcn-Default für
      eigene Designs.
- [ ] README mit Aufgabenstellung, Aufgabenstufen und Zuordnungstabelle Figma ↔ Code
      (generiert aus den Contracts).
- [ ] `node contracts/scripts/check-code.mjs ../OST-VC-Base` muss grün sein.

## Seminar-Organisation

- [ ] **Lizenz klären:** Das shadcndesign-Kit darf nicht weitergegeben werden. Bei
      shadcndesign.com/help anfragen, ob View-Zugriff für Studierende erlaubt ist – sonst Alternative
      (z. B. Obra shadcn/ui Community Edition) für die Studierenden-Datei.
- [x] **Bildrechte** (02.11.2026): cataas-Bilder entfernt, ersetzt durch die 20 MeetCat-Bilder von Alex
      (Demo und Starter).
- [ ] Vorwissen und Zeitrahmen der Studierenden festlegen → Aufgabenstufen anpassen.
- [ ] Optional: Deployment (z. B. Vercel), damit Gruppen eine Live-URL bekommen.

## Technische Kleinigkeiten

- [ ] Unbekannte Meetup-Slugs liefern die 404-Seite, aber HTTP-Status 200 („Soft 404“), weil
      `notFound()` innerhalb der Suspense-Grenze aufgerufen wird. Prüfen, ob sich das mit
      `cacheComponents` sauber lösen lässt (z. B. Slug-Prüfung vor der Suspense-Grenze).
- [ ] Bridge-Plugin aktualisieren (installiert 1.39.0, verfügbar 1.41.5).
