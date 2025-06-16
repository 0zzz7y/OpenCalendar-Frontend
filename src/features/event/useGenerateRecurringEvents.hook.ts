import dayjs from "dayjs"

import type { Event } from "@/features/event/event.model"
import { RecurringPattern } from "@/features/event/recurringPattern.type"

const DATE_FORMAT = "YYYY-MM-DD"

const RECURRING_PATTERN_DAILY_RECURRING_VALUE = 1
const RECURRING_PATTERN_DAILY_RECURRING_UNIT = "month"

const RECURRING_PATTERN_WEEKLY_RECURRING_VALUE = 3
const RECURRING_PATTERN_WEEKLY_RECURRING_UNIT = "month"

const RECURRING_PATTERN_MONTHLY_RECURRING_VALUE = 1
const RECURRING_PATTERN_MONTHLY_RECURRING_UNIT = "year"

const RECURRING_PATTERN_YEARLY_RECURRING_VALUE = 10
const RECURRING_PATTERN_YEARLY_RECURRING_UNIT = "year"

export function useGenerateRecurringEvents(event: Event): Event[] {
  const shouldGenerateRecurringEvents =
    event.startDate || event.endDate || event.recurringPattern !== RecurringPattern.NONE
  if (!shouldGenerateRecurringEvents) return []

  const events: Event[] = []
  const startDate = dayjs(event.startDate)
  const endDate = dayjs(event.endDate)

  let cursor = startDate
  let limitDate = startDate
  switch (event.recurringPattern) {
    case RecurringPattern.DAILY:
      limitDate = startDate.add(RECURRING_PATTERN_DAILY_RECURRING_VALUE, RECURRING_PATTERN_DAILY_RECURRING_UNIT)
      while (cursor.isBefore(limitDate)) {
        events.push({
          ...event,
          id: `${event.id}-recurring-${cursor.format(DATE_FORMAT)}`,
          startDate: cursor.toISOString(),
          endDate: cursor.add(endDate.diff(startDate)).toISOString()
        })
        cursor = cursor.add(1, "day")
      }
      break
    case RecurringPattern.WEEKLY:
      limitDate = startDate.add(RECURRING_PATTERN_WEEKLY_RECURRING_VALUE, RECURRING_PATTERN_WEEKLY_RECURRING_UNIT)
      while (cursor.isBefore(limitDate)) {
        events.push({
          ...event,
          id: `${event.id}-recurring-${cursor.format(DATE_FORMAT)}`,
          startDate: cursor.toISOString(),
          endDate: cursor.add(endDate.diff(startDate)).toISOString()
        })
        cursor = cursor.add(1, "week")
      }
      break
    case RecurringPattern.MONTHLY:
      limitDate = startDate.add(RECURRING_PATTERN_MONTHLY_RECURRING_VALUE, RECURRING_PATTERN_MONTHLY_RECURRING_UNIT)
      while (cursor.isBefore(limitDate)) {
        events.push({
          ...event,
          id: `${event.id}-recurring-${cursor.format(DATE_FORMAT)}`,
          startDate: cursor.toISOString(),
          endDate: cursor.add(endDate.diff(startDate)).toISOString()
        })
        cursor = cursor.add(1, "month")
      }
      break
    case RecurringPattern.YEARLY:
      limitDate = startDate.add(RECURRING_PATTERN_YEARLY_RECURRING_VALUE, RECURRING_PATTERN_YEARLY_RECURRING_UNIT)
      while (cursor.isBefore(limitDate)) {
        events.push({
          ...event,
          id: `${event.id}-recurring-${cursor.format(DATE_FORMAT)}`,
          startDate: cursor.toISOString(),
          endDate: cursor.add(endDate.diff(startDate)).toISOString()
        })
        cursor = cursor.add(1, "year")
      }
      break
    default:
      break
  }

  return events
}
