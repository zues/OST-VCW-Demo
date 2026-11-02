"use client"

import { CalendarIcon, MapPinIcon, VideoIcon } from "lucide-react"
import { toast } from "sonner"

import type { Meetup } from "@/data/types"
import { useAttendance } from "@/hooks/use-attendance"
import { formatMeetupDateRange } from "@/lib/format"
import { usePreferences } from "@/components/preferences-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

/** Bestätigungs-Dialog zum Teilnehmen. `trigger` wird als Auslöser gerendert. */
export function AttendDialog({
  meetup,
  trigger,
}: {
  meetup: Meetup
  trigger: React.ReactElement
}) {
  const [, setAttending] = useAttendance(meetup.id)
  const { lang, t } = usePreferences()
  const { date, time } = formatMeetupDateRange(meetup.startsAt, meetup.endsAt, lang)
  const isFull = meetup.attendees.length >= meetup.capacity

  function confirm() {
    setAttending(true)
    toast.success(
      isFull ? t.attend.toastWaitlist : t.attend.toast,
      { description: meetup.title }
    )
  }

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isFull ? t.attend.titleWaitlist : t.attend.title}
          </DialogTitle>
          <DialogDescription>{meetup.title}</DialogDescription>
        </DialogHeader>
        <ItemGroup>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              <CalendarIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{date}</ItemTitle>
              <ItemDescription>{time}</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted" size="sm">
            <ItemMedia variant="icon">
              {meetup.location ? <MapPinIcon /> : <VideoIcon />}
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{meetup.location?.name ?? t.meetup.onlineMeetup}</ItemTitle>
              <ItemDescription>
                {meetup.location?.address ?? t.attend.linkAfterSignup}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.attend.abort}
          </DialogClose>
          <DialogClose render={<Button onClick={confirm} />}>
            {isFull ? t.attend.confirmWaitlist : t.attend.confirm}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
