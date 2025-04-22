import Calendar from "@/type/domain/calendar"
import Category from "@/type/domain/category"
import Note from "@/type/domain/note"

import {
  Droppable,
  Draggable,
  DragDropContext,
  DropResult
} from "@hello-pangea/dnd"
import { Box } from "@mui/material"

import NoteCard from "./NoteCard"

interface Properties {
  notes: Note[]
  calendars: Calendar[]
  categories: Category[]
  onUpdate: (note: Note) => void
  onDelete: (id: string) => void
  onPositionReset?: (note: Note) => void
}

const NoteDock = ({
  notes,
  calendars,
  categories,
  onUpdate,
  onDelete,
  onPositionReset
}: Properties) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const note = notes.find((n) => n.id === draggableId)
    if (!note) return

    if (onPositionReset && destination.droppableId === "dock") {
      onPositionReset({ ...note, positionX: 0, positionY: 0 })
    }
  }

  const dockedNotes = notes.filter(
    (n) => n.positionX === 0 && n.positionY === 0
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dock" direction="horizontal">
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              overflowX: "auto",
              backgroundColor: snapshot.isDraggingOver
                ? "#f5f5f5"
                : "transparent",
              borderTop: "1px solid #ccc"
            }}
          >
            {dockedNotes.map((note, index) => (
              <Draggable key={note.id} draggableId={note.id} index={index}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                      opacity: snapshot.isDragging ? 0.85 : 1,
                      transform: snapshot.isDragging ? "scale(1.02)" : "none",
                      transition: "all 0.15s ease",
                      cursor: snapshot.isDragging ? "grabbing" : "grab"
                    }}
                  >
                    <NoteCard
                      id={note.id}
                      content={note.description}
                      calendar={note.calendar}
                      categories={categories}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      name={note.name}
                      color={note.category?.color}
                      initialX={note.positionX}
                      initialY={note.positionY}
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default NoteDock
