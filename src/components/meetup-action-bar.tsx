"use client"

import { useState } from "react"
import { CheckIcon, HeartIcon, Share2Icon } from "lucide-react"
import { toast } from "sonner"

import type { Meetup } from "@/data/types"
import { useAttendance } from "@/hooks/use-attendance"
import { formatMeetupDate, formatPrice } from "@/lib/format"
import { usePreferences } from "@/components/preferences-provider"
import { AttendDialog } from "@/components/attend-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/** Fixierte Leiste am unteren Rand mit Teilnehmen, Merken und Teilen. */
export function MeetupActionBar({ meetup }: { meetup: Meetup }) {
  const [isAttending, setAttending] = useAttendance(meetup.id)
  const [isSaved, setSaved] = useState(false)
  const { lang, t } = usePreferences()
  const attendeeCount = meetup.attendees.length + (isAttending ? 1 : 0)
  const seatsLeft = meetup.capacity - attendeeCount

  async function share() {
    await navigator.clipboard.writeText(window.location.href)
    toast(t.actionBar.linkCopied, { description: t.actionBar.linkCopiedHint })
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-4">
      <Card className="mx-auto max-w-5xl flex-row items-center gap-4 px-6 shadow-lg">
        <div className="min-w-0 flex-1">
          <CardDescription className="text-xs">
            {formatMeetupDate(meetup.startsAt, lang)}
          </CardDescription>
          <CardTitle className="truncate">{meetup.title}</CardTitle>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Badge variant="outline">
            {meetup.price === null ? t.meetup.free : formatPrice(meetup.price)}
          </Badge>
          {seatsLeft > 0 ? (
            <Badge variant="secondary">{t.meetup.seatsLeft(seatsLeft)}</Badge>
          ) : (
            <Badge variant="secondary">{t.meetup.waitlist}</Badge>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger
            render={
              <Toggle
                variant="outline"
                size="lg"
                pressed={isSaved}
                onPressedChange={setSaved}
                aria-label={t.actionBar.save}
              />
            }
          >
            <HeartIcon className="group-aria-pressed/toggle:fill-current" />
          </TooltipTrigger>
          <TooltipContent>{isSaved ? t.actionBar.saved : t.actionBar.save}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                onClick={share}
                aria-label={t.actionBar.share}
              />
            }
          >
            <Share2Icon />
          </TooltipTrigger>
          <TooltipContent>{t.actionBar.copyLink}</TooltipContent>
        </Tooltip>

        {isAttending ? (
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="secondary" size="lg" />}>
              <CheckIcon data-icon="inline-start" />
              {t.actionBar.attending}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.actionBar.cancelTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.actionBar.cancelHint}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.actionBar.keep}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    setAttending(false)
                    toast(t.actionBar.cancelled, { description: meetup.title })
                  }}
                >
                  {t.actionBar.cancel}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AttendDialog
            meetup={meetup}
            trigger={
              <Button size="lg">{seatsLeft > 0 ? t.actionBar.attend : t.meetup.waitlist}</Button>
            }
          />
        )}
      </Card>
    </div>
  )
}
