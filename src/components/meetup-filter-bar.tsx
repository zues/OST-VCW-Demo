"use client"

import { CalendarIcon, MapIcon, MapPinIcon, UsersIcon } from "lucide-react"

import {
  defaultFilters,
  type DayFilter,
  type DistanceFilter,
  type FormatFilter,
  type MeetupFilters,
  type SizeFilter,
} from "@/lib/filter-meetups"
import { usePreferences } from "@/components/preferences-provider"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const days: DayFilter[] = ["any", "today", "tomorrow", "weekend", "week"]
const sizes: SizeFilter[] = ["any", "small", "medium", "large"]
const formats: FormatFilter[] = ["any", "in-person", "online"]
const distances: DistanceFilter[] = ["5", "10", "30", "50", "any"]

function FilterSelect<T extends string>({
  icon,
  label,
  items,
  value,
  onValueChange,
}: {
  icon: React.ReactNode
  label: string
  items: { value: T; label: string }[]
  value: T
  onValueChange: (value: T) => void
}) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => next !== null && onValueChange(next)}
    >
      <SelectTrigger aria-label={label}>
        {icon}
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function MeetupFilterBar({
  filters,
  onFiltersChange,
}: {
  filters: MeetupFilters
  onFiltersChange: (filters: MeetupFilters) => void
}) {
  const { t } = usePreferences()
  const dayItems = days.map((value) => ({ value, label: t.filters.days[value] }))
  const sizeItems = sizes.map((value) => ({ value, label: t.filters.sizes[value] }))
  const formatItems = formats.map((value) => ({ value, label: t.filters.formats[value] }))
  const distanceItems = distances.map((value) => ({
    value,
    label: value === "any" ? t.filters.anyDistance : t.filters.within(value),
  }))
  const isDirty =
    filters.day !== defaultFilters.day ||
    filters.size !== defaultFilters.size ||
    filters.format !== defaultFilters.format ||
    filters.distance !== defaultFilters.distance ||
    filters.category !== defaultFilters.category

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isDirty && (
        <Button
          variant="link"
          onClick={() =>
            onFiltersChange({ ...defaultFilters, query: filters.query })
          }
        >
          {t.filters.reset}
        </Button>
      )}
      <FilterSelect
        icon={<CalendarIcon />}
        label={t.filters.day}
        items={dayItems}
        value={filters.day}
        onValueChange={(day) => onFiltersChange({ ...filters, day })}
      />
      <FilterSelect
        icon={<UsersIcon />}
        label={t.filters.size}
        items={sizeItems}
        value={filters.size}
        onValueChange={(size) => onFiltersChange({ ...filters, size })}
      />
      <FilterSelect
        icon={<MapPinIcon />}
        label={t.filters.format}
        items={formatItems}
        value={filters.format}
        onValueChange={(format) => onFiltersChange({ ...filters, format })}
      />
      <FilterSelect
        icon={<MapIcon />}
        label={t.filters.distance}
        items={distanceItems}
        value={filters.distance}
        onValueChange={(distance) => onFiltersChange({ ...filters, distance })}
      />
    </div>
  )
}
