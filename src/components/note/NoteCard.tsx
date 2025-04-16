import { useState } from "react"
import { Box, Paper, Typography } from "@mui/material"
import { Note } from "@/models/note"
import { useCategories } from "@/hooks/useCategories"

interface Properties {
  note: Note
}

const NoteCard = ({ note }: Properties) => {
  const [position, setPosition] = useState({ x: note.x, y: note.y })
  const { categories } = useCategories()

  const category = categories.find((cat) => cat.id === note.categoryId)
  const backgroundColor = category?.color || "#fff9c4" // default yellow

  const handleDragStart = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startY = e.clientY

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      })
    }

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: note.width || 160,
        height: note.height || 160,
        padding: 1.5,
        backgroundColor,
        cursor: "grab",
        zIndex: note.zIndex,
      }}
      onMouseDown={handleDragStart}
    >
      <Typography
        contentEditable
        suppressContentEditableWarning
        sx={{ fontSize: 14, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {note.content}
      </Typography>
    </Paper>
  )
}

export default NoteCard
