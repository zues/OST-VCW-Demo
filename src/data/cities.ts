/** Orte, die im Header ausgewählt werden können. */
export const cities = [
  { id: "zuerich", name: "Zürich" },
  { id: "winterthur", name: "Winterthur" },
  { id: "uster", name: "Uster" },
  { id: "stgallen", name: "St. Gallen" },
  { id: "bern", name: "Bern" },
] as const

export type CityId = (typeof cities)[number]["id"]

export const defaultCity: CityId = "zuerich"

/** Koordinaten aller Orte, die in den Daten vorkommen (Breite, Länge). */
const coordinates: Record<string, [number, number]> = {
  Zürich: [47.3769, 8.5417],
  Winterthur: [47.4988, 8.7237],
  Uster: [47.3471, 8.7209],
  Dietlikon: [47.4183, 8.6187],
  "St. Gallen": [47.4245, 9.3767],
  Bern: [46.948, 7.4474],
}

export function cityName(id: CityId) {
  return cities.find((city) => city.id === id)?.name ?? cities[0].name
}

function haversineKm([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(a))
}

/**
 * Entfernung eines Meetup-Orts zum gewählten Ort. Die Mock-Daten sind relativ
 * zu Zürich erfasst (`distanceKm`), für alle anderen Orte wird Luftlinie
 * zwischen den Ortsmitten gerechnet.
 */
export function distanceFrom(
  from: CityId,
  location: { city: string; distanceKm: number }
) {
  if (from === "zuerich") return location.distanceKm
  const start = coordinates[cityName(from)]
  const target = coordinates[location.city]
  if (!start || !target) return Infinity
  return Math.max(1, Math.round(haversineKm(start, target)))
}
