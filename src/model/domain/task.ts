import RecurringPattern from "./recurringPattern"
import type Schedulable from "./schedulable"
import type TaskStatus from "./taskStatus"

interface Task extends Schedulable {
  name: string
  recurringPattern: RecurringPattern
  status: TaskStatus
}

export default Task
