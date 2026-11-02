import { locales, type Lang } from "@/i18n/messages"

const timeZone = "Europe/Zurich"

const formats = (lang: Lang) => ({
  date: new Intl.DateTimeFormat(locales[lang], { weekday: "short", day: "numeric", month: "short", timeZone }),
  time: new Intl.DateTimeFormat(locales[lang], { hour: "2-digit", minute: "2-digit", timeZone }),
  longDate: new Intl.DateTimeFormat(locales[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }),
})

/** z. B. "Fr., 6. Nov. · 18:00" */
export function formatMeetupDate(iso: string, lang: Lang) {
  const { date, time } = formats(lang)
  const d = new Date(iso)
  return `${date.format(d)} · ${time.format(d)}`
}

export function formatPrice(price: number) {
  return `CHF ${price.toFixed(2)}`
}

/** z. B. "Freitag, 6. November 2026" und "18:00 – 20:00 Uhr" */
export function formatMeetupDateRange(startsAt: string, endsAt: string, lang: Lang) {
  const { longDate, time } = formats(lang)
  const start = new Date(startsAt)
  const range = `${time.format(start)} – ${time.format(new Date(endsAt))}`
  return {
    date: longDate.format(start),
    time: lang === "de" ? `${range} Uhr` : range,
  }
}
