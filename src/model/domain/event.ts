import Schedulable from "./schedulable"

interface Event extends Schedulable {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
}

export default Event
