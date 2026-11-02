"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { usePreferences } from "@/components/preferences-provider"
import { GroupList } from "@/components/group-list"
import { MeetupSearch } from "@/components/meetup-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HomeTabs({ query }: { query: string }) {
  const router = useRouter()
  const { t } = usePreferences()
  const [tab, setTab] = useState("meetups")

  return (
    <Tabs value={tab} onValueChange={setTab} className="gap-6">
      <TabsList>
        <TabsTrigger value="meetups">{t.home.meetups}</TabsTrigger>
        <TabsTrigger value="groups">{t.home.groups}</TabsTrigger>
      </TabsList>
      <TabsContent value="meetups">
        <MeetupSearch query={query} />
      </TabsContent>
      <TabsContent value="groups">
        <GroupList
          query={query}
          onShowMeetups={(group) => {
            setTab("meetups")
            router.push(`/?q=${encodeURIComponent(group.name)}`)
          }}
        />
      </TabsContent>
    </Tabs>
  )
}
