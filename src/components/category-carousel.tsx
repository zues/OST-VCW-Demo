"use client"

import {
  CameraIcon,
  CoffeeIcon,
  GraduationCapIcon,
  HammerIcon,
  HeartHandshakeIcon,
  type LucideIcon,
  PawPrintIcon,
  PuzzleIcon,
  ScissorsIcon,
  StethoscopeIcon,
  TreesIcon,
  VideoIcon,
} from "lucide-react"

import { categories } from "@/data/categories"
import type { CategoryId } from "@/data/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { usePreferences } from "@/components/preferences-provider"
import { Toggle } from "@/components/ui/toggle"

const icons: Record<CategoryId | "all", LucideIcon> = {
  all: PawPrintIcon,
  spieltreff: PuzzleIcon,
  fellpflege: ScissorsIcon,
  fotowalk: CameraIcon,
  outdoor: TreesIcon,
  katzencafe: CoffeeIcon,
  training: GraduationCapIcon,
  gesundheit: StethoscopeIcon,
  adoption: HeartHandshakeIcon,
  workshop: HammerIcon,
  online: VideoIcon,
}

const items = [{ id: "all" } as const, ...categories]

export function CategoryCarousel({
  value,
  onValueChange,
}: {
  value: CategoryId | "all"
  onValueChange: (value: CategoryId | "all") => void
}) {
  const { t } = usePreferences()

  return (
    <Carousel opts={{ align: "start", dragFree: true }} className="px-10">
      <CarouselContent className="-ml-2">
        {items.map((item) => {
          const Icon = icons[item.id]
          return (
            <CarouselItem key={item.id} className="basis-auto pl-2">
              <Toggle
                size="lg"
                className="h-auto flex-col gap-1.5 px-3 py-2"
                pressed={value === item.id}
                onPressedChange={() => onValueChange(item.id)}
              >
                <Icon className="size-5" />
                <span className="text-xs">{t.categories[item.id]}</span>
              </Toggle>
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  )
}
