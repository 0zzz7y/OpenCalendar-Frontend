// src/components/task/TasksPanel.tsx
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { Box } from "@mui/material"
import TaskColumn from "./TaskColumn"
import { useTasks } from "@/hooks/useTasks"
import { TaskStatus } from "@/models/taskStatus"

const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"]

const TasksPanel = () => {
  const { tasks, setTasks } = useTasks()

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const task = tasks.find((t) => t.id === result.draggableId)
    if (!task || task.status === destination.droppableId) return

    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, status: destination.droppableId as TaskStatus } : t
    )

    setTasks(updated)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box display="flex" gap={2} overflow="auto" height="100%">
        {statuses.map((status) => (
          <TaskColumn key={status} status={status} tasks={tasks.filter((t) => t.status === status)} />
        ))}
      </Box>
    </DragDropContext>
  )
}

export default TasksPanel
