import { useState } from "react"
import { Box } from "@mui/material"

import TaskCard from "./TaskCard"
import TaskColumn from "./TaskColumn"

import Task from "@/type/domain/task"
import Calendar from "@/type/domain/calendar"
import Category from "@/type/domain/category"
import TaskStatus from "@/type/domain/taskStatus"

import { HourglassEmpty, Done, Pending } from "@mui/icons-material"

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd"

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
      TODO: { title: TaskStatus.TODO, icon: <HourglassEmpty /> },
      IN_PROGRESS: { title: TaskStatus.IN_PROGRESS, icon: <Pending /> },
      DONE: { title: TaskStatus.DONE, icon: <Done /> }
    }

  const [localOrder, setLocalOrder] = useState<Record<TaskStatus, Task[]>>({
    TODO: tasks.filter(t => t.status === "TODO"),
    IN_PROGRESS: tasks.filter(t => t.status === "IN_PROGRESS"),
    DONE: tasks.filter(t => t.status === "DONE")
  })

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return

    const sourceColumn = source.droppableId as TaskStatus
    const destColumn = destination.droppableId as TaskStatus

    const sourceTasks = Array.from(localOrder[sourceColumn])
    const destTasks = Array.from(localOrder[destColumn])

    const draggedTask = sourceTasks.find(t => t.id === draggableId)
    if (!draggedTask) return

    if (sourceColumn === destColumn) {
      sourceTasks.splice(source.index, 1)
      sourceTasks.splice(destination.index, 0, draggedTask)

      setLocalOrder(prev => ({
        ...prev,
        [sourceColumn]: sourceTasks
      }))
    } else {
      sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, {
        ...draggedTask,
        status: destColumn
      })

      setLocalOrder(prev => ({
        ...prev,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks
      }))

      onUpdate({ ...draggedTask, status: destColumn })
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          alignItems="flex-start"
          justifyContent="center"
        >
          {Object.entries(columns).map(([status, { title, icon }]) => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    minWidth: 280,
                    transition: "background-color 0.2s ease",
                    backgroundColor: snapshot.isDraggingOver
                      ? "#f0f0f0"
                      : "transparent"
                  }}
                >
                  <TaskColumn title={title} icon={icon}>
                    {localOrder[status as TaskStatus]?.map((task, index) => (
                      <Draggable
                        draggableId={task.id}
                        index={index}
                        key={task.id}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              transition: "opacity 0.2s ease"
                            }}
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
