export {};
import {
  Box, Button, IconButton, InputLabel, MenuItem, Paper,
  Select, TextField, Typography, FormControl, Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface Task {
  id: string;
  title: string;
  description?: string;
  date?: string;
  repeat?: string;
  calendarId?: string;
  categoryId?: string;
  status: TaskStatus;
  editing: boolean;
}

const calendars = [
  { id: "1", name: "Osobisty" },
  { id: "2", name: "Praca" },
  { id: "3", name: "Studia" }
];

const categories = [
  { id: "a", name: "Siłownia", color: "#f44336" },
  { id: "b", name: "Ogród", color: "#4caf50" },
  { id: "c", name: "Dom", color: "#2196f3" }
];

const getCategoryColor = (categoryId: string | undefined) =>
  categories.find((c) => c.id === categoryId)?.color || "#fffde7";

export default function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [hoveredStatus, setHoveredStatus] = useState<TaskStatus | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragIdRef = useRef<string | null>(null);

  const addTask = () => {
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: uuidv4(),
      title: newTitle.trim(),
      status: "TODO",
      editing: true
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTitle("");
  };

  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToDelete(id);
  };

  const deleteConfirmed = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete));
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => setTaskToDelete(null);

  const startDrag = (id: string, e: React.MouseEvent) => {
    timeoutRef.current = setTimeout(() => {
      dragIdRef.current = id;
      setDraggingId(id);
    }, 500);
  };

  const cancelDrag = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dragIdRef.current = null;
    setDraggingId(null);
  };

  const handleDrop = (status: TaskStatus) => {
    if (dragIdRef.current) {
      updateTask(dragIdRef.current, { status });
      dragIdRef.current = null;
      setDraggingId(null);
    }
  };

  const renderColumn = (status: TaskStatus, label: string) => (
    <Box
      sx={{
        flex: 1,
        minWidth: 250,
        p: 1,
        border: "2px dashed",
        borderColor: hoveredStatus === status ? "#2196f3" : "#ccc",
        borderRadius: 2,
        backgroundColor: hoveredStatus === status ? "#e3f2fd" : "#f5f5f5",
        minHeight: 300
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setHoveredStatus(status)}
      onDragLeave={() => setHoveredStatus(null)}
      onDrop={() => {
        handleDrop(status);
        setHoveredStatus(null);
      }}
    >
      <Typography variant="subtitle1" textAlign="center" fontWeight="bold" mb={1}>
        {label}
      </Typography>

      {tasks
        .filter((t) => t.status === status)
        .map((task) => (
          <Paper
            key={task.id}
            draggable
            onMouseDown={(e) => startDrag(task.id, e)}
            onMouseUp={cancelDrag}
            onMouseLeave={cancelDrag}
            onDragStart={(e) => {
              if (!dragIdRef.current) e.preventDefault();
            }}
            onClickCapture={(e) => {
              const target = e.target as HTMLElement;
              const interactiveElements = ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "LI", "UL"];

              if (editingTitleId === task.id) return;

              if (
                !interactiveElements.includes(target.tagName) &&
                !target.closest("button") &&
                !target.closest("div[role='button']") &&
                !target.closest(".MuiPopover-root") &&
                !target.closest(".MuiMenu-paper")
              ) {
                updateTask(task.id, { editing: !task.editing });
              }
            }}
            
            sx={{
              p: 1,
              mb: 1,
              fontSize: "0.85rem",
              cursor: "move",
              boxShadow: draggingId === task.id ? "0 0 10px #2196f3" : "none",
              backgroundColor: task.categoryId ? getCategoryColor(task.categoryId) : "#fffde7"

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
  <Typography fontWeight="bold">{task.title}</Typography>
)}

  </Box>
  <Box sx={{ display: "flex", gap: 0.5 }}>
  <IconButton
  size="small"
  onClick={(e) => {
    e.stopPropagation();

    if (editingTitleId === task.id) {
      // kończymy edycję tytułu
      updateTask(task.id, { title: editedTitle });
      setEditingTitleId(null);
    } else {
      // zaczynamy edycję tytułu
      setEditedTitle(task.title);
      setEditingTitleId(task.id);

      // dodatkowo otwieramy panel opisu, jeśli nieotwarty
      if (!task.editing) updateTask(task.id, { editing: true });
    }
  }}
>
  {editingTitleId === task.id ? "✔️" : "✏️"}
</IconButton>



    <IconButton size="small" onClick={(e) => confirmDelete(task.id, e)}>
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
                  onChange={(e) =>
                    updateTask(task.id, { description: e.target.value })
                  }
                  multiline rows={2}
                />
                <TextField
                  size="small"
                  label="Data"
                  type="datetime-local"
                  value={task.date || ""}
                  onChange={(e) => updateTask(task.id, { date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                {!!task.date && (
                  <FormControl size="small" fullWidth>
                    <InputLabel>Powtarzalność</InputLabel>
                    <Select
                      value={task.repeat || ""}
                      onChange={(e) => updateTask(task.id, { repeat: e.target.value })}
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
                    onChange={(e) =>
                      updateTask(task.id, { calendarId: e.target.value })
                    }
                    label="Kalendarz"
                  >
                    {calendars.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                <InputLabel>Kategoria</InputLabel>
                <Select
                  value={task.categoryId || ""}
                  onChange={(e) =>
                    updateTask(task.id, { categoryId: e.target.value })
                  }
                  label="Kategoria"
                >
                  {categories.map((c) => (
                    <MenuItem
                    key={c.id}
                    value={c.id}
                    selected={task.categoryId === c.id}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
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
        ))}
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField size="small" label="Tytuł zadania" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} fullWidth />
        <Button variant="contained" onClick={addTask}>Dodaj</Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        {renderColumn("TODO", "📝 Do zrobienia")}
        {renderColumn("IN_PROGRESS", "⏳ W trakcie")}
        {renderColumn("DONE", "✅ Zrobione")}
      </Box>

      <Dialog open={!!taskToDelete} onClose={cancelDelete}>
        <DialogTitle>Potwierdzenie</DialogTitle>
        <DialogContent>Czy na pewno chcesz usunąć to zadanie?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Anuluj</Button>
          <Button color="error" onClick={deleteConfirmed}>Usuń</Button>
        </DialogActions>
      </Dialog>

      
    </Box>
  );
}
