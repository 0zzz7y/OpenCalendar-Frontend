import Calendar from "./calendar"
import Category from "./category"

interface Note {
  id: string
  name?: string
  description: string
  calendar: Calendar
  category?: Category
}

export default Note
