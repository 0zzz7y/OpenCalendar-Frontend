import type Schedulable from "./schedulable"

interface Event extends Schedulable {
  name: string
  startDate: string
  endDate: string
}

export default Event
