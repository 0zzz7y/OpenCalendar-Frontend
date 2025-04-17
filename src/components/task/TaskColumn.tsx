import { Droppable } from "@hello-pangea/dnd"
import { Box, Paper, Typography } from "@mui/material"
import TaskCard from "./TaskCard"
import { Task } from "@/types/task"
import { TaskStatus } from "@/types/taskStatus"

interface Properties {
  status: TaskStatus
  tasks: Task[]
}

const TaskColumn = ({ status, tasks }: Properties) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{ width: 240, padding: 2, backgroundColor: "#f9f9f9" }}
        >
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            {status.replace("_", " ")}
          </Typography>

          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}

          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  )
}

export default TaskColumn
