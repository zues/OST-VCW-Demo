import { Suspense } from "react"

import { HomeTabs } from "@/components/home-tabs"
import { SiteHeader } from "@/components/site-header"

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  )
}

async function HomeContent({
  searchParams,
}: Pick<PageProps<"/">, "searchParams">) {
  const { q } = await searchParams
  const query = typeof q === "string" ? q : ""

  return (
    <>
      <SiteHeader query={query} />
      <main className="mx-auto w-full max-w-screen-2xl px-6 py-6">
        <HomeTabs query={query} />
      </main>
    </>
  )
}
