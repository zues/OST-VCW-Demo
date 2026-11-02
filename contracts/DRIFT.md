# Drift: Abweichungen zwischen Figma und Code

Hier landen alle bekannten Abweichungen zwischen dem Figma-File **„OST“** und dem Code
(`src/components/ui/*`, shadcn `base-nova`). Sie werden nach und nach aufgelöst – entweder in
Figma, im Code oder bewusst akzeptiert.

**Entscheidungen** werden zusätzlich in [DRIFT-LOG.md](DRIFT-LOG.md) protokolliert (Ausgangslage → Entscheidung → Umsetzung).

**Neue Abweichung gefunden?** Unten als neue Zeile mit fortlaufender ID eintragen und, falls
die Komponente einen Contract hat, im `issues`-Feld des Contracts auf die ID verweisen.

| Status | Bedeutung |
|---|---|
| 🔴 offen | noch nicht entschieden |
| 🟡 entschieden | Lösung festgelegt, noch nicht umgesetzt |
| 🟢 gelöst | umgesetzt (Datum + wo) |
| ⚪ akzeptiert | bewusst so belassen (Begründung) |

| Typ | Bedeutung |
|---|---|
| `figma-only` | gibt es nur in Figma |
| `code-only` | gibt es nur im Code |
| `naming` | gleiche Sache, anderer Name / Tippfehler / Schreibweise |
| `concept` | wird in Figma und Code grundsätzlich anders abgebildet |
| `layout` | Code weicht per `className` vom Figma-Aufbau ab |
| `token` | Design-Token hat in Figma und Code unterschiedliche Werte |

## Tokens

Geprüft mit `node contracts/scripts/tokens.mjs` (Figma-Werte in [tokens.json](tokens.json)). Light-Mode-Kernfarben,
Radien und Schriften `sans`/`mono` stimmen überein. Charts und Dark Mode nutzt der Prototyp derzeit nicht.

| ID | Token | Typ | Figma | Code | Vorschlag | Status |
|---|---|---|---|---|---|---|
| D-024 | `--chart-1` … `--chart-5` (Light + Dark) | `token` | farbig (Light: orange-600, teal-600, cyan-900, amber-400, amber-500; Dark: blue-700, emerald-500, amber-500, purple-500, rose-500) – alte shadcn-Defaults | Graustufen (neutral) – aktuelles `base-nova`-Default | im Code übernehmen (`tokens.mjs --write`) oder akzeptieren, solange keine Charts genutzt werden | ⚪ akzeptiert – Code (shadcn-Default) massgeblich; Charts ungenutzt; siehe [Log](DRIFT-LOG.md) |
| D-025 | `--popover` (Dark) | `token` | neutral-800 | neutral-900 (`oklch(0.205 0 0)`) | entscheiden, welche Seite gilt | ⚪ akzeptiert – Code massgeblich; Dark Mode ungenutzt; siehe [Log](DRIFT-LOG.md) |
| D-026 | `--accent` (Dark) | `token` | neutral-700 | neutral-800 (`oklch(0.269 0 0)`) | entscheiden, welche Seite gilt | ⚪ akzeptiert – Code massgeblich; Dark Mode ungenutzt; siehe [Log](DRIFT-LOG.md) |
| D-027 | `--sidebar-ring` (Dark) | `token` | neutral-600 | neutral-500 (`oklch(0.556 0 0)`) | entscheiden, welche Seite gilt | ⚪ akzeptiert – Code massgeblich; Dark Mode ungenutzt; siehe [Log](DRIFT-LOG.md) |
| D-028 | `--destructive-foreground`, `--ring-offset` | `figma-only` | vorhanden (red-50, white/neutral-950) | gibt es in shadcn v4 nicht mehr | akzeptieren (Kit-Altlast) | ⚪ akzeptiert – Kit-Altlast; siehe [Log](DRIFT-LOG.md) |
| D-029 | `radius/xs` | `figma-only` | 2px | kein `--radius-xs` (Tailwind-Default `rounded-xs` = 0.125rem = 2px) | akzeptieren – Wert identisch | ⚪ akzeptiert – Wert identisch; siehe [Log](DRIFT-LOG.md) |
| D-030 | `font/font-serif` | `figma-only` | Georgia | keine Serif-Schrift definiert | akzeptieren (wird nicht genutzt) | ⚪ akzeptiert – ungenutzt; siehe [Log](DRIFT-LOG.md) |

