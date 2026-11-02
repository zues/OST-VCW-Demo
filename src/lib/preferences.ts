import { cities, defaultCity, type CityId } from "@/data/cities"
import { languages, type Lang } from "@/i18n/messages"

/**
 * Sprache und Ort der Besucher:in. Kein Login: beides liegt in Cookies, damit
 * auch Server Components (z. B. die Detailseite) richtig rendern.
 */
export type Preferences = { lang: Lang; city: CityId }

export const preferenceCookies = { lang: "meetcat-lang", city: "meetcat-city" } as const

export function parsePreferences(get: (name: string) => string | undefined): Preferences {
  const lang = get(preferenceCookies.lang)
  const city = get(preferenceCookies.city)
  return {
    lang: languages.find((l) => l.value === lang)?.value ?? "de",
    city: cities.find((c) => c.id === city)?.id ?? defaultCity,
  }
}
