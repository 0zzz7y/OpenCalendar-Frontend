import { Box } from "@mui/material"

import TaskCard from "./TaskCard"
import TaskColumn from "./TaskColumn"

import Task from "../../type/domain/task"
import Calendar from "../../type/domain/calendar"
import Category from "../../type/domain/category"
import TaskStatus from "../../type/domain/taskStatus"

import { HourglassEmpty, Done, Pending } from "@mui/icons-material"

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd"
import { JSX } from "react"
import MESSAGES from "@/constant/message"

interface Properties {
  tasks: Task[]
  calendars: Calendar[]
  categories: Category[]
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

const TaskBoard = ({
  tasks,
  calendars,
  categories,
  onUpdate,
  onDelete
}: Properties) => {
  const columns: { [key in TaskStatus]: { title: string; icon: JSX.Element } } =
    {
      TODO: { title: MESSAGES.PLACEHOLDERS.TODO, icon: <HourglassEmpty /> },
      IN_PROGRESS: {
        title: MESSAGES.PLACEHOLDERS.IN_PROGRESS,
        icon: <Pending />
      },
      DONE: { title: MESSAGES.PLACEHOLDERS.DONE, icon: <Done /> }
    }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { draggableId, destination, source } = result
    if (destination.droppableId === source.droppableId) return

    const task = tasks.find((t) => t.id === draggableId)
    if (!task) return

    const updatedTask: Task = {
      ...task,
      status: destination.droppableId as TaskStatus
    }

    onUpdate(updatedTask)
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" gap={2} alignItems="flex-start">
          {Object.entries(columns).map(([status, { title, icon }]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ flex: 1 }}
                >
                  <TaskColumn title={title} icon={icon}>
                    {tasks
                      .filter((t) => t.status === status)
                      .map((task, index) => (
                        <Draggable
                          draggableId={task.id}
                          index={index}
                          key={task.id}
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                calendars={calendars}
                                categories={categories}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </TaskColumn>
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </>
  )
}

export default TaskBoard
