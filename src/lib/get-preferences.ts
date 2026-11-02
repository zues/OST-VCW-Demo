import { cookies } from "next/headers"

import { messages } from "@/i18n/messages"
import { parsePreferences } from "@/lib/preferences"

/** Sprache, Ort und Texte für Server Components. */
export async function getPreferences() {
  const store = await cookies()
  const preferences = parsePreferences((name) => store.get(name)?.value)
  return { ...preferences, t: messages[preferences.lang] }
}
