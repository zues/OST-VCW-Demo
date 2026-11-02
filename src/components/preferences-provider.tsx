"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import type { CityId } from "@/data/cities"
import { messages, type Lang } from "@/i18n/messages"
import { preferenceCookies, type Preferences } from "@/lib/preferences"

const PreferencesContext = createContext<
  | (Preferences & {
      t: (typeof messages)[Lang]
      setLang: (lang: Lang) => void
      setCity: (city: CityId) => void
    })
  | null
>(null)

export function PreferencesProvider({
  initial,
  children,
}: {
  initial: Preferences
  children: React.ReactNode
}) {
  const router = useRouter()
  const [preferences, setPreferences] = useState(initial)

  useEffect(() => {
    document.documentElement.lang = preferences.lang
  }, [preferences.lang])

  function update(next: Partial<Preferences>) {
    setPreferences({ ...preferences, ...next })
    for (const [key, value] of Object.entries(next)) {
      const name = preferenceCookies[key as keyof Preferences]
      document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`
    }
    // Server Components mit der neuen Sprache neu rendern
    router.refresh()
  }

  return (
    <PreferencesContext
      value={{
        ...preferences,
        t: messages[preferences.lang],
        setLang: (lang) => update({ lang }),
        setCity: (city) => update({ city }),
      }}
    >
      {children}
    </PreferencesContext>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error("usePreferences braucht einen PreferencesProvider")
  return context
}
