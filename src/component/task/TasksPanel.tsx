import MESSAGES from "@/constant/message"

import useAppContext from "@/hook/context/useAppContext"

import TaskStatus from "@/type/domain/taskStatus"

import { useState } from "react"

import { AddCircleOutline } from "@mui/icons-material"
import { Box, TextField } from "@mui/material"

import TaskBoard from "./TasksBoard"
import RecurringPattern from "@/type/domain/recurringPattern"

const TasksPanel = () => {
  const { tasks, calendars, categories, addTask, updateTask, deleteTask } =
    useAppContext()

  const [newTitle, setNewTitle] = useState("")

  const handleCreate = async () => {
    if (!newTitle.trim()) return

    await addTask({
      name: newTitle,
      status: TaskStatus.TODO,
      recurringPattern: RecurringPattern.NONE,
      calendar: calendars[0] || null,
      category: categories[0] || null,
      startDate: "",
      endDate: ""
    })

    setNewTitle("")
  }

  const handleUpdate = async (updated: any) => {
    await updateTask(updated.id, updated)
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