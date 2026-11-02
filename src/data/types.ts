export type Member = {
  id: string
  name: string
  avatarUrl: string
}

export type Group = {
  id: string
  name: string
  topic: string
  description: string
  rating: number
  imageUrl: string
}

export type CategoryId =
  | "spieltreff"
  | "fellpflege"
  | "fotowalk"
  | "outdoor"
  | "katzencafe"
  | "training"
  | "gesundheit"
  | "adoption"
  | "workshop"
  | "online"

export type Category = {
  id: CategoryId
  label: string
}

export type Meetup = {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  /** ISO-Datum mit Zeitzone */
  startsAt: string
  endsAt: string
  recurring: boolean
  format: "in-person" | "online"
  location: {
    name: string
    address: string
    city: string
    distanceKm: number
  } | null
  category: CategoryId
  group: Group
  /** Preis in CHF, `null` = kostenlos */
  price: number | null
  capacity: number
  attendees: Member[]
}
