import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  CalendarIcon,
  CameraIcon,
  ChevronRightIcon,
  MapPinIcon,
  StarIcon,
  VideoIcon,
} from "lucide-react"

import { getMeetupBySlug, getRelatedMeetups, meetups } from "@/data/meetups"
import type { Meetup } from "@/data/types"
import { formatMeetupDateRange, formatPrice } from "@/lib/format"
import { getPreferences } from "@/lib/get-preferences"
import { MeetupActionBar } from "@/components/meetup-action-bar"
import { MeetupAttendees } from "@/components/meetup-attendees"
import { MeetupCard } from "@/components/meetup-card"
import { MeetupChatTeaser } from "@/components/meetup-chat-teaser"
import { SiteHeader } from "@/components/site-header"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

export function generateStaticParams() {
  return meetups.map((meetup) => ({ slug: meetup.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/meetups/[slug]">) {
  const { slug } = await params
  const meetup = getMeetupBySlug(slug)
  return { title: meetup ? `${meetup.title} · MeetCat` : "MeetCat" }
}

export default function MeetupPage({ params }: PageProps<"/meetups/[slug]">) {
  return (
    <>
      <SiteHeader />
      <Suspense>
        {params.then(({ slug }) => {
          const meetup = getMeetupBySlug(slug)
          if (!meetup) notFound()
          return <MeetupDetail meetup={meetup} />
        })}
      </Suspense>
    </>
  )
}

function Rating({ value, label }: { value: number; label: string }) {
  return (
    <span className="flex items-center gap-1">
      {value.toFixed(1)}
      <span className="flex" aria-label={label}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon
            key={i}
            className={`size-3.5 ${i < Math.round(value) ? "fill-current" : ""}`}
          />
        ))}
      </span>
    </span>
  )
}

async function MeetupDetail({ meetup }: { meetup: Meetup }) {
  const { lang, t } = await getPreferences()
  const { date, time } = formatMeetupDateRange(meetup.startsAt, meetup.endsAt, lang)
  const [host, ...coHosts] = meetup.attendees
  const related = getRelatedMeetups(meetup)
  const topics = [
    t.categories[meetup.category],
    meetup.location ? t.detail.topicCity(meetup.location.city) : t.detail.topicOnline,
    meetup.format === "online" ? t.detail.online : t.detail.inPerson,
    t.detail.cats,
  ]

  return (
    <>
      <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-36">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-balance">
                {meetup.title}
              </h1>

              {host && (
                <Item size="sm" className="px-0">
                  <ItemMedia>
                    <Avatar size="lg">
                      <AvatarImage src={host.avatarUrl} alt="" />
                      <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription>
                      {t.detail.hostedBy} <strong className="text-foreground">{host.name}</strong>
                      {coHosts.length > 0 && t.detail.andOneMore}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              )}

              <Item variant="outline" render={<Link href={`/?q=${encodeURIComponent(meetup.group.name)}`} />}>
                <ItemMedia variant="image">
                  <Image src={meetup.group.imageUrl} alt="" width={40} height={40} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{meetup.group.name}</ItemTitle>
                  <ItemDescription>
                    <Rating value={meetup.group.rating} label={t.detail.rating(meetup.group.rating)} />
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </Item>
            </div>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-xl font-semibold">{t.detail.details}</h2>
              <p className="leading-relaxed">{meetup.description}</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  {t.detail.cost}:{" "}
                  {meetup.price === null ? t.detail.free : formatPrice(meetup.price)}
                </li>
                <li>{t.detail.maxAttendees(meetup.capacity)}</li>
                <li>
                  {meetup.format === "online" ? t.detail.onlineNote : t.detail.inPersonNote}
                </li>
                {meetup.recurring && <li>{t.detail.weekly}</li>}
              </ul>
            </section>

            <MeetupAttendees meetup={meetup} />

            <section className="flex flex-col gap-4">
              <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
                {t.detail.photos}
                <Badge variant="secondary">0</Badge>
              </h2>
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CameraIcon />
                  </EmptyMedia>
                  <EmptyTitle>{t.detail.noPhotos}</EmptyTitle>
                  <EmptyDescription>{t.detail.noPhotosHint}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </section>

            <Item variant="muted" render={<Link href={`/?q=${encodeURIComponent(meetup.group.name)}`} />}>
              <ItemContent>
                <ItemTitle>{t.detail.moreFrom(meetup.group.name)}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </Item>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-xl font-semibold">{t.detail.topics}</h2>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
            <AspectRatio ratio={16 / 10} className="overflow-hidden rounded-xl">
              <Image
                src={meetup.imageUrl}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 22rem, 100vw"
                className="object-cover"
              />
            </AspectRatio>

            <ItemGroup className="gap-0 rounded-xl border">
              <Item>
                <ItemMedia variant="icon">
                  <CalendarIcon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{date}</ItemTitle>
                  <ItemDescription>{time}</ItemDescription>
                </ItemContent>
              </Item>
              <ItemSeparator />
              <Item>
                <ItemMedia variant="icon">
                  {meetup.location ? <MapPinIcon /> : <VideoIcon />}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{meetup.location?.name ?? t.meetup.onlineMeetup}</ItemTitle>
                  <ItemDescription>
                    {meetup.location?.address ?? t.detail.linkAfterSignup}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>

            <MeetupChatTeaser meetup={meetup} />
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold">
                {t.detail.related}
              </h2>
              <Link href="/" className={buttonVariants({ variant: "link" })}>
                {t.detail.showAll}
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((m) => (
                <MeetupCard key={m.id} meetup={m} />
              ))}
            </div>
          </section>
        )}
      </main>
      <MeetupActionBar meetup={meetup} />
    </>
  )
}
