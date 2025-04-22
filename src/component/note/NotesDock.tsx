import Category from "@/type/domain/category"
import Note from "@/type/domain/note"

import { Box } from "@mui/material"
import { useDrop } from "react-dnd"

import NoteCard from "./NoteCard"

interface NotesDockProperties {
  notes: Note[]
  categories: Category[]
  onDeleteNote: (id: string) => void
  onUpdateNote: (note: Note) => void
}

const NotesDock = ({
  notes,
  categories,
  onDeleteNote,
  onUpdateNote
}: NotesDockProperties) => {
  const [, dropRef] = useDrop({
    accept: "note",
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset || !item.id) return

      const updatedNote = notes.find((n) => n.id === item.id)
      if (!updatedNote) return

      const container = document
        .getElementById("notes-dock")!
        .getBoundingClientRect()

      const newX = offset.x - container.left
      const newY = offset.y - container.top

      onUpdateNote({
        ...updatedNote,
        positionX: newX,
        positionY: newY
      })
    }
  })

  return (
    <>
      <Box
        id="notes-dock"
        ref={dropRef}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
      >
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            name={note.name}
            content={note.description}
            initialX={note.positionX}
            initialY={note.positionY}
            color={note.category?.color}
            categories={categories}
            onDelete={onDeleteNote}
            onUpdate={onUpdateNote}
            calendar={note.calendar}
          />
        ))}
      </Box>
    </>
  )
}

export default NotesDock
