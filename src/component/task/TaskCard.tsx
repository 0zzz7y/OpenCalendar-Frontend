import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Box, Card, Collapse, IconButton, MenuItem, TextField, Typography, Popover } from "@mui/material";
import { Delete as DeleteIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import CancelButton from "@/component/common/button/CancelButton";
import DeleteButton from "@/component/common/button/DeleteButton";

import type Calendar from "@/model/domain/calendar";
import type Category from "@/model/domain/category";
import type Task from "@/model/domain/task";
import RecurringPattern from "@/model/domain/recurringPattern";
import LABEL from "@/constant/ui/label";
import FILTER from "@/constant/utility/filter";
import MESSAGE from "@/constant/ui/message";

export interface TaskCardProps {
  task: Task;
  calendars: Calendar[];
  categories: Category[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * Card representing a single task, editable and collapsible.
 */
const TaskCard: React.FC<TaskCardProps> = ({ task, calendars, categories, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(true);
  const [local, setLocal] = useState<Task>(task || {
    id: "",
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    calendar: calendars[0],
    category: undefined,
    recurringPattern: RecurringPattern.NONE,
  });
  const [errors, setErrors] = useState({
    name: false,
    startDate: false,
    endDate: false,
    description: false,
  });
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(null); // Anchor for delete confirmation popover

  // Sync props -> state
  useEffect(() => {
    if (task) setLocal(task); // Sync props -> state
  }, [task]);

  const validateField = useCallback(
    (field: keyof Task, value: any) => {
      switch (field) {
        case "name":
          return !value.trim();
        case "startDate":
          return !value;
        case "endDate":
          return value ? dayjs(value).isBefore(dayjs(local.startDate)) : false;
        case "description":
          return value.length > 4096;
        default:
          return false;
      }
    },
    [local.startDate]
  );

  const handleChange = useCallback(
    <K extends keyof Task>(field: K, value: Task[K]) => {
      setLocal((prev) => {
        const updated = { ...prev, [field]: value };
        setErrors((prevErrors) => ({ ...prevErrors, [field]: validateField(field, value) })); // Validate the field
        return updated;
      });
    },
    [validateField]
  );

  const handleBlur = useCallback(() => {
    onUpdate(local); // Save the task when the user finishes interacting with a field
  }, [local, onUpdate]);

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    setDeleteAnchorEl(event.currentTarget); // Open the delete confirmation popover
  };

  const handleDeleteConfirm = () => {
    onDelete(local.id); // Confirm deletion
    setDeleteAnchorEl(null); // Close the popover
  };

  const handleDeleteCancel = () => {
    setDeleteAnchorEl(null); // Close the popover
  };

  const cardColor = local.category?.color ?? "#f5f5f5";

  const textFieldSx = {
    "& .MuiOutlinedInput-root": { backgroundColor: "#fff", borderRadius: 1 },
    "& .MuiInputBase-input": { color: "#000" },
    "& .MuiInputLabel-root": { color: "#000" },
    "& .MuiSelect-icon": { color: "#000" },
  };

  return (
    <Card
      sx={{
        backgroundColor: cardColor,
        p: 1.5,
        mb: 2,
        boxShadow: 3,
        borderRadius: 2,
        minWidth: 220,
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
            onBlur={handleBlur} // Save on blur
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
            onBlur={handleBlur} // Save on blur
            size="small"
            fullWidth
            multiline
            minRows={2}
            error={errors.description}
            helperText={errors.description ? MESSAGE.DESCRIPTION_TOO_LONG : ""}
            sx={textFieldSx}
          />

          <DateTimePicker
            label={LABEL.START_DATE}
            value={local.startDate ? dayjs(local.startDate).toDate() : null}
            onChange={(d) => d && handleChange("startDate", d.toISOString())}
            onClose={handleBlur} // Save when date selection is finished
            slotProps={{
              textField: {
                size: "small",
                sx: textFieldSx,
                error: errors.startDate,
                helperText: errors.startDate ? MESSAGE.FIELD_REQUIRED : "",
              },
            }}
          />

          <DateTimePicker
            label={LABEL.END_DATE}
            value={local.endDate ? dayjs(local.endDate).toDate() : null}
            onChange={(d) => d && handleChange("endDate", d.toISOString())}
            onClose={handleBlur} // Save when date selection is finished
            slotProps={{
              textField: {
                size: "small",
                sx: textFieldSx,
                error: errors.endDate,
                helperText: errors.endDate ? MESSAGE.END_DATE_BEFORE_START_DATE : "",
              },
            }}
          />

          {local.startDate && (
            <TextField
              label={LABEL.RECURRING}
              select
              value={local.recurringPattern}
              onChange={(e) => handleChange("recurringPattern", e.target.value as RecurringPattern)}
              onBlur={handleBlur} // Save on blur
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
              const cal = calendars.find((c) => c.id === e.target.value);
              cal && handleChange("calendar", cal);
            }}
            onBlur={handleBlur} // Save on blur
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
              const cat = categories.find((c) => c.id === e.target.value) || null;
              handleChange("category", cat ? { ...cat, color: cat.color } : undefined);
            }}
            onBlur={handleBlur} // Save on blur
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
                      bgcolor: cat.color,
                    }}
                  />
                  <Typography>{cat.name}</Typography>
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
  );
};

export default TaskCard;
