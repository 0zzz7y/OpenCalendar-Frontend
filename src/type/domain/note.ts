import Calendar from "./calendar"
import Category from "./category"

interface Note {
  id: string
  name?: string
  description: string
  calendar: Calendar
  category?: Category
  positionX: number
  positionY: number
}

export default Note
