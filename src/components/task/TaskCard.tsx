import {
  Typography,
  MenuItem,
  Box,
  InputAdornment,
  Card,
  IconButton,
  Collapse,
  TextField
} from "@mui/material";

import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import type Task from "../../types/task";
import type Calendar from "../../types/calendar";
import type Category from "../../types/category"

import { useState, useEffect } from "react";

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
  const [localTask, setLocalTask] = useState<Task>(task);

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  const currentCalendar = calendars.find((c) => c.id === localTask.calendarId);
  const currentCategory = categories.find((c) => c.id === localTask.categoryId);
  const cardColor = currentCategory?.color;

  const handleFieldChange = (field: keyof Task, value: any, submitImmediately = false) => {
    const updatedTask = { ...localTask, [field]: value };
    setLocalTask(updatedTask);
    if (submitImmediately) {
      onUpdate(updatedTask);
    }
  }

  const handleSubmit = () => {
    if (JSON.stringify(localTask) !== JSON.stringify(task)) {
      onUpdate(localTask);
    }
  };

  const handleBlurOrEnter = (e: React.KeyboardEvent | React.FocusEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    handleSubmit();
  };

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

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
  };

  return (
    <>
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
          <IconButton onClick={handleToggleExpand} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>

          <TextField
            placeholder="Tytuł"
            value={localTask.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleBlurOrEnter}
            size="small"
            variant="outlined"
            fullWidth
            sx={fieldStyle}
          />

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
              onBlur={handleSubmit}
              onKeyDown={handleBlurOrEnter}
              size="small"
              variant="outlined"
              fullWidth
              sx={fieldStyle}
            />

            <DateTimePicker
              value={localTask.startDate ? dayjs(localTask.startDate) : null}
              onChange={(newValue) =>
                handleFieldChange("startDate", newValue ? newValue.toISOString() : "")
              }
              onAccept={handleSubmit}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    ...fieldStyle,
                    "& .MuiSvgIcon-root": {
                      color: "#fff"
                    }
                  }
                }
              }}
            />

            <DateTimePicker
              value={localTask.endDate ? dayjs(localTask.endDate) : null}
              onChange={(newValue) =>
                handleFieldChange("endDate", newValue ? newValue.toISOString() : "")
              }
              onAccept={handleSubmit}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    ...fieldStyle,
                    "& .MuiSvgIcon-root": {
                      color: "#fff"
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
                onChange={(e) => {
                  handleFieldChange("recurringPattern", e.target.value);
                  handleSubmit();
                }}
                size="small"
                variant="outlined"
                fullWidth
                sx={fieldStyle}
              >
                <MenuItem value="NONE">Brak</MenuItem>
                <MenuItem value="DAILY">Codziennie</MenuItem>
                <MenuItem value="WEEKLY">Co tydzień</MenuItem>
                <MenuItem value="MONTHLY">Co miesiąc</MenuItem>
                <MenuItem value="YEARLY">Co rok</MenuItem>
              </TextField>
            )}

            <TextField
              placeholder="Calendar"
              select
              value={localTask.calendarId || ""}
              onChange={(e) => {
                handleFieldChange("calendarId", e.target.value);
                handleSubmit();
              }}
              size="small"
              variant="outlined"
              fullWidth
              sx={fieldStyle}
              InputProps={{
                startAdornment: currentCalendar && (
                  <InputAdornment position="start">
                    <Typography sx={{ ml: -0.5 }}>{currentCalendar.emoji}</Typography>
                  </InputAdornment>
                )
              }}
            >
              {calendars.map((cal) => (
                <MenuItem key={cal.id} value={cal.id}>
                  {cal.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              placeholder="Category"
              select
              value={localTask.categoryId || ""}
              onChange={(e) => {
                handleFieldChange("categoryId", e.target.value);
                handleSubmit();
              }}
              size="small"
              variant="outlined"
              fullWidth
              sx={fieldStyle}
              InputProps={{
                startAdornment: currentCategory && (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: currentCategory.color,
                        mr: 1
                      }}
                    />
                  </InputAdornment>
                )
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Collapse>
      </Card>
    </>
  );
};

export default TaskCard;
