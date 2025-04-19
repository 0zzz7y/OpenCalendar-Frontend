import { createContext, useContext, useState, ReactNode } from "react"

import TaskContextState, { TaskEditorData } from "./state/TaskContextState"

import useTask from "../hook/api/useTask"

const TaskContext = createContext<TaskContextState | undefined>(undefined)

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<"add" | "edit" | "delete">("add")
  const [editorData, setEditorData] = useState<TaskEditorData>({
    name: "",
    status: "TODO",
    calendarId: ""
  })

  const { tasks, reloadTasks } = useTask()

  const openEditor = (
    mode: "add" | "edit" | "delete",
    data: TaskEditorData = {
      name: "",
      status: "TODO",
      calendarId: ""
    }
  ) => {
    setEditorMode(mode)
    setEditorData(data)
    setEditorOpen(true)
  }

  const closeEditor = () => setEditorOpen(false)

  return (
    <TaskContext.Provider
      value={{
        tasks,
        reloadTasks,
        editorOpen,
        editorMode,
        editorData,
        openEditor,
        closeEditor
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export default TaskContext
