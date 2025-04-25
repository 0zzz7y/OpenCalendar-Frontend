import type Calendar from "./calendar"
import type Category from "./category"

interface Note {
  id: string
  name?: string
  description: string
  calendar: Calendar
  category?: Category
}

export default Note
