/**
 * Copyright (c) Tomasz Wnuk
 */

interface NoteDto {
  id?: string
  title?: string
  description: string
  calendarId: string
  categoryId?: string
}

export default NoteDto