## Komponenten (shadcn/ui)

| ID | Komponente | Typ | Figma | Code | Vorschlag | Status |
|---|---|---|---|---|---|---|
| D-001 | Avatar | `figma-only` | `Size` hat `xl` und `xs` | `size`: nur `sm`, `default`, `lg` | `xl`/`xs` in Figma ausblenden oder als bewusste Erweiterung im Code ergänzen | ⚪ akzeptiert – Kit-Erweiterung, im Code nicht nachbauen (shadcn-Registry geprüft 01.11.); siehe [Log](DRIFT-LOG.md) |
| D-002 | Avatar | `code-only` | keine Komponente für „+N“ (Detailseite behilft sich mit `Avatar` Type=Fallback „+2“) | `AvatarGroupCount` (im Prototyp genutzt) | Figma-Komponente `Avatar / Group Count` ergänzen | 🟢 gelöst 01.11. – Figma `Avatar / Group Count` (per Claude Code ergänzt), auf Detailseite eingesetzt; siehe [Log](DRIFT-LOG.md) |
| D-003 | Dropdown Menu | `naming` | `DropdownMenu / Item` → Variant `Distructive` | `variant="destructive"` | in Figma in `Destructive` umbenennen | 🟢 gelöst 01.11. – in Figma umbenannt; siehe [Log](DRIFT-LOG.md) |
| D-004 | Dropdown Menu | `naming` | Komponentenname `DropdownMenu /  SubTrigger` (doppeltes Leerzeichen) | `DropdownMenuSubTrigger` | in Figma umbenennen | 🟢 gelöst 01.11. – in Figma umbenannt; siehe [Log](DRIFT-LOG.md) |
| D-005 | Dropdown Menu | `concept` | `Variant=Shortcut` | Kind-Element `DropdownMenuShortcut` | akzeptieren, im Contract dokumentiert | ⚪ akzeptiert – Figma-Variante ≙ Kind-Element, im Contract dokumentiert; siehe [Log](DRIFT-LOG.md) |
| D-006 | Dropdown Menu, Select | `figma-only` | `Color` (Inverted), `Appearance` (Translucent), State `Hover (Translucent)` | nicht vorhanden | akzeptieren (Kit-Erweiterung) oder in Figma ausblenden | ⚪ akzeptiert – Kit-Erweiterung, nicht verwenden; siehe [Log](DRIFT-LOG.md) |
| D-007 | Item | `naming` | `Item / Media` hat `Icon` und `Icon (Simple)` | `ItemMedia variant`: nur `icon` (ohne Hintergrund) | visuell vergleichen, eine Figma-Variante entfernen | 🟢 gelöst 01.11. – Figma-Variante `Icon` als new-york-v4 gekennzeichnet (Beschreibung), Mapping `Icon` → –; siehe [Log](DRIFT-LOG.md) |
| D-008 | Item | `code-only` | keine Komponente | `ItemSeparator` (im Prototyp genutzt), `ItemFooter` | Figma-Komponenten ergänzen | 🟢 gelöst 01.11. – Figma `Item / Separator` (per Claude Code ergänzt), auf Detailseite eingesetzt; `ItemFooter` akzeptiert; siehe [Log](DRIFT-LOG.md) |
| D-009 | Badge | `code-only` | Variant ohne `Link` | `variant="link"` | in Figma ergänzen oder akzeptieren | ⚪ akzeptiert – im Prototyp nicht genutzt; siehe [Log](DRIFT-LOG.md) |
| D-010 | Button | `figma-only` | State `Loading` | kein Loading-Zustand (shadcn: `Spinner` + `disabled`) | akzeptieren, Muster im Contract beschreiben | ⚪ akzeptiert – Muster `disabled` + `Spinner` im Contract; siehe [Log](DRIFT-LOG.md) |
| D-011 | Button | `naming` | Default-Size `xs` | Default-Size `default` | Default in Figma auf `default` setzen | 🟢 gelöst 01.11. – Default-Variante in Figma jetzt `Size=default`; siehe [Log](DRIFT-LOG.md) |
| D-012 | Carousel | `concept` | Variant `Breakpoint` (sm, md, lg) | keine Prop, responsive `basis-*`-Klassen auf `CarouselItem` | akzeptieren | ⚪ akzeptiert – responsive Klassen statt Variante; siehe [Log](DRIFT-LOG.md) |
| D-013 | Select | `figma-only` | `Select Menu / Item` hat `Size` (Default, sm) | `SelectItem` ohne Grösse | in Figma entfernen oder akzeptieren | ⚪ akzeptiert – Kit-Erweiterung, nicht verwenden; siehe [Log](DRIFT-LOG.md) |
| D-014 | Select, Toggle | `naming` | Werte teils gross (`Default`), teils klein (`default`, `sm`) | immer klein | in Figma vereinheitlichen | ⚪ akzeptiert – Kit-weite Schreibweise (`Variant=Default`), Mapping im Contract; siehe [Log](DRIFT-LOG.md) |
| D-015 | Tooltip | `naming` | Property `Show KdbGroup` | – (Kbd) | in Figma in `Show KbdGroup` umbenennen | 🟢 gelöst 01.11. – Property in Figma umbenannt; siehe [Log](DRIFT-LOG.md) |
| D-016 | Input Group | `code-only` | `InputGroupButton` nur als Addon-Variante `Button` | eigene Komponente mit `size` (xs, sm, icon-xs, icon-sm) | akzeptieren oder Figma-Komponente ergänzen | ⚪ akzeptiert – Addon-Varianten `Button`/`Dropdown` decken die Nutzung ab; siehe [Log](DRIFT-LOG.md) |
| D-017 | Dialog | `concept` | Titel/Beschreibung fest verdrahtet, kein `DialogHeader`-Slot | `DialogHeader` als eigene Komponente | akzeptieren | ⚪ akzeptiert; siehe [Log](DRIFT-LOG.md) |
| D-018 | Sonner | `concept` | Komponente mit Varianten | Funktionsaufruf `toast()` + `<Toaster />` | akzeptieren, im Contract dokumentiert | ⚪ akzeptiert; siehe [Log](DRIFT-LOG.md) |
| D-033 | Item | `figma-only` | `Show Actions=false` blendet `Item / Actions` im Slot `Flex` nicht aus (Kit-Fehler) | – | Ebene manuell ausblenden; ggf. im Kit reparieren | ⚪ akzeptiert – Workaround: Ebene ausblenden (überall umgesetzt); siehe [Log](DRIFT-LOG.md) |
| D-034 | Card | `concept` | vertikaler Innenabstand sitzt im Frame `Card Header` → nur `Card Content` sichtbar = kein Abstand oben/unten | `py-*` auf `Card` selbst | Padding am Slot überschreiben (Detailseite: 12px) oder Kit anpassen | ⚪ akzeptiert – Workaround: Slot-Padding überschreiben (umgesetzt); siehe [Log](DRIFT-LOG.md) |
| D-035 | Card | `concept` | Slot-Richtung (vertikal) lässt sich auf Instanzen nicht überschreiben | `className="flex-row"` | horizontalen Frame in den Slot legen (Aktionsleiste) oder akzeptieren | ⚪ akzeptiert – Workaround: horizontaler Frame im Slot (umgesetzt); siehe [Log](DRIFT-LOG.md) |
| D-036 | ItemGroup | `figma-only` | Abstand im Slot fest 16px | `gap-4`, bei `size="sm"`-Items `gap-2.5` (10px) | Override auf 10px (Dialoge) oder Kit-Variante ergänzen | ⚪ akzeptiert – Override 10px in beiden Dialogen umgesetzt; siehe [Log](DRIFT-LOG.md) |
| D-037 | Item | `concept` | Media immer oben ausgerichtet | Media vertikal zentriert, wenn keine `ItemDescription` vorhanden | Override `Flex` → zentriert (Teilnehmenden-Dialog) | ⚪ akzeptiert – Override zentriert im Teilnehmenden-Dialog umgesetzt; siehe [Log](DRIFT-LOG.md) |
| D-038 | Toggle | `concept` | `State=Pressed` färbt nur den Hintergrund | Icon zusätzlich gefüllt (`group-aria-pressed/toggle:fill-current`) | akzeptieren oder gefülltes Icon in Figma ergänzen | ⚪ akzeptiert – im Contract beschrieben; siehe [Log](DRIFT-LOG.md) |
| D-058 | Sonner / Toast | `concept` | Kit-Komponente `Sonner` | `toast()` aus `sonner`; der shadcn-Skill verlangt für Base-UI-Projekte die Komponente `toast` (Base UI Toast, es gibt sie für `base-nova`) | auf `toast` wechseln (Code + Figma prüfen) oder bei Sonner bleiben | 🔴 offen – gefunden 02.11. beim Abgleich mit dem shadcn-Skill |

