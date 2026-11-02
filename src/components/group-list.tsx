"use client"

import Link from "next/link"
import { SearchXIcon } from "lucide-react"

import { cityName } from "@/data/cities"
import { meetups } from "@/data/meetups"
import type { Group } from "@/data/types"
import { summarizeGroups } from "@/lib/groups"
import { GroupCard } from "@/components/group-card"
import { usePreferences } from "@/components/preferences-provider"
import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function GroupList({
  query,
  onShowMeetups,
}: {
  query: string
  onShowMeetups: (group: Group) => void
}) {
  const { city, t } = usePreferences()
  const groups = summarizeGroups(meetups, city, query)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {query ? t.home.groupsFor(query) : t.home.groupsNear(cityName(city))}
      </h1>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {groups.map((summary) => (
            <GroupCard
              key={summary.group.id}
              summary={summary}
              onShowMeetups={() => onShowMeetups(summary.group)}
            />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>{t.home.noGroups}</EmptyTitle>
            <EmptyDescription>{t.home.noGroupsHint}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              {t.home.allGroups}
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
