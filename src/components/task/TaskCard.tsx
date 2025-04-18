import {
  Typography,
  MenuItem,
  Box,
  InputAdornment,
  Card,
  IconButton,
  Collapse,
  TextField,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";

import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import type Task from "../../types/task";
import type Calendar from "../../types/calendar";
import type Category from "../../types/category";
import { useState } from "react";

interface Properties {
  task: Task;
  calendars: Calendar[];
  categories: Category[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard = ({
  task,
  calendars,
  categories,
  onUpdate,
  onDelete
}: Properties) => {
  const [expanded, setExpanded] = useState(true);

  const handleChange = (field: keyof Task, value: any) => {
    onUpdate({ ...task, [field]: value });
  };

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const currentCategory = categories.find((c) => c.id === task.categoryId);
  const currentCalendar = calendars.find((c) => c.id === task.calendarId);

  const cardColor =
    task.status === "DONE"
      ? "#A5D6A7"
      : task.status === "IN_PROGRESS"
        ? "#FFF59D"
        : "#FFF59D";

  const borderColor = currentCategory?.color || "#FFF176";

  return (
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

          <DateTimePicker
            label="Start Date"
            value={task.startDate ? dayjs(task.startDate) : null}
            onChange={(newValue) =>
              handleChange("startDate", newValue ? newValue.toISOString() : "")
            }
            slotProps={{
              textField: {
                variant: "outlined",
                size: "small"
              }
            }}
          />

          <DateTimePicker
            label="End Date"
            value={task.endDate ? dayjs(task.endDate) : null}
            onChange={(newValue) =>
              handleChange("endDate", newValue ? newValue.toISOString() : "")
            }
            slotProps={{
              textField: {
                variant: "outlined",
                size: "small"
              }
            }}
          />

          {task.startDate && (
            <TextField
              select
              variant="outlined"
              value={task.recurringPattern || "NONE"}
              onChange={(e) => handleChange("recurringPattern", e.target.value)}
              label="Repetition"
              size="small"
            >
              <MenuItem value="NONE">None</MenuItem>
              <MenuItem value="DAILY">Daily</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="YEARLY">Yearly</MenuItem>
            </TextField>
          )}

          <TextField
            select
            label="Calendar"
            value={task.calendarId || ""}
            onChange={(e) => handleChange("calendarId", e.target.value)}
            variant="outlined"
            size="small"
          >
          {calendars.map((cal) => (
              <MenuItem key={cal.id} value={cal.id}>
                {cal.emoji} {cal.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Category"
            value={task.categoryId || ""}
            onChange={(e) => handleChange("categoryId", e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: currentCategory && (
                <InputAdornment position="start">
                  <Typography sx={{ pr: 1, fontSize: 20 }}>
                    {currentCategory.name}
                  </Typography>
                </InputAdornment>
              )
            }}
          >
          </TextField>
        </Box>
      </Collapse>
    </Card>
  );
};

export default TaskCard;
