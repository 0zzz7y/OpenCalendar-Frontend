import type { Category } from "@/features/category/category.model"

import { MESSAGE } from "@/components/shared/message.constant"

export function validateCategory(partial: Partial<Category>): void {
  if (!partial.name) {
    throw new Error(MESSAGE.FIELD_REQUIRED)
  }
}
