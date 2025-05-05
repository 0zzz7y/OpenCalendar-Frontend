/**
 * Copyright (c) Tomasz Wnuk
 */

import type Calendar from "./calendar"
import type Category from "./category"
import type TaskStatus from "./taskStatus"

interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  calendar: Calendar
  category?: Category
}

export default Task
