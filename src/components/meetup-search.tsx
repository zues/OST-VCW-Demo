"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchXIcon } from "lucide-react"

import { cityName } from "@/data/cities"
import { meetups } from "@/data/meetups"
import {
  defaultFilters,
  filterMeetups,
  type MeetupFilters,
} from "@/lib/filter-meetups"
import { CategoryCarousel } from "@/components/category-carousel"
import { MeetupCard } from "@/components/meetup-card"
import { MeetupFilterBar } from "@/components/meetup-filter-bar"
import { usePreferences } from "@/components/preferences-provider"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"

export function MeetupSearch({ query }: { query: string }) {
  const router = useRouter()
  const { city, t } = usePreferences()
  const [filters, setFilters] = useState<MeetupFilters>({
    ...defaultFilters,
    query,
  })
  // Neue Suche aus dem Header: Suchbegriff übernehmen, gesetzte Filter behalten
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setFilters({ ...filters, query })
  }
  const results = filterMeetups(meetups, filters, city)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {filters.query
            ? t.home.meetupsFor(filters.query)
            : t.home.meetupsNear(cityName(city))}
        </h1>
        <MeetupFilterBar filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="flex flex-col gap-2">
        <CategoryCarousel
          value={filters.category}
          onValueChange={(category) => setFilters({ ...filters, category })}
        />
        <Separator />
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {results.map((meetup) => (
            <MeetupCard key={meetup.id} meetup={meetup} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>{t.home.noMeetups}</EmptyTitle>
            <EmptyDescription>{t.home.noMeetupsHint}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ ...defaultFilters })
                if (query) router.push("/")
              }}
            >
              {t.home.resetAll}
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
