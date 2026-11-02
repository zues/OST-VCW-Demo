import { distanceFrom, type CityId } from "@/data/cities"
import { TODAY } from "@/data/meetups"
import type { CategoryId, Meetup } from "@/data/types"

export type DayFilter = "any" | "today" | "tomorrow" | "weekend" | "week"
export type SizeFilter = "any" | "small" | "medium" | "large"
export type FormatFilter = "any" | "in-person" | "online"
export type DistanceFilter = "5" | "10" | "30" | "50" | "any"

export type MeetupFilters = {
  query: string
  category: CategoryId | "all"
  day: DayFilter
  size: SizeFilter
  format: FormatFilter
  distance: DistanceFilter
}

export const defaultFilters: MeetupFilters = {
  query: "",
  category: "all",
  day: "any",
  size: "any",
  format: "any",
  distance: "30",
}

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function matchesDay(meetup: Meetup, day: DayFilter) {
  const date = meetup.startsAt.slice(0, 10)
  switch (day) {
    case "any":
      return true
    case "today":
      return date === TODAY
    case "tomorrow":
      return date === addDays(TODAY, 1)
    case "weekend": {
      const weekday = new Date(`${date}T00:00:00Z`).getUTCDay()
      return (weekday === 0 || weekday === 6) && date <= addDays(TODAY, 7)
    }
    case "week":
      return date >= TODAY && date <= addDays(TODAY, 7)
  }
}

function matchesSize(meetup: Meetup, size: SizeFilter) {
  const count = meetup.attendees.length
  switch (size) {
    case "any":
      return true
    case "small":
      return count < 10
    case "medium":
      return count >= 10 && count <= 25
    case "large":
      return count > 25
  }
}

export function filterMeetups(meetups: Meetup[], filters: MeetupFilters, city: CityId) {
  const query = filters.query.trim().toLowerCase()

  return meetups.filter((meetup) => {
    if (filters.category === "online") {
      if (meetup.format !== "online") return false
    } else if (filters.category !== "all" && meetup.category !== filters.category) {
      return false
    }
    if (filters.format !== "any" && meetup.format !== filters.format) return false
    if (
      filters.distance !== "any" &&
      meetup.location &&
      distanceFrom(city, meetup.location) > Number(filters.distance)
    ) {
      return false
    }
    if (!matchesDay(meetup, filters.day)) return false
    if (!matchesSize(meetup, filters.size)) return false
    if (
      query &&
      !`${meetup.title} ${meetup.group.name}`.toLowerCase().includes(query)
    ) {
      return false
    }
    return true
  })
}
