import MESSAGES from "@/constant/ui/messages"
import useTask from "@/hook//useTask"
import RecurringPattern from "@/model/domain/recurringPattern"
import Task from "@/model/domain/task"
import TaskStatus from "@/model/domain/taskStatus"

import { useEffect, useRef, useState } from "react"

import { AddCircleOutline } from "@mui/icons-material"
import { Box, TextField, Paper } from "@mui/material"

import TaskBoard from "./TasksBoard"
import useAppStore from "@/store/useAppStore"

const TasksPanel = () => {
  const { tasks, categories, calendars } = useAppStore()
  const { addTask, updateTask, deleteTask } = useTask()

  const [newTitle, setNewTitle] = useState("")
  const [localTasks, setLocalTasks] = useState<Task[]>([])

  useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])

  const handleCreate = async () => {
    if (!newTitle.trim()) return

    const tempId = ""
    const defaultCalendar = calendars[0] || null
    const defaultCategory = categories[0] || null

    const newTask: Task = {
      id: tempId,
      name: newTitle,
      description: "",
      calendar: defaultCalendar,
      category: defaultCategory,
      status: TaskStatus.TODO,
      recurringPattern: RecurringPattern.NONE,
      startDate: "",
      endDate: ""
    }

    setLocalTasks((prev) => [...prev, newTask])

    const savedTask = await addTask({
      name: newTask.name,
      status: newTask.status,
      recurringPattern: newTask.recurringPattern,
      calendar: defaultCalendar,
      category: defaultCategory,
      startDate: newTask.startDate,
      endDate: newTask.endDate
    })

    if (savedTask?.id) {
      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id === tempId
            ? { ...savedTask, ...task, id: savedTask.id }
            : task
        )
      )
    }

    setNewTitle("")
  }

  const handleUpdate = async (updated: Task) => {
    setLocalTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task))
    )
    await updateTask(updated.id, updated)
  }

  const handleDelete = async (id: string) => {
    setLocalTasks((prev) => prev.filter((task) => task.id !== id))
    await deleteTask(id)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        p: 2,
        boxSizing: "border-box"
      }}
    >

        <TextField
          label={MESSAGES.NEW_TASK}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          fullWidth
          InputProps={{
            endAdornment: (
              <AddCircleOutline
                sx={{ cursor: "pointer" }}
                onClick={handleCreate}
              />
            )
          }}
          sx={{marginBottom: 2}}
        />

      <Box sx={{ flex: 1 }}>
        <TaskBoard
          tasks={localTasks}
          calendars={calendars}
          categories={categories}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </Box>
    </Box>
  )
}

export default TasksPanel
