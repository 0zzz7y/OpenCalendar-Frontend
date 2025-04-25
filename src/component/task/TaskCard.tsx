import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Box, Card, Collapse, IconButton, MenuItem, TextField, Typography } from "@mui/material"
import { Delete as DeleteIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import dayjs from "dayjs"

import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"
import type Task from "@/model/domain/task"
import RecurringPattern from "@/model/domain/recurringPattern"
import LABEL from "@/constant/ui/label"
import FILTER from "@/constant/utility/filter"

export interface TaskCardProps {
  task: Task
  calendars: Calendar[]
  categories: Category[]
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

/**
 * Card representing a single task, editable and collapsible.
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, calendars, categories, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(true)
  const [local, setLocal] = useState<Task>(task)

  // Sync props -> state
  useEffect(() => setLocal(task), [task])

  const handleChange = useCallback(
    <K extends keyof Task>(field: K, value: Task[K]) => {
      const updated = { ...local, [field]: value } as Task
      setLocal(updated)
      onUpdate(updated)
    },
    [local, onUpdate]
  )

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
            value={local.name}
            onChange={(e) => handleChange("name", e.target.value)}
            size="small"
            fullWidth
            sx={textFieldSx}
          />
        </Box>
        <IconButton size="small" onClick={() => onDelete(local.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            placeholder={LABEL.DESCRIPTION}
            value={local.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={2}
            sx={textFieldSx}
          />

          <DateTimePicker
            label={LABEL.START_DATE}
            value={local.startDate ? dayjs(local.startDate).toDate() : null}
            onChange={(d) => d && handleChange("startDate", d.toISOString())}
            slotProps={{ textField: { size: "small", sx: textFieldSx } }}
          />

          <DateTimePicker
            label={LABEL.END_DATE}
            value={local.endDate ? dayjs(local.endDate).toDate() : null}
            onChange={(d) => d && handleChange("endDate", d.toISOString())}
            slotProps={{ textField: { size: "small", sx: textFieldSx } }}
          />

          {local.startDate && (
            <TextField
              label={LABEL.RECURRING}
              select
              value={local.recurringPattern}
              onChange={(e) => handleChange("recurringPattern", e.target.value as RecurringPattern)}
              size="small"
              fullWidth
              sx={textFieldSx}
            >
              {Object.values(RecurringPattern).map((pattern) => (
                <MenuItem key={pattern} value={pattern}>
                  {pattern}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label={LABEL.CALENDAR}
            select
            value={local.calendar.id}
            onChange={(e) => {
              const cal = calendars.find((c) => c.id === e.target.value)
              cal && handleChange("calendar", cal)
            }}
            size="small"
            fullWidth
            sx={textFieldSx}
          >
            {calendars.map((cal) => (
              <MenuItem key={cal.id} value={cal.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>{cal.emoji}</Typography>
                  <Typography>{cal.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={LABEL.CATEGORY}
            select
            value={local.category?.id || ""}
            onChange={(e) => {
              const cat = categories.find((c) => c.id === e.target.value) || null
              handleChange("category", cat ? { ...cat, color: cat.color } : undefined)
            }}
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
