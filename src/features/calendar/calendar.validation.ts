import type { Calendar } from "@/features/calendar/calendar.model"

import { MESSAGE } from "@/components/shared/message.constant"

export function validateCalendar(partial: Partial<Calendar>): void {
  if (!partial.name) {
    throw new Error(MESSAGE.FIELD_REQUIRED)
  }
}
