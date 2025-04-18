import { useState } from "react";

import { Box, TextField } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

import TaskBoard from "./TasksBoard";

import Task from "../../types/task";
import Calendar from "../../types/calendar";
import Category from "../../types/category";
import TaskStatus from "../../types/taskStatus";

const mockCalendar: Calendar = {
  id: "1",
  name: "Osobisty",
  emoji: "🟡",
};

const mockCategory: Category = {
  id: "1",
  name: "Osobisty",
  color: "#fff176"
};

const initialTasks: Task[] = [
  {
    id: "1",
    name: "Zrobić zakupy",
    status: "TODO",
    calendarId: "1",
    categoryId: "1",
    startDate: "",
    endDate: ""
  },
  {
    id: "2",
    name: "Wyjść z psem na spacer",
    status: "IN_PROGRESS",
    calendarId: "1",
    categoryId: "1",
    startDate: "2025-06-25T14:00",
    endDate: ""
  },
  {
    id: "3",
    name: "Nauczyć się na kolokwium",
    status: "DONE",
    calendarId: "1",
    categoryId: "1",
    startDate: "",
    endDate: ""
  },
  {
    id: "4",
    name: "Spotkanie zespołu",
    status: "DONE",
    calendarId: "1",
    categoryId: "1",
    startDate: "",
    endDate: ""
  }
];

const TasksPanel = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");

  const handleCreate = () => {
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      name: newTitle,
      status: "TODO",
      calendarId: mockCalendar.id,
      categoryId: mockCategory.id,
      startDate: "",
      endDate: ""
    };

    setTasks([...tasks, newTask]);
    setNewTitle("");
  };

  const handleUpdate = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const order: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
        const current = order.indexOf(t.status);
        const next = (current + 1) % order.length;

        return { ...t, status: order[next] };
      })
    );
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          maxHeight: "100vh",
          overflowY: "auto",
          boxSizing: "border-box",
          height: "100vh"
        }}
      >
        <TextField
          label="Nowe zadanie"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          InputProps={{
            endAdornment: (
              <AddCircleOutline
                sx={{ cursor: "pointer" }}
                onClick={handleCreate}
              />
            )
          }}
          sx={{ mb: 2, width: 300 }}
        />

        <TaskBoard
          tasks={tasks}
          calendars={[mockCalendar]}
          categories={[mockCategory]}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </Box>
    </>
  );
};

export default TasksPanel;
