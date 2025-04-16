// src/components/task/TaskCard.tsx
import { Draggable } from "@hello-pangea/dnd"
import { Paper, Typography } from "@mui/material"
import { Task } from "@/models/task"
import { useCategories } from "@/hooks/useCategories"

interface Properties {
  task: Task
  index: number
}

const TaskCard = ({ task, index }: Properties) => {
  const { categories } = useCategories()
  const category = categories.find((cat) => cat.id === task.categoryId)

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 1.5,
            padding: 1.5,
            backgroundColor: "#fff",
            borderLeft: `4px solid ${category?.color || "#1976d2"}`,
          }}
        >
          <Typography fontWeight={600} variant="body2">
            {task.title}
          </Typography>

          {task.description && (
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          )}
        </Paper>
      )}
    </Draggable>
  )
}

export default TaskCard
