"use client"

import Form from "next/form"
import Image from "next/image"
import Link from "next/link"
import { GlobeIcon, MapPinIcon, MenuIcon, SearchIcon } from "lucide-react"

import { cities, cityName, type CityId } from "@/data/cities"
import { languages, type Lang } from "@/i18n/messages"
import { usePreferences } from "@/components/preferences-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"

function LanguageItems() {
  const { lang, setLang } = usePreferences()
  return (
    <DropdownMenuRadioGroup value={lang} onValueChange={(value) => setLang(value as Lang)}>
      {languages.map((l) => (
        <DropdownMenuRadioItem key={l.value} value={l.value}>
          {l.label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  )
}

function CityItems() {
  const { city, setCity } = usePreferences()
  return (
    <DropdownMenuRadioGroup value={city} onValueChange={(value) => setCity(value as CityId)}>
      {cities.map((c) => (
        <DropdownMenuRadioItem key={c.id} value={c.id}>
          {c.name}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  )
}

export function SiteHeader({ query = "" }: { query?: string }) {
  const { lang, city, t } = usePreferences()

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-3 px-6 sm:gap-6">
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt="MeetCat" width={82} height={32} priority className="h-8 w-auto" />
        </Link>

        <Form action="/" className="w-full min-w-0 max-w-md">
          <InputGroup>
            <InputGroupInput
              key={query}
              name="q"
              defaultValue={query}
              placeholder={t.header.search}
              aria-label={t.header.search}
            />
            <Separator orientation="vertical" className="my-2 hidden sm:block" />
            <InputGroupAddon align="inline-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<InputGroupButton size="sm" className="hidden sm:flex" />}
                  aria-label={t.header.location}
                >
                  <MapPinIcon />
                  {cityName(city)}, CH
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{t.header.location}</DropdownMenuLabel>
                    <CityItems />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-sm"
                aria-label={t.header.submit}
              >
                <SearchIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Form>

        <nav className="ml-auto hidden items-center gap-2 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" />} aria-label={t.header.language}>
              <GlobeIcon />
              {languages.find((l) => l.value === lang)?.label}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <LanguageItems />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost">{t.header.login}</Button>
          <Button>{t.header.signup}</Button>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="ml-auto shrink-0 lg:hidden" />}
            aria-label={t.header.menu}
          >
            <MenuIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>{t.header.login}</DropdownMenuItem>
            <DropdownMenuItem>{t.header.signup}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t.header.location}</DropdownMenuLabel>
              <CityItems />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t.header.language}</DropdownMenuLabel>
              <LanguageItems />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
