import RecurringPattern from "@/type/domain/recurringPattern"
import Task from "@/type/domain/task"
import TaskStatus from "@/type/domain/taskStatus"
import EditorMode from "@/type/utility/editorMode"

export interface TaskEditorData {
  id?: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  recurringPattern: RecurringPattern
  status: TaskStatus
  calendarId: string
  categoryId?: string
}

export default interface TaskContextState {
  tasks: Task[]
  reloadTasks: () => Promise<void>

  editorOpen: boolean
  editorMode: EditorMode
  editorData: TaskEditorData
  openEditor: (mode: EditorMode, data?: TaskEditorData) => void
  closeEditor: () => void
}
