import dayjs from "dayjs"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import RecurringPattern from "@/model/domain/recurringPattern"

/**
 * Generates recurring event instances based on the recurring pattern.
 * Only handled on frontend (clones events locally).
 */
export function generateRecurringSchedulables(event: Event): Schedulable[] {
  if (!event.startDate) return []

  const instances: Schedulable[] = []

  const start = dayjs(event.startDate)
  const end = event.endDate ? dayjs(event.endDate) : start.add(1, "hour")

  let cursor = start
  let limitDate = start

  switch (event.recurringPattern) {
    case RecurringPattern.DAILY:
      limitDate = start.add(1, "month")
      while (cursor.isBefore(limitDate)) {
        instances.push({
          ...event,
          id: `${event.id}-recurring-${cursor.format("YYYYMMDD")}`,
          startDate: cursor.toISOString(),
          endDate: cursor.add(end.diff(start)).toISOString(),
          originalEventId: event.id
        })
        cursor = cursor.add(1, "day")
      }
      break

    case RecurringPattern.WEEKLY:
      limitDate = start.add(3, "month")
      while (cursor.isBefore(limitDate)) {
        instances.push({
          ...event,
          id: `${event.id}-recurring-${cursor.format("YYYYMMDD")}`,
          startDate: cursor.toISOString(),
          endDate: cursor.add(end.diff(start)).toISOString(),
          originalEventId: event.id
        })
        cursor = cursor.add(1, "week")
      }
      break

    case RecurringPattern.MONTHLY:
      limitDate = start.add(1, "year")
      while (cursor.isBefore(limitDate)) {
        instances.push({
          ...event,
          id: `${event.id}-recurring-${cursor.format("YYYYMMDD")}`,
          startDate: cursor.toISOString(),
          endDate: cursor.add(end.diff(start)).toISOString(),
          originalEventId: event.id
        })
        cursor = cursor.add(1, "month")
      }
      break

    case RecurringPattern.YEARLY:
      limitDate = start.add(10, "year")
      while (cursor.isBefore(limitDate)) {
        instances.push({
          ...event,
          id: `${event.id}-recurring-${cursor.format("YYYYMMDD")}`,
          startDate: cursor.toISOString(),
          endDate: cursor.add(end.diff(start)).toISOString(),
          originalEventId: event.id
        })
        cursor = cursor.add(1, "year")
      }
      break

    case RecurringPattern.NONE:
    default:
      break
  }

  return instances
}
