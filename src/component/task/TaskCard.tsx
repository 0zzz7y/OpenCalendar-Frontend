import { useEffect, useState } from "react"

import {
  Typography,
  MenuItem,
  Box,
  IconButton,
  Collapse,
  TextField,
  Card
} from "@mui/material"

import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material"

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"

import dayjs from "dayjs"

import type Task from "@/type/domain/task"
import type Calendar from "@/type/domain/calendar"
import type Category from "@/type/domain/category"
import RecurringPattern from "@/type/domain/recurringPattern"

interface Properties {
  task: Task
  calendars: Calendar[]
  categories: Category[]
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

const TaskCard = ({
  task,
  calendars,
  categories,
  onUpdate,
  onDelete
}: Properties) => {
  const [expanded, setExpanded] = useState(true)
  const [localTask, setLocalTask] = useState<Task>(task)

  useEffect(() => {
    setLocalTask(task)
  }, [task])

  const currentCalendar = calendars.find((c) => c.id === localTask.calendarId)
  const currentCategory = categories.find((c) => c.id === localTask.categoryId)
  const cardColor = currentCategory?.color

  const handleFieldChange = (field: keyof Task, value: any) => {
    const updatedTask = { ...localTask, [field]: value }
    setLocalTask(updatedTask)
    onUpdate(updatedTask)
  }

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      borderRadius: 1,
      color: "#000"
    },
    "& .MuiInputBase-input": {
      color: "#000"
    },
    "& .MuiInputLabel-root": {
      color: "#000"
    },
    "& .MuiSelect-icon": {
      color: "#000"
    }
  }

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev)
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleToggleExpand} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <TextField
            placeholder="Tytuł"
            value={localTask.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
            sx={fieldStyle}
          />
        </Box>

        <IconButton onClick={() => onDelete(task.id)} size="small">
          <Delete />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            placeholder="Description"
            value={localTask.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            sx={fieldStyle}
          />

          <DateTimePicker
            value={localTask.startDate ? dayjs(localTask.startDate).toDate() : null}
            onChange={(newValue) =>
              handleFieldChange(
                "startDate",
                newValue ? newValue.toISOString() : ""
              )
            }
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  ...fieldStyle,
                  "& .MuiSvgIcon-root": {
                    color: "#000"
                  }
                }
              }
            }}
          />

          <DateTimePicker
            value={localTask.endDate ? dayjs(localTask.endDate).toDate() : null}
            onChange={(newValue) =>
              handleFieldChange(
                "endDate",
                newValue ? newValue.toISOString() : ""
              )
            }
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  ...fieldStyle,
                  "& .MuiSvgIcon-root": {
                    color: "#000"
                  }
                }
              }
            }}
          />

          {localTask.startDate && (
            <TextField
              placeholder="Recurring"
              select
              value={localTask.recurringPattern || "NONE"}
              onChange={(e) =>
                handleFieldChange("recurringPattern", e.target.value)
              }
              size="small"
              variant="outlined"
              fullWidth
              sx={fieldStyle}
            >
              <MenuItem value="NONE">{RecurringPattern.NONE}</MenuItem>
              <MenuItem value="DAILY">{RecurringPattern.DAILY}</MenuItem>
              <MenuItem value="WEEKLY">{RecurringPattern.WEEKLY}</MenuItem>
              <MenuItem value="MONTHLY">{RecurringPattern.MONTHLY}</MenuItem>
              <MenuItem value="YEARLY">{RecurringPattern.YEARLY}</MenuItem>
            </TextField>
          )}

          <TextField
            placeholder="Calendar"
            select
            value={localTask.calendarId || ""}
            onChange={(e) => handleFieldChange("calendarId", e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
            sx={fieldStyle}
          >
            {calendars.map((cal) => (
              <MenuItem key={cal.id} value={cal.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    sx={{ textAlign: "center", minWidth: 24, mt: -0.5 }}
                  >
                    {cal.emoji}
                  </Typography>
                  <Typography>{cal.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            placeholder="Category"
            select
            value={localTask.categoryId || ""}
            onChange={(e) => handleFieldChange("categoryId", e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
            sx={fieldStyle}
          >
            <MenuItem value="">
              <Typography>None</Typography>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: cat.color,
                      mt: -0.5
                    }}
                  />
                  <Typography>{cat.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Collapse>
    </Card>
  )
}

export default TaskCard
