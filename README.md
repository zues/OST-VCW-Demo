# MeetCat – Musterlösung

Referenz-App für das Seminar: Meetups für Katzen und ihre Menschen. Next.js 16 + shadcn/ui
(`base-nova`). Das leere Grundgerüst für eigene Projekte liegt in
[OST-VC-Base](https://github.com/zues/OST-VC-Base).

- [KONZEPT.md](KONZEPT.md) – Aufbau, Regeln, Figma-Datei, Entscheidungen
- [TODO.md](TODO.md) – offene Aufgaben (hier weitermachen)
- [contracts/](contracts/README.md) – Figma ↔ Code: Contracts, Drift-Liste, Prüfscripts

## Starten

```bash
npm install
npm run dev -- -p 3123
```

Dann http://localhost:3123 öffnen.

## Testen

```bash
npm run test:smoke             # Dev-Server muss laufen; nutzt das lokale Chrome
npm run test:smoke -- --shots  # zusätzlich Screenshots nach tests/screenshots/
```

Der Smoke-Test prüft Kategorienfilter, Detailseite, Teilnehmen/Absagen (inkl. Reload) und
den Teilnehmenden-Dialog.

## Struktur

```
src/
├── app/
│   ├── page.tsx                  ← Übersicht /
│   └── meetups/[slug]/page.tsx   ← Detailseite
├── components/
│   ├── ui/                       ← shadcn/ui, unverändert aus der CLI
│   └── *.tsx                     ← eigene Kompositionen (MeetupCard, SiteHeader, …)
├── data/                         ← Mock-Daten und Typen
├── hooks/use-attendance.ts       ← Teilnahme-Status (localStorage)
└── lib/                          ← Formatierung, Filterlogik
```

## Regeln

- Neue UI nur aus shadcn/ui-Komponenten zusammensetzen (`npx shadcn@latest add …`).
- Dateien in `components/ui/` nicht verändern.
- Abweichungen zum Figma-Design in [`../contracts/DRIFT.md`](../contracts/DRIFT.md) eintragen.
- Nach Änderungen an shadcn-Komponenten: `node ../contracts/scripts/check-code.mjs`.
