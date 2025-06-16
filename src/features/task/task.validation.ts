import type { Task } from "@/features/task/task.model"

import { MESSAGE } from "@/components/shared/message.constant"

export function validateTask(partial: Partial<Task>): void {
  if (!partial.name) {
    throw new Error(MESSAGE.FIELD_REQUIRED)
  }
}
