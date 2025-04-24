import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"
import type Task from "@/model/domain/task"
import RecurringPattern from "@/model/domain/recurringPattern"

import { useEffect, useState } from "react"

import {
  Delete,
  ExpandLess,
  ExpandMore
} from "@mui/icons-material"
import {
  Box,
  Card,
  Collapse,
  IconButton,
  MenuItem,
  TextField,
  Typography
} from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import dayjs from "dayjs"

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

  const currentCategory = localTask.category
  const cardColor = currentCategory?.color || "#f5f5f5"

  const handleFieldChange = (field: keyof Task, value: any) => {
    const updatedTask = { ...localTask, [field]: value }
    setLocalTask(updatedTask)
    onUpdate?.(updatedTask)
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
          <IconButton onClick={() => setExpanded((prev) => !prev)} size="small">
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
            placeholder="Opis"
            value={localTask.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
            multiline
            minRows={2}
            sx={fieldStyle}
          />

          <DateTimePicker
            label="Start"
            value={localTask.startDate ? dayjs(localTask.startDate).toDate() : null}
            onChange={(date) =>
              handleFieldChange("startDate", date ? date.toISOString() : "")
            }
            slotProps={{
              textField: { size: "small", sx: fieldStyle }
            }}
          />

          <DateTimePicker
            label="End"
            value={localTask.endDate ? dayjs(localTask.endDate).toDate() : null}
            onChange={(date) =>
              handleFieldChange("endDate", date ? date.toISOString() : "")
            }
            slotProps={{
              textField: { size: "small", sx: fieldStyle }
            }}
          />

          {localTask.startDate && (
            <TextField
              label="Powtarzalność"
              select
              value={localTask.recurringPattern || "NONE"}
              onChange={(e) => handleFieldChange("recurringPattern", e.target.value)}
              size="small"
              variant="outlined"
              fullWidth
              sx={fieldStyle}
            >
              {Object.entries(RecurringPattern).map(([key, val]) => (
                <MenuItem key={key} value={val}>
                  {val}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Kalendarz"
            select
            value={localTask.calendar?.id || ""}
            onChange={(e) =>
              handleFieldChange(
                "calendar",
                calendars.find((c) => c.id === e.target.value) || null
              )
            }
            size="small"
            variant="outlined"
            fullWidth
            sx={fieldStyle}
          >
            {calendars.map((cal) => (
              <MenuItem key={cal.id} value={cal.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={{ minWidth: 24 }}>{cal.emoji}</Typography>
                  <Typography>{cal.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Kategoria"
            select
            value={localTask.category?.id || ""}
            onChange={(e) =>
              handleFieldChange(
                "category",
                categories.find((c) => c.id === e.target.value) || null
              )
            }
            size="small"
            variant="outlined"
            fullWidth
            sx={fieldStyle}
          >
            <MenuItem value="">Brak</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: cat.color
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
