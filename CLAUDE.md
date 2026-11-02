@AGENTS.md

# MeetCat – Musterlösung

Katzen-Meetup-App als Beispielprojekt für ein FH-Seminar. Die Studierenden bauen sie aus dem Figma-Design nach.

- **Zuerst [TODO.md](TODO.md) lesen.** Dort steht der aktuelle Stand.
  Hintergrund und Entscheidungen stehen in [KONZEPT.md](KONZEPT.md).
- Arbeitsregeln und Figma-Stolpersteine stehen in [contracts/FIGMA-ARBEITSWEISE.md](contracts/FIGMA-ARBEITSWEISE.md).
- Abweichungen zwischen Figma und Code kommen nach [contracts/DRIFT.md](contracts/DRIFT.md).
  Bitte nicht stillschweigend auf einer Seite angleichen.
- shadcn/ui strikt verwenden. `src/components/ui/*` bleibt so, wie die CLI die Dateien installiert.
- Dev-Server läuft auf Port 3123 (`npm run dev -- -p 3123`).
- Prüfen:
  - `node contracts/scripts/check-code.mjs`
  - `npm run test:smoke`
