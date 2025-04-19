import Task from "@/type/task"

export interface TaskEditorData {
  id?: string
  name: string
  description?: string
  startDate?: string
  endDate?: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  calendarId: string
  categoryId?: string
}

export default interface TaskContextState {
  tasks: Task[]
  reloadTasks: () => Promise<void>

  editorOpen: boolean
  editorMode: "add" | "edit" | "delete"
  editorData: TaskEditorData
  openEditor: (mode: "add" | "edit" | "delete", data?: TaskEditorData) => void
  closeEditor: () => void
}
