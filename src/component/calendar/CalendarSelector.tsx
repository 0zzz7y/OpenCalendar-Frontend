import useAppStore from "@/store/useAppStore"

import { useMemo, useState } from "react"

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import {
  Box,
  MenuItem,
  TextField,
  Typography,
  IconButton
} from "@mui/material"
import CalendarEditor from "./CalendarEditor"
import EditorMode from "@/model/utility/editorMode"

const CalendarSelector = () => {
  const { calendars } = useAppStore()
  const selectedCalendar = useAppStore((s) => s.selectedCalendar)
  const setSelectedCalendar = useAppStore((s) => s.setSelectedCalendar)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorAnchor, setEditorAnchor] = useState<HTMLElement | null>(null)
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.ADD)
  const [editorData, setEditorData] = useState<{
    id?: string
    label?: string
    emoji?: string
  }>({})

  const calendarOptions = useMemo(() => {
    return [
      { label: "All", value: "all", emoji: "📅" },
      ...calendars.map((calendar) => ({
        label: calendar.name,
        value: calendar.id,
        emoji: calendar.emoji
      }))
    ]
  }, [calendars])

  const openEditor = (
    mode: EditorMode.ADD | EditorMode.EDIT | EditorMode.DELETE,
    anchor: HTMLElement,
    data: { id?: string; label?: string; emoji?: string } = {}
  ) => {
    setEditorMode(mode)
    setEditorData(data)
    setEditorAnchor(anchor)
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setEditorAnchor(null)
    setEditorData({})
  }

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <TextField
        select
        label="Calendar"
        value={selectedCalendar || "all"}
        onChange={(e) => setSelectedCalendar(e.target.value || null)}
        fullWidth
        size="small"
        SelectProps={{
          renderValue: (selected) => {
            const item = calendarOptions.find((d) => d.value === selected)
            return (
              <Box display="flex" alignItems="center" gap={1}>
                <span>{item?.emoji || "📅"}</span>
                <Typography variant="body2">{item?.label}</Typography>
              </Box>
            )
          }
        }}
      >
        {calendarOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <span>{option.emoji}</span>
                <Typography variant="body2">{option.label}</Typography>
              </Box>
              {option.value !== "all" && (
                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditor(EditorMode.EDIT, e.currentTarget, {
                        id: option.value,
                        label: option.label,
                        emoji: option.emoji
                      })
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={option.value === selectedCalendar}
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditor(EditorMode.DELETE, e.currentTarget, {
                        id: option.value,
                        label: option.label,
                        emoji: option.emoji
                      })
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </MenuItem>
        ))}
      </TextField>

      <IconButton
        onClick={(e) =>
          openEditor(EditorMode.ADD, e.currentTarget, {
            label: "",
            emoji: "📅"
          })
        }
      >
        <AddCircleOutlineIcon fontSize="small" />
      </IconButton>

      <CalendarEditor
        open={editorOpen}
        anchorEl={editorAnchor}
        mode={editorMode}
        onClose={closeEditor}
        initialData={editorData}
      />
    </Box>
  )
}

export default CalendarSelector
