import {
  Box,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { RecurringPattern } from "../../types/shared";
import { CalendarDto } from "../../types/calendar";
import { CategoryDto } from "../../types/category";
import { TaskDto } from "../../types/task";

interface TaskCardProperties {
  task: TaskDto & { editing: boolean };
  calendars: CalendarDto[];
  categories: CategoryDto[];
  updateTask: (id: string, data: Partial<TaskDto & { editing?: boolean }>) => void;
  confirmDelete: (id: string) => void;
  dragIdRef: React.MutableRefObject<string | null>;
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setDraggingId: (id: string | null) => void;
  editingTitleId: string | null;
  setEditingTitleId: (id: string | null) => void;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
}

export default function TaskCard({
  task,
  calendars,
  categories,
  updateTask,
  confirmDelete,
  dragIdRef,
  timeoutRef,
  setDraggingId,
  editingTitleId,
  setEditingTitleId,
  editedTitle,
  setEditedTitle,
}: TaskCardProperties) {
  const getCategoryColor = (id: string | undefined) =>
    categories.find((c) => c.id === id)?.color || "#fffde7";

  const startDrag = (e: React.MouseEvent) => {
    timeoutRef.current = setTimeout(() => {
      dragIdRef.current = task.id;
      setDraggingId(task.id);
    }, 500);
  };

  const cancelDrag = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dragIdRef.current = null;
    setDraggingId(null);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const ignore = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "LI", "UL"];
    if (
      !ignore.includes(target.tagName) &&
      !target.closest("button") &&
      !target.closest("div[role='button']")
    ) {
      if (editingTitleId !== task.id) {
        updateTask(task.id, { editing: !task.editing });
      }
    }
  };

  const handleUpdateField = (field: keyof TaskDto, value: string) => {
    updateTask(task.id, { [field]: value });
  };

  return (
    <Paper
      key={task.id}
      draggable
      onMouseDown={startDrag}
      onMouseUp={cancelDrag}
      onMouseLeave={cancelDrag}
      onDragStart={(e) => {
        if (!dragIdRef.current) e.preventDefault();
      }}
      onClickCapture={handleClickCapture}
      sx={{
        p: 1,
        mb: 1,
        fontSize: "0.85rem",
        cursor: "move",
        boxShadow: dragIdRef.current === task.id ? "0 0 10px #2196f3" : "none",
        backgroundColor: task.categoryId ? getCategoryColor(task.categoryId) : "#fffde7",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {task.editing ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
          {editingTitleId === task.id ? (
            <TextField
              size="small"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              autoFocus
              sx={{ fontWeight: "bold", input: { fontWeight: "bold" } }}
            />
          ) : (
            <Typography fontWeight="bold">{task.name}</Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (editingTitleId === task.id) {
                updateTask(task.id, { name: editedTitle });
                setEditingTitleId(null);
              } else {
                setEditedTitle(task.name);
                setEditingTitleId(task.id);
                if (!task.editing) updateTask(task.id, { editing: true });
              }
            }}
          >
            {editingTitleId === task.id ? "✔️" : "✏️"}
          </IconButton>

          <IconButton size="small" onClick={() => confirmDelete(task.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={task.editing}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <TextField
            size="small"
            label="Opis"
            value={task.description || ""}
            onChange={(e) => handleUpdateField("description", e.target.value)}
            multiline
            rows={2}
          />

          <TextField
            size="small"
            label="Data"
            type="datetime-local"
            value={task.startDate || ""}
            onChange={(e) => handleUpdateField("startDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          {!!task.startDate && (
            <FormControl size="small" fullWidth>
              <InputLabel>Powtarzalność</InputLabel>
              <Select
                value={task.recurringPattern || RecurringPattern.NONE}
                onChange={(e: SelectChangeEvent) =>
                  updateTask(task.id, { recurringPattern: e.target.value as RecurringPattern })
                }
                label="Powtarzalność"
              >
                <MenuItem value="DAILY">Codziennie</MenuItem>
                <MenuItem value="WEEKLY">Co tydzień</MenuItem>
                <MenuItem value="MONTHLY">Co miesiąc</MenuItem>
                <MenuItem value="YEARLY">Co rok</MenuItem>
                <MenuItem value="NONE">Brak</MenuItem>
              </Select>
            </FormControl>
          )}

          <FormControl size="small" fullWidth>
            <InputLabel>Kalendarz</InputLabel>
            <Select
              value={task.calendarId || ""}
              onChange={(e) => handleUpdateField("calendarId", e.target.value)}
              label="Kalendarz"
            >
              {calendars.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Kategoria</InputLabel>
            <Select
              value={task.categoryId || ""}
              onChange={(e) => handleUpdateField("categoryId", e.target.value)}
              label="Kategoria"
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: task.categoryId === c.id ? "#fff" : c.color,
                      border: "1px solid #999",
                      mr: 1,
                    }}
                  />
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Paper>
  );
}
