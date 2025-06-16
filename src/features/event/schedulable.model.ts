import type { RecurringPattern } from "@/features/event/recurringPattern.type"

export interface Schedulable {
  startDate: string
  endDate: string
  recurringPattern: RecurringPattern
}
