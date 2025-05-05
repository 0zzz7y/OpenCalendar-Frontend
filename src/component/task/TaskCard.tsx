/**
 * Copyright (c) Tomasz Wnuk
 */

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Box, Card, Collapse, IconButton, MenuItem, TextField, Typography, Popover } from "@mui/material"
import { Delete as DeleteIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material"

import CancelButton from "@/component/common/button/CancelButton"
import DeleteButton from "@/component/common/button/DeleteButton"

import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"
import type Task from "@/model/domain/task"
import LABEL from "@/constant/ui/label"
import FILTER from "@/constant/utility/filter"
import MESSAGE from "@/constant/ui/message"
import TaskStatus from "@/model/domain/taskStatus"

export interface TaskCardProps {
  task: Task
  calendars: Calendar[]
  categories: Category[]
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, calendars, categories, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(true)
  const [local, setLocal] = useState<Task>({
    id: task?.id || "",
    title: task?.title || "",
    description: task?.description || "",
    calendar: task?.calendar || (calendars.length > 0 ? calendars.find((c) => c.id === task.calendar.id) : undefined),
    category: task?.category || undefined,
    status: task?.status || TaskStatus.TODO
  })
  const [errors, setErrors] = useState({
    name: false,
    startDate: false,
    endDate: false,
    description: false
  })
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null) // Anchor for delete confirmation popover
  useEffect(() => {
    if (task) setLocal(task)
  }, [task])

  const validateField = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (field: keyof Task, value: any) => {
      switch (field) {
        case "title":
          return !value.trim()
        case "description":
          return value.length > 4096
        default:
          return false
      }
    },
    []
  )

  const handleChange = useCallback(
    <K extends keyof Task>(field: K, value: Task[K]) => {
      setLocal((prev) => {
        const updated = { ...prev, [field]: value }
        setErrors((prevErrors) => ({ ...prevErrors, [field]: validateField(field, value) })) // Validate the field
        return updated
      })
    },
    [validateField]
  )

  const handleBlur = useCallback(() => {
    onUpdate(local)
  }, [local, onUpdate])

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    setDeleteAnchorEl(event.currentTarget)
  }

  const handleDeleteConfirm = () => {
    onDelete(local.id)
    setDeleteAnchorEl(null)
  }

  const handleDeleteCancel = () => {
    setDeleteAnchorEl(null)
  }

  const cardColor = local.category?.color ?? "#f5f5f5"

  const textFieldSx = {
    "& .MuiOutlinedInput-root": { backgroundColor: "#fff", borderRadius: 1 },
    "& .MuiInputBase-input": { color: "#000" },
    "& .MuiInputLabel-root": { color: "#000" },
    "& .MuiSelect-icon": { color: "#000" }
  }

  return (
    <Card
      sx={{
        backgroundColor: cardColor,
        p: 1.5,
        mb: 2,
        boxShadow: 3,
        borderRadius: 2,
        minWidth: 220
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box display="flex" alignItems="center" gap={1} flexGrow={1}>
          <IconButton size="small" onClick={() => setExpanded((e) => !e)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <TextField
            placeholder={LABEL.NAME}
            value={local.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={handleBlur}
            size="small"
            fullWidth
            error={errors.name}
            helperText={errors.name ? MESSAGE.FIELD_REQUIRED : ""}
            sx={textFieldSx}
          />
        </Box>
        <IconButton size="small" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            placeholder={LABEL.DESCRIPTION}
            value={local.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={handleBlur}
            size="small"
            fullWidth
            multiline
            minRows={2}
            error={errors.description}
            helperText={errors.description ? MESSAGE.DESCRIPTION_TOO_LONG : ""}
            sx={textFieldSx}
          />

          <TextField
            label={LABEL.CATEGORY}
            select
            value={local.category?.id || ""}
            onChange={(e) => {
              const cat = categories.find((c) => c.id === e.target.value) || null
              handleChange("category", cat ? { ...cat, color: cat.color } : undefined)
            }}
            onBlur={handleBlur}
            size="small"
            fullWidth
            sx={textFieldSx}
          >
            <MenuItem value="">{FILTER.NONE}</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: cat.color
                    }}
                  />
                  <Typography>{cat.title}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Collapse>

      {/* Delete Confirmation Popover */}
      <Popover
        open={Boolean(deleteAnchorEl)}
        anchorEl={deleteAnchorEl}
        onClose={handleDeleteCancel}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{ sx: { p: 2 } }}
      >
        <Typography variant="body2" gutterBottom>
          {MESSAGE.CONFIRM_DELETE_TASK}
        </Typography>
        <Box display="flex" gap={1} justifyContent="flex-end">
          <CancelButton onClick={handleDeleteCancel} />
          <DeleteButton onClick={handleDeleteConfirm} />
        </Box>
      </Popover>
    </Card>
  )
}

export default TaskCard
