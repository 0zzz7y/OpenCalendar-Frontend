/**
 * Copyright (c) Tomasz Wnuk
 */

interface NoteDto {
  id?: string
  name?: string
  description: string
  calendarId: string
  categoryId?: string
}

export default NoteDto
