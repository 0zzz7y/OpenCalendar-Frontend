import Calendar from "./calendar"
import Category from "./category"
import Schedulable from "./schedulable"

interface Event extends Schedulable {
  id: string
  name: string
  description?: string
  startDate: string,
  endDate: string,
  calendar: Calendar
  category?: Category
}

export default Event
