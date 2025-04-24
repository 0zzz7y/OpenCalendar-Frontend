import MESSAGES from "@/constant/ui/messages";
import useTask from "@/repository/task.repository";
import RecurringPattern from "@/model/domain/recurringPattern";
import Task from "@/model/domain/task";
import TaskStatus from "@/model/domain/taskStatus";

import { useState } from "react";

import { AddCircleOutline } from "@mui/icons-material";
import { Box, TextField } from "@mui/material";

import TaskBoard from "./TasksBoard";
import useAppStore from "@/store/useAppStore";

const TasksPanel = () => {
  const { tasks, categories, calendars } = useAppStore();
  const { addTask, updateTask, deleteTask, reloadTasks } = useTask();

  const [newTitle, setNewTitle] = useState("");

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    const defaultCalendar = calendars[0] || null;
    const defaultCategory = categories[0] || null;

    const newTask: Partial<Task> = {
      name: newTitle,
      description: "",
      calendar: defaultCalendar,
      category: defaultCategory,
      status: TaskStatus.TODO,
      recurringPattern: RecurringPattern.NONE,
      startDate: "",
      endDate: "",
    };

    await addTask(newTask);
    await reloadTasks();

    setNewTitle("");
  };

  const handleUpdate = async (updated: Task) => {
    await updateTask(updated.id, updated);
    await reloadTasks();
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    await reloadTasks();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        p: 2,
        boxSizing: "border-box",
      }}
    >
      <TextField
        label={MESSAGES.NEW_TASK}
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        fullWidth
        InputProps={{
          endAdornment: (
            <AddCircleOutline
              sx={{ cursor: "pointer" }}
              onClick={handleCreate}
            />
          ),
        }}
        sx={{ marginBottom: 2 }}
      />

      <Box sx={{ flex: 1 }}>
        <TaskBoard
          tasks={tasks}
          calendars={calendars}
          categories={categories}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </Box>
    </Box>
  );
};

export default TasksPanel;
