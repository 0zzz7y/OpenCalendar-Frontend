import FILTER from "@/constant/utility/filter"

export function filterByCategory<T>(
  items: T[],
  selectedCategory: string
): T[] {
  return selectedCategory === FILTER.ALL
    ? items
    : items.filter(
        (item) => (item as { categoryId?: string }).categoryId === selectedCategory
      )
}

export function filterByCalendar<T>(
  items: T[],
  selectedCalendar: string
): T[] {
  return selectedCalendar === FILTER.ALL
    ? items
    : items.filter(
        (item) => (item as { calendarId?: string }).calendarId === selectedCalendar
      )
}
