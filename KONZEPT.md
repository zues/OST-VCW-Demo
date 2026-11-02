# MeetCat – Konzept

Testapplikation für ein Seminar an der Fachhochschule. Die Studierenden setzen eine kleine
Web-App nach einem vorgegebenen Figma-Design in Next.js + shadcn/ui um.

**MeetCat** ist eine Meetup-Plattform, nur für Treffen mit Katzen. Funktional lehnt sie sich
bewusst eng an Meetup.com an, damit das Produkt sofort verständlich ist und der Fokus auf der
Umsetzung des Designs liegt.

> Offene Aufgaben und nächste Schritte: siehe [TODO.md](TODO.md).

## Ordnerstruktur

Zwei unabhängige Repos (eigenes `package.json`, eigene `node_modules`):

```
OST-VCW-Demo/  (github.com/zues/OST-VCW-Demo)  ← Musterlösung, dieses Repo
├── KONZEPT.md          ← dieses Dokument
├── TODO.md             ← offene Aufgaben
├── contracts/          ← Verbindung Figma ↔ Code: Contracts, Drift-Liste, Prüfscripts
└── src/, public/, tests/ …

OST-VC-Base/   (github.com/zues/OST-VC-Base)   ← leeres Grundgerüst für die Studierenden
```

Lokal am besten nebeneinander klonen; die Prüfscripts erreichen den Starter dann über
`../OST-VC-Base`.

## Grundregel: so nah wie möglich an shadcn/ui

- UI besteht ausschliesslich aus **shadcn/ui-Komponenten** (`src/components/ui/*`), die
  unverändert so bleiben, wie die shadcn-CLI sie installiert.
- Eigene Komponenten (`MeetupCard`, `SiteHeader` …) sind nur **Kompositionen** dieser
  Komponenten. `className` wird nur für Layout verwendet, nicht um den Look zu ändern.
- Wo Figma und Code voneinander abweichen, wird das nicht stillschweigend angepasst,
  sondern in [`contracts/DRIFT.md`](contracts/DRIFT.md) dokumentiert und später entschieden.

## Umfang (bewusst klein)

| Screen | Inhalt | Code | Figma |
|---|---|---|---|
| **Übersicht** `/` | Suche, Ortsauswahl, Tabs, Filter (Datum, Grösse, Format, Umkreis), Kategorien-Carousel, Grid mit Meetup-Karten, Empty State | ✅ | ✅ (Bilder teilweise offen) |
| **Übersicht – Gruppen** (Tab) | Gruppenkarten nach Entfernung, „Meetups ansehen“ filtert den Meetups-Tab | ✅ | ✅ |
| **Detail** `/meetups/[slug]` | Titel, Host, Gruppe, Details, Teilnehmende (+ Dialog), Fotos (leer), verwandte Themen, ähnliche Meetups, Sidebar mit Bild/Datum/Ort/Chat, fixierte Aktionsleiste | ✅ | ✅ |
| **Teilnehmen** | Bestätigungs-Dialog → Toast → „Du nimmst teil“; Absagen per AlertDialog; Warteliste bei vollen Meetups | ✅ | ✅ (Overlays + Varianten) |
| **Header mobil** | Menü-Button unter `lg` mit Anmelden, Registrieren, Ort, Sprache | ✅ | ✅ |

Zusätzlich im Prototyp (nur Code, Figma zeigt Deutsch): Oberflächentexte in **DE/EN/FR**
(`src/i18n/messages.ts`); Sprache und Ort werden im Cookie gespeichert (`meetcat-lang`,
`meetcat-city`), Entfernungen über Koordinaten (`src/data/cities.ts`).

Nicht im Umfang: Login/Registrierung (Buttons ohne Funktion), eigene Gruppen-Seiten, Meetups
erstellen, Kommentare, echte Karten, Backend.

## Technischer Rahmen

- **Next.js 16** (App Router, `cacheComponents`), **React 19.3**, **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** im aktuellen Standard-Stil **`base-nova`**
  (Unterbau **Base UI** statt Radix – Props wie `render` statt `asChild`)
- Icons: **Lucide**
- **Mock-Daten** in `src/data/meetcat.json` (20 Gruppen, 30 Meetups, 10 Mitglieder; Texte im Gonzo-Stil, Stand
  02.11.2026), typisiert und verknüpft in `src/data/meetups.ts` – keine Datenbank, keine API. Dieselbe
  JSON-Datei und die Bilder liegen auch im Starter.
- **Kein Login**; „heute“ ist im Mock fest auf den 6.11.2026 gesetzt (`TODAY`)
- **Teilnahme-Status** clientseitig, im `localStorage` persistiert (`use-attendance.ts`)
- Bilder: 20 Katzenbilder von Alex (je ein Thema pro Gruppe) in `public/images/meetcat/`; Meetups
  zeigen das Bild ihrer Gruppe, Avatare verwenden ebenfalls diese Bilder

### Lokal starten

```bash
npm install
npm run dev -- -p 3123     # Port 3000 ist auf dem Rechner bereits belegt
```

Erreichbar unter `http://localhost:3123`. Über Tailscale sind `*.ts.net` freigegeben
(`allowedDevOrigins` in `next.config.ts`); weitere Hosts oder IPs als `DEV_ORIGINS=host1,host2`
in `.env.local` eintragen (nicht im Repo).

### Datenmodell

