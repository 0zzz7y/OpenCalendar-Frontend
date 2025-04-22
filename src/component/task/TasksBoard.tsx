import MESSAGES from "@/constant/message"
import Calendar from "@/type/domain/calendar"
import Category from "@/type/domain/category"
import Task from "@/type/domain/task"
import TaskStatus from "@/type/domain/taskStatus"

import { useEffect, useState } from "react"

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd"
import { HourglassEmpty, Done, Pending } from "@mui/icons-material"
import { Box } from "@mui/material"

import TaskCard from "./TaskCard"
import TaskColumn from "./TaskColumn"

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
    TODO: [],
    IN_PROGRESS: [],
    DONE: []
  })

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const sourceColumn = source.droppableId as TaskStatus
    const destColumn = destination.droppableId as TaskStatus

    const sourceTasks = Array.from(localOrder[sourceColumn])
    const destTasks = Array.from(localOrder[destColumn])

    const draggedTaskIndex = source.index
    const draggedTask = sourceTasks[draggedTaskIndex]
    if (!draggedTask) return

    if (sourceColumn === destColumn) {
      sourceTasks.splice(draggedTaskIndex, 1)
      sourceTasks.splice(destination.index, 0, draggedTask)

      setLocalOrder((prev) => ({
        ...prev,
        [sourceColumn]: sourceTasks
      }))
    } else {
      sourceTasks.splice(draggedTaskIndex, 1)
      const updatedTask = { ...draggedTask, status: destColumn }
      destTasks.splice(destination.index, 0, updatedTask)

      setLocalOrder((prev) => ({
        ...prev,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks
      }))

      onUpdate(updatedTask)
    }
  }

  useEffect(() => {
    setLocalOrder({
      TODO: tasks.filter((t) => t.status === "TODO"),
      IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
      DONE: tasks.filter((t) => t.status === "DONE")
    })
  }, [tasks])

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
                              opacity: snapshot.isDragging ? 0.85 : 1,
                              transform: snapshot.isDragging
                                ? "scale(1.02)"
                                : "none",
                              transition: "all 0.15s ease",
                              cursor: snapshot.isDragging ? "grabbing" : "grab"
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
