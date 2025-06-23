import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Box, Card, Collapse, IconButton, MenuItem, TextField, Typography, Popover, Menu } from "@mui/material"
import { Delete as DeleteIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material"

import { CancelButton } from "../library/button/CancelButton"
import { DeleteButton } from "../library/button/DeleteButton"

import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"
import type { Task } from "@/features/task/task.model"
import { LABEL } from "../shared/label.constant"
import { Filter } from "@/features/filter/filter.type"
import { MESSAGE } from "../shared/message.constant"
import { TaskStatus } from "@/features/task/taskStatus.type"

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
    name: task?.name || "",
    description: task?.description || "",
    calendar: task?.calendar || calendars[0],
    category: task?.category || undefined,
    status: task?.status || TaskStatus.TODO
  })

  const [errors, setErrors] = useState({
    name: false,
    description: false
  })

  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null)
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(null)
  const [calendarAnchorEl, setCalendarAnchorEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (task) setLocal(task)
  }, [task])

  const validateField = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (field: keyof Task, value: any) => {
      switch (field) {
        case "name":
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
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: validateField(field, value)
        }))
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

  const handleCategoryMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setCategoryAnchorEl(e.currentTarget)
  }

  const handleCategoryMenuClose = () => {
    setCategoryAnchorEl(null)
  }

  const handleCategorySelect = (categoryId: string | null) => {
    const selectedCategory = categories.find((c) => c.id === categoryId) || undefined
    handleChange("category", selectedCategory)
    handleBlur()
    handleCategoryMenuClose()
  }

  const handleCalendarMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setCalendarAnchorEl(e.currentTarget)
  }

  const handleCalendarMenuClose = () => {
    setCalendarAnchorEl(null)
  }

  const handleCalendarSelect = (calendarId: string) => {
    const selectedCalendar = calendars.find((c) => c.id === calendarId)
    if (selectedCalendar) {
      handleChange("calendar", selectedCalendar)
      handleBlur()
    }
    handleCalendarMenuClose()
  }

  const selectedCategoryColor = local.category?.color || "#fff"
  const currentCalendar = local.calendar

  const cardColor = selectedCategoryColor ?? "#f5f5f5"

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

          {/* Task Name */}
          <TextField
            placeholder={LABEL.NAME}
            value={local.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={handleBlur}
            size="small"
            fullWidth
            error={errors.name}
            helperText={errors.name ? MESSAGE.FIELD_REQUIRED : ""}
            sx={textFieldSx}
          />

          {/* Category Selector */}
          <IconButton size="small" onClick={handleCategoryMenuOpen} sx={{ color: "#000" }}>
            <Box width={14} height={14} borderRadius="50%" bgcolor={selectedCategoryColor} border="1px solid #333" />
          </IconButton>
          <Menu anchorEl={categoryAnchorEl} open={Boolean(categoryAnchorEl)} onClose={handleCategoryMenuClose}>
            <MenuItem onClick={() => handleCategorySelect(null)} sx={{ color: "#000" }}>
              {Filter.ALL}
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} onClick={() => handleCategorySelect(category.id)} sx={{ color: "#000" }}>
                <Box
                  width={14}
                  height={14}
                  borderRadius="50%"
                  bgcolor={category.color}
                  border="1px solid #333"
                  mr={1}
                />
                {category.name}
              </MenuItem>
            ))}
          </Menu>

          {/* Calendar Selector */}
          <IconButton size="small" onClick={handleCalendarMenuOpen} sx={{ color: "#000" }}>
            <Typography fontSize="18px" sx={{ color: "#000" }}>
              {currentCalendar?.emoji || "📅"}
            </Typography>
          </IconButton>
          <Menu anchorEl={calendarAnchorEl} open={Boolean(calendarAnchorEl)} onClose={handleCalendarMenuClose}>
            {calendars.map((calendar) => (
              <MenuItem key={calendar.id} onClick={() => handleCalendarSelect(calendar.id)} sx={{ color: "#000" }}>
                <Typography fontSize="18px" mr={1} sx={{ color: "#000" }}>
                  {calendar.emoji}
                </Typography>
                {calendar.name}
              </MenuItem>
            ))}
          </Menu>
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
        </Box>
      </Collapse>

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