```ts
type Member = { id: string; name: string; avatarUrl: string }
type Group = { id: string; name: string; topic: string; description: string; rating: number; imageUrl: string }

type Meetup = {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  startsAt: string            // ISO-Datum mit Zeitzone
  endsAt: string
  recurring: boolean
  format: "in-person" | "online"
  location: { name: string; address: string; city: string; distanceKm: number } | null
  category: CategoryId        // spieltreff, fellpflege, fotowalk, outdoor, …
  group: Group
  price: number | null        // CHF, null = kostenlos
  capacity: number
  attendees: Member[]         // die ersten zwei gelten als Hosts
}
```

## Design-System: Figma ↔ Code

### Figma-File

Das Figma-File **„OST“** (Key `la64IYsP0s5iqsJ2ltpf4T`) ist eine Kopie des
**shadcn/ui kit von shadcndesign.com** (Pro). Das Kit bildet shadcn/ui bereits sehr genau ab:

- Variablen-Collection **„3. Mode“** (Light/Dark) mit genau den shadcn-Token-Namen
  (`base/background`, `base/primary`, `base/muted-foreground` …)
- Collection **„1. TailwindCSS“**, deren Variablen Tailwind-Klassen entsprechen
  (`spacing/4` → `p-4`, `border-radius/rounded-lg` → `rounded-lg`)
- Komponenten-Properties entsprechen den Props im Code (z. B. Button `Variant`/`Size`)
- Lucide ist als Icon-Bibliothek aktiv

Alles für das Projekt liegt auf einer Seite **„MeetCat“** (seit 02.11.2026 zusammengelegt). Oben
die Desktop-Screens „Übersicht / Desktop“, „Übersicht – Gruppen / Desktop“ und „Detail / Desktop“,
darunter „Übersicht / Mobile“ und „Detail / Mobile“ (390 px), alle aus Kit-Instanzen aufgebaut.
Rechts liegen die Section „Overlays“ (Dialoge, Aktionsleiste) und die Section **„MeetCat Komponenten“**
mit dem Logo und den eigenen Komponenten (`SiteHeader`, `MeetupCard`, `MeetupActionBar` …, als Sets
mit Zuständen und `Breakpoint=Desktop/Mobile` als Varianten). Ergänzungen am Kit sind in der Figma-Beschreibung mit
„per Claude Code“ markiert.

**Lizenz:** Das Kit darf laut Lizenz nicht weitergegeben werden (auch nicht kostenlos, keine
öffentlichen Links). Vor dem Seminar klären, was die Studierenden bekommen dürfen.

### Werkzeuge

- **figma-console MCP** (Desktop-Bridge-Plugin) zum Lesen und Schreiben in Figma
- bewusst **ohne** das kostenpflichtige shadcndesign-Plugin und ohne Figma Code Connect
- Einschränkung: Das Bridge-Plugin darf keine Bilder von externen URLs laden; Bilder müssen als
  Base64 übertragen oder manuell eingefügt werden

### Contracts

In [`contracts/`](contracts/README.md) liegt pro verwendeter shadcn-Komponente ein Contract
(19 Stück) und pro eigener Komponente ein Kompositions-Contract (9 Stück), alle Status `draft`. Ein Contract beschreibt je Figma-Komponente/Component-Set (mit Node-ID
und Key) das Gegenstück im Code und je Figma-Property die Umsetzung im Code (Prop mit
Wertetabelle, Unterkomponente, State, Komposition …). Das Format ist angelehnt an
[southleft/ds-contracts-poc](https://github.com/southleft/ds-contracts-poc), aber schlank.

`node contracts/scripts/check-code.mjs` prüft die Contracts gegen Schema und Code (aktuell:
0 Fehler, 0 Warnungen); `node contracts/scripts/figma-check.mjs` erzeugt das Gegenstück für die
Figma-Seite (Ausführung über figma-console MCP).

### Drift

[`contracts/DRIFT.md`](contracts/DRIFT.md) sammelt alle Abweichungen zwischen Figma und Code mit
ID, Typ, Vorschlag und Status. Stand 01.11.2026: alle 54 Einträge entschieden (gelöst oder
akzeptiert), Begründungen in [`contracts/DRIFT-LOG.md`](contracts/DRIFT-LOG.md). Grundsatz dabei:
Code (shadcn `base-nova`) ist massgeblich, Kit-Extras werden nicht nachgebaut. Neue Abweichungen
werden fortlaufend ergänzt.

## Musterlösung vs. Starter

| | Musterlösung | Starter |
|---|---|---|
| Next.js + shadcn eingerichtet | ✅ | ✅ |
| Benötigte shadcn-Komponenten installiert | ✅ | ⏳ (bisher nur Button) |
| Theme aus Figma-Tokens | ⏳ | ⏳ |
| Mock-Daten + Typen | ✅ | ⏳ |
| Bilder/Assets | ✅ | ⏳ |
| Seiten & eigene Komponenten | ✅ | ❌ (nur leere Seiten mit TODO-Hinweisen) |
| Teilnahme-Logik | ✅ | ❌ |
| README mit Aufgabenstellung | – | ⏳ |

## Aufgabenstufen im Seminar

1. **Komponenten** – Meetup-Karte und Header nach Figma bauen (statisch)
2. **Seiten** – Übersicht und Detailseite mit Routing und Mock-Daten
3. **Interaktion** – Teilnehmen-Flow mit Dialog, Status und Toast
4. **Bonus** – Filter/Suche, Dark Mode, Responsive-Feinschliff, Deployment
