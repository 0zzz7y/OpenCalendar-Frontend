import type Schedulable from "./schedulable"

interface Event extends Schedulable {
  title: string
  startDate: string
  endDate: string
}

export default Event
