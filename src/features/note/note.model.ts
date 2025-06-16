import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

export interface Note {
  id: string
  name?: string
  description: string
  calendar: Calendar
  category?: Category
}
