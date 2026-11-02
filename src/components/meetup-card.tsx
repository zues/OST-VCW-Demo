"use client"

import Image from "next/image"
import Link from "next/link"
import { StarIcon } from "lucide-react"

import type { Meetup } from "@/data/types"
import { formatMeetupDate, formatPrice } from "@/lib/format"
import { usePreferences } from "@/components/preferences-provider"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const MAX_AVATARS = 3

export function MeetupCard({ meetup }: { meetup: Meetup }) {
  const { lang, t } = usePreferences()
  const seatsLeft = meetup.capacity - meetup.attendees.length

  return (
    <Link href={`/meetups/${meetup.slug}`} className="group/meetup-card">
      <Card className="h-full pt-0 transition-shadow group-hover/meetup-card:shadow-md">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={meetup.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {meetup.price !== null && (
              <Badge variant="secondary">{formatPrice(meetup.price)}</Badge>
            )}
            {seatsLeft <= 0 ? (
              <Badge variant="secondary">{t.meetup.waitlist}</Badge>
            ) : seatsLeft <= 3 ? (
              <Badge variant="secondary">{t.meetup.seatsLeft(seatsLeft)}</Badge>
            ) : null}
          </div>
        </AspectRatio>

        <CardHeader className="flex-1 content-start">
          <CardTitle className="line-clamp-2">{meetup.title}</CardTitle>
          <CardDescription>
            {meetup.recurring && `${t.meetup.weekly} · `}
            {formatMeetupDate(meetup.startsAt, lang)}
          </CardDescription>
          <CardDescription className="flex items-center gap-1">
            <span className="truncate">{t.meetup.by(meetup.group.name)}</span>
            <span aria-hidden>·</span>
            {meetup.group.rating.toFixed(1)}
            <StarIcon className="size-3 fill-current" aria-label={t.meetup.stars} />
          </CardDescription>
        </CardHeader>

        <CardFooter className="gap-2">
          <AvatarGroup>
            {meetup.attendees.slice(0, MAX_AVATARS).map((member) => (
              <Avatar key={member.id} size="sm">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <span className="font-medium">
            {t.meetup.attendees(meetup.attendees.length)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
