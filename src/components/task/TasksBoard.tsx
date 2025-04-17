import { Box } from "@mui/material"

import TaskColumn from "./TaskColumn"
import TaskCard from "./TaskCard"

import Task from "../../types/task"
import Calendar  from "../../types/calendar"
import Category  from "../../types/category"
import TaskStatus from "../../types/taskStatus"

import { HourglassEmpty, Done, Pending } from "@mui/icons-material"
import { JSX } from "react"

interface Properties {
  tasks: Task[]
  calendar?: Calendar
  category?: Category
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

const TaskBoard = ({ tasks, calendar, category, onUpdate, onDelete, onToggleStatus }: Properties) => {
  const renderColumn = (status: TaskStatus, title: string, icon: JSX.Element) => {
    return (
      <TaskColumn title={title} icon={icon}>
        {tasks
          .filter((t) => t.status === status)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              calendar={calendar}
              category={category}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
      </TaskColumn>
    )
  }

  return (
    <>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        {renderColumn("TODO", "Do zrobienia", <HourglassEmpty />)}
        {renderColumn("IN_PROGRESS", "W trakcie", <Pending />)}
        {renderColumn("DONE", "Zrobione", <Done />)}
      </Box>
    </>
  )
}

export default TaskBoard
