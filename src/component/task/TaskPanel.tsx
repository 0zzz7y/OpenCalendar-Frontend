import React, { useState, useCallback, useMemo } from "react"
import { Box, TextField, InputAdornment } from "@mui/material"
import { AddCircleOutline } from "@mui/icons-material"

import useTask from "@/repository/task.repository"
import useApplicationStorage from "@/storage/useApplicationStorage"
import TaskBoard from "./TaskBoard"
import RecurringPattern from "@/model/domain/recurringPattern"
import type Task from "@/model/domain/task"
import TaskStatus from "@/model/domain/taskStatus"
import MESSAGE from "@/constant/ui/message"

/**
 * Panel for creating new tasks and displaying them in a board.
 */
export default function TasksPanel() {
  const { tasks, categories, calendars } = useApplicationStorage()
  const { addTask, updateTask, deleteTask, reloadTasks } = useTask()

  const [newTitle, setNewTitle] = useState("")

  const defaultCalendar = useMemo(() => calendars[0] || null, [calendars])
  const defaultCategory = useMemo(() => categories.findLast || null, [categories])

  const handleCreate = useCallback(async () => {
    const title = newTitle.trim()
    if (!title || !defaultCalendar) return

    const payload: Omit<Task, "id"> = {
      name: title,
      description: "",
      calendar: defaultCalendar,
      category: defaultCategory,
      status: TaskStatus.TODO,
      recurringPattern: RecurringPattern.NONE,
      startDate: "",
      endDate: ""
    }

    await addTask(payload)
    await reloadTasks()
    setNewTitle("")
  }, [newTitle, defaultCalendar, defaultCategory, addTask, reloadTasks])

  const handleUpdate = useCallback(
    async (updated: Task) => {
      await updateTask(updated)
      await reloadTasks()
    },
    [updateTask, reloadTasks]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteTask(id)
      await reloadTasks()
    },
    [deleteTask, reloadTasks]
  )

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
        label={MESSAGE.NEW_TASK}
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <AddCircleOutline sx={{ cursor: "pointer" }} onClick={handleCreate} />
            </InputAdornment>
          )
        }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ flex: 1 }}>
        <TaskBoard
          tasks={tasks}
          calendars={calendars}
          categories={categories}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </Box>
    </Box>
  )
}
