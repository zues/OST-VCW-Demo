import { distanceFrom, type CityId } from "@/data/cities"
import type { Group, Meetup } from "@/data/types"

export type GroupSummary = {
  group: Group
  meetupCount: number
  /** Orte der Meetups, leer bei reinen Online-Gruppen */
  cities: string[]
  /** Entfernung zum nächsten Meetup, `null` bei reinen Online-Gruppen */
  distanceKm: number | null
}

/** Gruppen aus den Meetups ableiten, die nächstgelegenen zuerst. */
export function summarizeGroups(meetups: Meetup[], city: CityId, query = "") {
  const summaries = new Map<string, GroupSummary>()

  for (const meetup of meetups) {
    const summary = summaries.get(meetup.group.id) ?? {
      group: meetup.group,
      meetupCount: 0,
      cities: [],
      distanceKm: null,
    }
    summary.meetupCount++
    if (meetup.location) {
      if (!summary.cities.includes(meetup.location.city)) {
        summary.cities.push(meetup.location.city)
      }
      const distance = distanceFrom(city, meetup.location)
      summary.distanceKm = Math.min(summary.distanceKm ?? Infinity, distance)
    }
    summaries.set(meetup.group.id, summary)
  }

  const term = query.trim().toLowerCase()
  return [...summaries.values()]
    .filter((s) => !term || s.group.name.toLowerCase().includes(term))
    .sort(
      (a, b) =>
        (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) ||
        b.group.rating - a.group.rating
    )
}
