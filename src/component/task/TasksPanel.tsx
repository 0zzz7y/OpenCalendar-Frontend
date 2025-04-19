import { useState } from "react"

import { Box, TextField } from "@mui/material"
import { AddCircleOutline } from "@mui/icons-material"

import TaskBoard from "./TasksBoard"

import useDashboard from "../../hook/api/useDashboard"

import TaskStatus from "../../type/taskStatus"
import Task from "../../type/task"
import MESSAGES from "@/constant/message"

const TasksPanel = () => {
  const { tasks, calendars, categories, addTask, updateTask, deleteTask } =
    useDashboard()

  const [newTitle, setNewTitle] = useState("")

  const handleCreate = async () => {
    if (!newTitle.trim()) return

    await addTask({
      name: newTitle,
      status: "TODO",
      calendarId: calendars[0]?.id || "",
      categoryId: categories[0]?.id || "",
      startDate: "",
      endDate: ""
    })

    setNewTitle("")
  }

  const handleUpdate = async (updated: Task) => {
    await updateTask(updated.id, updated)
  }

  const handleToggleStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const statusOrder: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"]
    const currentIndex = statusOrder.indexOf(task.status)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]

    await updateTask(id, { status: nextStatus })
  }

  return (
    <>
      <Box
        sx={{
          p: 2,
          maxHeight: "100vh",
          overflowY: "auto",
          boxSizing: "border-box",
          height: "100vh"
        }}
      >
        <TextField
          label={MESSAGES.PLACEHOLDERS.NEW_TASK}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          InputProps={{
            endAdornment: (
              <AddCircleOutline
                sx={{ cursor: "pointer" }}
                onClick={handleCreate}
              />
            )
          }}
          sx={{ mb: 2, width: 300 }}
        />

        <TaskBoard
          tasks={tasks}
          calendars={calendars}
          categories={categories}
          onUpdate={handleUpdate}
          onDelete={deleteTask}
        />
      </Box>
    </>
  )
}

export default TasksPanel
