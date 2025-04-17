  Typography,
  MenuItem,
  Box,
  InputAdornment
} from "@mui/material"

import {
  Delete,
  ExpandLess,
  ExpandMore
} from "@mui/icons-material"

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import dayjs from "dayjs"

import type Task from "../../types/task"
import type Calendar from "../../types/calendar"
import type Category from "../../types/category"
import type RecurringPattern from "../../types/recurringPattern"

interface Properties {
  task: Task
  calendar?: Calendar
  category?: Category
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

const TaskCard = ({ task, calendar, category, onUpdate, onDelete }: Properties) => {
  const [expanded, setExpanded] = useState(true)

  const handleChange = (field: keyof Task, value: any) => {
    onUpdate({ ...task, [field]: value })
  }

  const handleToggleExpand = () => {
    setExpanded(prev => !prev)
  }

  const cardColor = task.status === "DONE"
    ? "#A5D6A7"
    : task.status === "IN_PROGRESS"
    ? "#FFF59D"
    : "#FFF59D"

  const borderColor = category?.color || "#FFF176"

  const parsedDate =
  task.startDate && !isNaN(Date.parse(task.startDate))
    ? new Date(task.startDate)
    : null

  return (
    <>
      <Card
        sx={{
          backgroundColor: cardColor,
          border: `2px solid ${borderColor}`,
          p: 1,
          mb: 2,
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={handleToggleExpand}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>

          <TextField
            variant="outlined"
            value={task.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Title"
            fullWidth
            size="small"
          />

          <IconButton onClick={() => onDelete(task.id)}>
            <Delete />
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              variant="outlined"
              value={task.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Description"
              fullWidth
              size="small"
            />

{/* <DateTimePicker
  label="Date"
  value={parsedDate}
  onChange={(newValue: Date | null) =>
    handleChange("startDate", newValue ? newValue.toISOString() : "")
  }
  slotProps={{
    textField: {
      variant: "outlined",
      size: "small"
    }
  }}
/> */}



            {task.startDate && (
              <>
                <TextField
                  select
                  variant="outlined"
                  value={task.recurringPattern || "NONE"}
                  onChange={(e) => handleChange("recurringPattern", e.target.value as RecurringPattern)}
                  label="Repetition"
                  size="small"
                >
                  <MenuItem value="NONE">None</MenuItem>
                  <MenuItem value="DAILY">Daily</MenuItem>
                  <MenuItem value="WEEKLY">Weekly</MenuItem>
                  <MenuItem value="MONTHLY">Monthly</MenuItem>
                </TextField>
              </>
            )}

            <TextField
              variant="outlined"
              value={calendar?.name || ""}
              placeholder="Calendar"
              fullWidth
              size="small"
              disabled
            />

            <TextField
              variant="outlined"
              value={category?.name || ""}
              placeholder="Category"
              fullWidth
              size="small"
              disabled
              slotProps={{
                input: {
                  startAdornment: category && (
                    <InputAdornment position="start">
                      <Typography sx={{ pr: 1, fontSize: 20 }}>
                        {category.emoji}
                      </Typography>
                    </InputAdornment>
                  )
                }
              }}
            />
          </Box>
        </Collapse>
      </Card>
    </>
  )
}

export default TaskCard
