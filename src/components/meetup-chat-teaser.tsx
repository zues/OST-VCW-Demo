"use client"

import { MessagesSquareIcon } from "lucide-react"

import type { Meetup } from "@/data/types"
import { useAttendance } from "@/hooks/use-attendance"
import { usePreferences } from "@/components/preferences-provider"
import { AttendDialog } from "@/components/attend-dialog"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function MeetupChatTeaser({ meetup }: { meetup: Meetup }) {
  const [isAttending] = useAttendance(meetup.id)
  const { t } = usePreferences()

  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <MessagesSquareIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{t.chat.title}</ItemTitle>
        <ItemDescription>
          {isAttending ? t.chat.opensSoon : t.chat.joinHint}
        </ItemDescription>
      </ItemContent>
      {!isAttending && (
        <ItemActions>
          <AttendDialog
            meetup={meetup}
            trigger={<Button variant="outline" size="sm">{t.actionBar.attend}</Button>}
          />
        </ItemActions>
      )}
    </Item>
  )
}
