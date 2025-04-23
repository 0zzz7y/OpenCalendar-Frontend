import Schedulable from "./schedulable"
import TaskStatus from "./taskStatus"

interface Task extends Schedulable {
  id: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  status: TaskStatus
}

export default Task
