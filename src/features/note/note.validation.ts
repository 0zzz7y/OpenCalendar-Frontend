import type { Note } from "@/features/note/note.model"

import { MESSAGE } from "@/components/shared/message.constant"

export function validateNote(partial: Partial<Note>): void {
  if (!partial.description) {
    throw new Error(MESSAGE.FIELD_REQUIRED)
  }
}
