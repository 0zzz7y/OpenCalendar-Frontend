import React, { useEffect, useState } from "react"
import { Box, Paper, Typography } from "@mui/material"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd"

interface NoteItem {
  id: string
  content: string
}

const initialNotes: NoteItem[] = [
  { id: "note-1", content: "Zrobić zakupy" },
  { id: "note-2", content: "Oddzwonić do Kasi" },
  { id: "note-3", content: "Odebrać paczkę" }
]

const DraggableNotes = () => {
  const [notes, setNotes] = useState<NoteItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("notes-order")
    if (saved) {
      setNotes(JSON.parse(saved))
    } else {
      setNotes(initialNotes)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("notes-order", JSON.stringify(notes))
  }, [notes])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const updated = Array.from(notes)
    const [moved] = updated.splice(result.source.index, 1)
    updated.splice(result.destination.index, 0, moved)
    setNotes(updated)
  }

  return (
    <Box mt={2}>
      <Typography variant="subtitle2" mb={1} fontWeight={500}>
        Notatki
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="notes">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              display="flex"
              flexDirection="column"
              gap={1}
            >
              {notes.map((note, index) => (
                <Draggable key={note.id} draggableId={note.id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ p: 1, borderRadius: 2, backgroundColor: "#fff" }}
                    >
                      <Typography variant="body2">{note.content}</Typography>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}

export default DraggableNotes
