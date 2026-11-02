import data from "./meetcat.json"
import type { CategoryId, Group, Member, Meetup } from "./types"

/** Mock-"Heute": alle Datumsfilter rechnen relativ zu diesem Tag. */
export const TODAY = data.today

const members: Member[] = data.members.map((m) => ({
  id: m.id,
  name: m.name,
  avatarUrl: m.avatar,
}))

/** Liefert `count` Teilnehmende; über 10 hinaus werden Mitglieder wiederverwendet. */
function attendees(count: number, offset = 0): Member[] {
  return Array.from({ length: count }, (_, i) => {
    const m = members[(i + offset) % members.length]
    return { ...m, id: `${m.id}-${i}` }
  })
}

const groups = new Map<string, Group>(
  data.groups.map((g) => [
    g.id,
    {
      id: g.id,
      name: g.title,
      topic: g.topic,
      description: g.description,
      rating: g.rating,
      imageUrl: g.image.src,
    },
  ])
)

/** Meetups aus `meetcat.json`; Bild und Gruppe kommen von der Gruppe. */
export const meetups: Meetup[] = data.meetups.map((m, index) => {
  const group = groups.get(m.groupId)
  if (!group) throw new Error(`Unbekannte Gruppe ${m.groupId} in Meetup ${m.id}`)
  return {
    id: m.id,
    slug: m.slug,
    title: m.title,
    description: m.description,
    imageUrl: group.imageUrl,
    startsAt: m.startsAt,
    endsAt: m.endsAt,
    recurring: m.recurring,
    format: m.format as Meetup["format"],
    location: m.location,
    category: m.category as CategoryId,
    group,
    price: m.price,
    capacity: m.capacity,
    attendees: attendees(m.attendeeCount, index),
  }
})

export function getMeetupBySlug(slug: string) {
  return meetups.find((meetup) => meetup.slug === slug)
}

/** Ähnliche Meetups: gleiche Kategorie zuerst, danach gleiche Gruppe. */
export function getRelatedMeetups(meetup: Meetup, count = 3) {
  const others = meetups.filter((m) => m.id !== meetup.id)
  const sameCategory = others.filter((m) => m.category === meetup.category)
  const sameGroup = others.filter(
    (m) => m.group.id === meetup.group.id && m.category !== meetup.category
  )
  return [...sameCategory, ...sameGroup].slice(0, count)
}
