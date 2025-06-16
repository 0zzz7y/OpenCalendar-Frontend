import type { Event } from "@/features/event/event.model"

import { MESSAGE } from "@/components/shared/message.constant"

export function validateEvent(partial: Partial<Event>): void {
  if (!partial.name || !partial.startDate || !partial.endDate) {
    throw new Error(MESSAGE.FIELD_REQUIRED)
  }
}
