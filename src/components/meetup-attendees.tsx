"use client"

import type { Member, Meetup } from "@/data/types"
import { useAttendance } from "@/hooks/use-attendance"
import { usePreferences } from "@/components/preferences-provider"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
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
import { ScrollArea } from "@/components/ui/scroll-area"

const HOST_COUNT = 2
const VISIBLE_CARDS = 3


function MemberAvatar({ member, size }: { member: Member; size?: "sm" | "lg" }) {
  return (
    <Avatar size={size}>
      {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt="" />}
      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}

export function MeetupAttendees({ meetup }: { meetup: Meetup }) {
  const [isAttending] = useAttendance(meetup.id)
  const { t } = usePreferences()
  const you: Member = { id: "you", name: t.attendees.you, avatarUrl: "" }
  const members = isAttending ? [...meetup.attendees, you] : meetup.attendees
  const visible = members.slice(0, VISIBLE_CARDS)
  const rest = members.slice(VISIBLE_CARDS)

  function role(index: number) {
    return index < HOST_COUNT ? t.attendees.host : null
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
          {t.attendees.title}
          <Badge variant="secondary">{members.length}</Badge>
        </h2>
        <Dialog>
          <DialogTrigger render={<Button variant="link" />}>
            {t.attendees.showAll}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.attendees.dialogTitle(members.length)}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-96">
              <ItemGroup>
                {members.map((member, index) => (
                  <Item key={member.id} size="sm">
                    <ItemMedia>
                      <MemberAvatar member={member} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{member.name}</ItemTitle>
                      {role(index) && (
                        <ItemDescription>{role(index)}</ItemDescription>
                      )}
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {visible.map((member, index) => (
          <Card key={member.id} size="sm">
            <CardContent className="flex flex-col items-center gap-2 text-center">
              <MemberAvatar member={member} size="lg" />
              <div className="font-medium">{member.name}</div>
              {role(index) && <Badge variant="outline">{role(index)}</Badge>}
            </CardContent>
          </Card>
        ))}
        {rest.length > 0 && (
          <Card size="sm">
            <CardContent className="flex flex-col items-center gap-2 text-center">
              <AvatarGroup>
                {rest.slice(0, 2).map((member) => (
                  <MemberAvatar key={member.id} member={member} size="lg" />
                ))}
                {rest.length > 2 && (
                  <AvatarGroupCount>+{rest.length - 2}</AvatarGroupCount>
                )}
              </AvatarGroup>
              <div className="font-medium">{t.attendees.more(rest.length)}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