## Screens (MeetCat)

| ID | Screen | Typ | Figma | Code | Vorschlag | Status |
|---|---|---|---|---|---|---|
| D-019 | Übersicht – Kategorien | `layout` | `Toggle` (Size lg) zeigt Icon und Text nebeneinander | `className="h-auto flex-col"`: Icon über dem Label | entscheiden: Figma-Variante „vertikal“ ergänzen oder Code an Figma angleichen | 🟢 gelöst 01.11. – Figma an Code: Toggle-Variante `Layout=Vertical` (per Claude Code ergänzt), in CategoryCarousel eingesetzt; siehe [Log](DRIFT-LOG.md) |
| D-020 | Übersicht – Suche & Filter | `layout` | `InputGroup` und `Select` mit Standard-Radius | `className="rounded-full"` (Pill-Form) | im Code entfernen oder in Figma als Override bzw. Variante | 🟢 gelöst 01.11. – Code an Figma: `rounded-full` (und `h-10`) entfernt; siehe [Log](DRIFT-LOG.md) |
| D-021 | Übersicht – MeetupCard | `concept` | `Card` hat nur eine `Card Description` → Gruppenzeile liegt im Slot `Card Content` | zwei `CardDescription` im `CardHeader` | akzeptieren oder Code an Figma angleichen (Gruppe in `CardContent`) | ⚪ akzeptiert – Struktur-Unterschied, Zuordnung im Contract; siehe [Log](DRIFT-LOG.md) |
| D-022 | Übersicht – MeetupCard | `concept` | `Aspect Ratio` hat keinen Slot → Badges liegen absolut im Wrapper `MeetupCard` | Badges absolut innerhalb von `AspectRatio` | akzeptieren (visuell identisch) | ⚪ akzeptiert – visuell identisch; siehe [Log](DRIFT-LOG.md) |
| D-023 | Übersicht – Suche | `figma-only` | `InputGroup / Addon Inline` Variante `Text` ohne Icon → „Zürich, CH“ ohne Pin | seit 31.10. Ortsauswahl: `InputGroupButton` mit `MapPinIcon` + Text als `DropdownMenu`-Trigger (D-046) | Kit-Variante `Dropdown` der Addon-Inline-Komponente verwenden (passt jetzt besser als `Text`) | 🟢 gelöst 01.11. – Figma nutzt Kit-Variante `Dropdown` mit MapPin-Icon; siehe [Log](DRIFT-LOG.md) |
| D-031 | Übersicht – MeetupCard | `concept` | Komponente ohne eigene Properties – Badges, Titel, Datum usw. nur per Override auf Kit-Instanzen | alles aus einer Prop `meetup`, Badges bedingt (Preis, Plätze ≤ 3, Warteliste) | in Figma Component Properties ergänzen (z. B. `Title`, `Date`, `Show Price`, `Show Seats`) oder akzeptieren | ⚪ akzeptiert – keine Component Properties, nur Zustände (Entscheidung Alex); siehe [Log](DRIFT-LOG.md) |
| D-032 | Übersicht – MeetupCard | `code-only` | kein Hover-Zustand, kein Link | `<Link>` um die Karte, `group-hover:shadow-md` | in Figma Variante `State=Hover` ergänzen oder akzeptieren | 🟢 gelöst 01.11. – MeetupCard-Variante `State=Hover` (shadow/md); siehe [Log](DRIFT-LOG.md) |
| D-039 | Detail – Host | `layout` | `Item` mit Standard-Padding | `className="px-0"` | Override (Padding 0) – akzeptieren oder im Code entfernen | ⚪ akzeptiert – Layout-Override; siehe [Log](DRIFT-LOG.md) |
| D-040 | Detail – Gruppe | `concept` | Bewertung als Text „4.9 ★★★★★“ | Zahl + 5 × Lucide `StarIcon`, gefüllt nach Rundung | akzeptieren oder Icons in Figma nachbauen | 🟢 gelöst 01.11. – 5 × Lucide `Star` statt Textzeichen; siehe [Log](DRIFT-LOG.md) |
| D-041 | Detail – Fotos | `layout` | `Empty` ohne Rahmen | `className="border"` (gestrichelt) | Override (Stroke `base/border`, gestrichelt) – oder Kit-Variante „Outline“ | ⚪ akzeptiert – Override (gestrichelt, Radius 14) in Figma bereits umgesetzt; siehe [Log](DRIFT-LOG.md) |
| D-042 | Detail – Datum & Ort | `layout` | `ItemGroup` ohne Rahmen, Trenner als `Separator` | `className="gap-0 rounded-xl border"` + `ItemSeparator` (D-008) | Overrides akzeptieren oder Figma-Komponente ergänzen | 🟢 gelöst 01.11. – Rahmen/Radius als Override, Trenner jetzt `Item / Separator`; siehe [Log](DRIFT-LOG.md) |
| D-043 | Detail – Bild | `layout` | `Aspect Ratio` ohne Radius | `className="overflow-hidden rounded-xl"` | Override (Radius 14) akzeptieren | ⚪ akzeptiert – Override Radius 14 in Figma bereits umgesetzt; siehe [Log](DRIFT-LOG.md) |
| D-044 | Detail – Aktionsleiste | `layout` | Titel/Datum als Textebenen im Slot `Card Content` (Datum über Titel) | `CardDescription` über `CardTitle` ohne `CardHeader`, `text-xs` | akzeptieren (Card-Header in Figma hat Titel immer oben) | ⚪ akzeptiert; siehe [Log](DRIFT-LOG.md) |
| D-045 | Header (alle Screens) | `code-only` | nur Desktop-Header: Sprache, Anmelden, Registrieren als Buttons | unter `lg` Menü-Button (`Button` ghost/icon + `MenuIcon`) mit `DropdownMenu` (Anmelden, Registrieren, Ort, Sprache); Ortsauswahl im Suchfeld erst ab `sm` | Mobile-Frame des Headers in Figma ergänzen | 🟢 gelöst 01.11. – SiteHeader-Variante `Breakpoint=Mobile` + Frame „Menü offen“; siehe [Log](DRIFT-LOG.md) |
| D-046 | Header – Ort | `concept` | „Zürich, CH“ als `InputGroupText` (nur Anzeige) | Ortsauswahl: `DropdownMenu` mit `InputGroupButton` (ghost, sm) als Trigger und `DropdownMenuRadioGroup` (Zürich, Winterthur, Uster, St. Gallen, Bern); gespeichert im Cookie | geöffnetes Menü als Overlay in Figma ergänzen oder akzeptieren | ⚪ akzeptiert – Trigger in Figma (D-023), geöffnetes Menü nicht gezeichnet; siehe [Log](DRIFT-LOG.md) |
| D-047 | Übersicht – Tab „Gruppen“ | `code-only` | kein Screen für den Tab | `GroupCard` (Card + AspectRatio + CardHeader + `Button` outline „Meetups ansehen“) im Raster wie die Meetup-Karten, nach Entfernung sortiert; Leerzustand mit `Empty` | Screen „Übersicht – Gruppen“ und Komponente `GroupCard` in Figma anlegen | 🟢 gelöst 01.11. – Screen „Übersicht – Gruppen / Desktop“; siehe [Log](DRIFT-LOG.md) |
| D-048 | alle Screens – Sprache | `code-only` | alle Texte nur auf Deutsch | Oberflächentexte DE/EN/FR (`src/i18n/messages.ts`), Datumsformate je Locale; Inhalte der Meetups bleiben deutsch | akzeptieren (Figma zeigt die Standardsprache) oder Textlängen EN/FR in Figma prüfen | ⚪ akzeptiert – Figma zeigt Standardsprache Deutsch; siehe [Log](DRIFT-LOG.md) |
| D-049 | Übersicht – CategoryCarousel | `concept` | Auto-Layout-Frame mit Toggles zwischen zwei `Carousel / Arrow Button`, keine Kit-`Carousel`-Instanz | `Carousel` (Embla, `dragFree`) + `CarouselContent`/`CarouselItem` je Toggle + `CarouselPrevious`/`CarouselNext` | Kit-`Carousel` mit Slot verwenden oder akzeptieren | ⚪ akzeptiert – Zuordnung im Contract; siehe [Log](DRIFT-LOG.md) |
| D-050 | Übersicht – GroupCard | `concept` | Bewertung als Text „4.9 ★“ in `Card Description` | Zahl + Lucide `StarIcon` (wie D-021) | zusammen mit D-021/D-040 entscheiden | 🟢 gelöst 01.11. – Lucide `Star` statt Textzeichen (auch MeetupCard); siehe [Log](DRIFT-LOG.md) |
| D-051 | Eigene Komponenten (SiteHeader, MeetupFilterBar, CategoryCarousel, MeetupAttendees, MeetupChatTeaser, AttendDialog, MeetupActionBar, GroupCard) | `concept` | seit 31.10. Figma-Komponenten, aber ohne Component Properties; Zustände nur teilweise (ActionBar: `Teilnahme` Ja/Nein) | Inhalte aus Daten/Props, Zustände aus State (Teilnahme, Gemerkt, Warteliste, Filter geändert) | Properties/Varianten ergänzen, wo Studierende sie brauchen (z. B. ActionBar `Gemerkt`, `Warteliste`; ChatTeaser `Teilnahme`) – oder akzeptieren wie D-031 | 🟢 gelöst 01.11. – Zustände als Varianten ergänzt (ActionBar, ChatTeaser, AttendDialog, FilterBar, MeetupCard); Properties akzeptiert; siehe [Log](DRIFT-LOG.md) |
| D-052 | Header | `layout` | `Spacer`-Frame schiebt die Navigation nach rechts | `ml-auto` an `<nav>` | akzeptieren (gleiches Ergebnis) oder Spacer durch Auto-Layout „Space between“ ersetzen | ⚪ akzeptiert – gleiches Ergebnis; siehe [Log](DRIFT-LOG.md) |
| D-053 | Übersicht – Filter | `code-only` | kein Zurücksetzen | `Button variant="link"` „Zurücksetzen“, sobald ein Filter vom Standard abweicht | Zustand „Filter aktiv“ in Figma ergänzen oder akzeptieren | 🟢 gelöst 01.11. – MeetupFilterBar-Variante `Filter=Geändert`; siehe [Log](DRIFT-LOG.md) |
| D-054 | Detail – MeetupChatTeaser | `layout` | Button „Teilnehmen“ `Size=default` | `size="sm"` | Figma an Code angleichen | 🟢 gelöst 01.11. – Figma auf `sm` gesetzt; siehe [Log](DRIFT-LOG.md) |
| D-055 | Detail – Mobile, Reihenfolge | `layout` | „Detail / Mobile“ (01.11.): Bild, Datum & Ort und Meetup-Chat direkt unter Titel/Host/Gruppe | Aside (`lg:grid-cols-[1fr_22rem]`) rutscht unter `lg` ans Ende, nach „Verwandte Themen“ | Code angleichen (Aside-Block unter `lg` nach dem Header) oder Figma an Code | 🔴 offen |
| D-056 | Detail – MeetupActionBar mobil | `layout` | Variante `Breakpoint=Mobile` (01.11., per Claude Code): drei Zeilen – Datum/Titel (umbrechend), Badges, Merken + Teilen + Button volle Breite | eine Zeile, `CardTitle truncate`, Badges `hidden sm:flex` | Code angleichen (unter `sm` `flex-col`, Badges sichtbar, Button `flex-1`) oder Figma an Code | 🔴 offen |
| D-057 | Übersicht – MeetupFilterBar mobil | `layout` | Variante `Breakpoint=Mobile` (01.11., per Claude Code): eine Zeile, horizontal scrollbar (342 px, abgeschnitten) | `flex flex-wrap` → drei Zeilen bei 390 px | Code angleichen (`ScrollArea` horizontal bzw. `overflow-x-auto flex-nowrap`) oder Figma an Code | 🔴 offen |
| D-059 | Detail – MeetupActionBar | `concept` | Card-Slot mit horizontalem Frame (D-035) | `CardTitle`/`CardDescription` direkt in `Card` ohne `CardHeader`; der shadcn-Skill verlangt die volle Card-Struktur | `CardHeader` ergänzen (Figma-Aufbau prüfen) oder akzeptieren | 🔴 offen – gefunden 02.11. beim Abgleich mit dem shadcn-Skill |
