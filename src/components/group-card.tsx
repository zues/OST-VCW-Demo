"use client"

import Image from "next/image"
import { StarIcon } from "lucide-react"

import type { GroupSummary } from "@/lib/groups"
import { usePreferences } from "@/components/preferences-provider"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function GroupCard({
  summary,
  onShowMeetups,
}: {
  summary: GroupSummary
  onShowMeetups: () => void
}) {
  const { t } = usePreferences()
  const { group, meetupCount, cities } = summary

  return (
    <Card className="h-full pt-0">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={group.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </AspectRatio>

      <CardHeader className="flex-1 content-start">
        <CardTitle>{group.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          {group.rating.toFixed(1)}
          <StarIcon className="size-3 fill-current" aria-label={t.meetup.stars} />
          <span aria-hidden>·</span>
          {t.group.meetups(meetupCount)}
        </CardDescription>
        <CardDescription>
          {cities.length > 0 ? cities.join(", ") : t.group.online}
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onShowMeetups}>
          {t.group.showMeetups}
        </Button>
      </CardFooter>
    </Card>
  )
}
