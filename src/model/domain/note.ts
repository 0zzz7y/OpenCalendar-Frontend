/**
 * Copyright (c) Tomasz Wnuk
 */

import type Calendar from "./calendar"
import type Category from "./category"

interface Note {
  id: string
  title?: string
  description: string
  calendar: Calendar
  category?: Category
}

export default Note
