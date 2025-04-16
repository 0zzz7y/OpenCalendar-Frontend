import { Box } from "@mui/material"
import { useNotes } from "@/hooks/useNotes"
import NoteCard from "./NoteCard"

const NotesPanel = () => {
  const { notes } = useNotes()

  return (
    <Box
      position="relative"
      width="100%"
      height="250px"
      overflow="auto"
    >
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </Box>
  )
}

export default NotesPanel
