"use client"

import { useSyncExternalStore } from "react"

const STORAGE_KEY = "meetcat:attending"
const listeners = new Set<() => void>()

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
  } catch {
    return []
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

/**
 * Teilnahme-Status eines Meetups. Kein Backend: der Status wird
 * im localStorage des Browsers gespeichert.
 */
export function useAttendance(meetupId: string) {
  const isAttending = useSyncExternalStore(
    subscribe,
    () => read().includes(meetupId),
    () => false
  )

  function setAttending(attending: boolean) {
    const ids = read().filter((id) => id !== meetupId)
    if (attending) ids.push(meetupId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    listeners.forEach((listener) => listener())
  }

  return [isAttending, setAttending] as const
}
