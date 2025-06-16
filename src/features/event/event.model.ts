import type { Schedulable } from "@/features/event/schedulable.model"
import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

export interface Event extends Schedulable {
  id: string
  name: string
  description?: string
  calendar: Calendar
  category?: Category
}
