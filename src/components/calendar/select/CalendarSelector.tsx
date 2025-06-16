import { useState, useMemo, useCallback } from "react"
import { Box, Typography, IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import { useStorage } from "@/storage/useStorage.hook"
import CalendarEditor from "./CalendarEditor"

import { EditorMode } from "@/components/shared/editorMode.type"
import { LABEL } from "@/components/shared/label.constant"
import { Filter } from "@/features/filter/filter.type"

import { Select } from "@/components/library/select/Select"
import { AddButton } from "@/components/library/button/AddButton"
import { useCalendar } from "@/features/calendar/useCalendar.hook"
import { useEvent } from "@/features/event/useEvent.hook"
import { useTask } from "@/features/task/useTask.hook"
import { useNote } from "@/features/note/useNote.hook"

export default function CalendarSelector() {
  const calendars = useStorage((state) => state.calendars)
  const selectedCalendar = useStorage((state) => state.selectedCalendar) || Filter.ALL
  const setSelectedCalendar = useStorage((state) => state.setSelectedCalendar)

  const { reloadCalendars } = useCalendar()
  const { reloadEvents } = useEvent()
  const { reloadTasks } = useTask()
  const { reloadNotes } = useNote()

  const [editorOpen, setEditorOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.ADD)
  const [editorData, setEditorData] = useState<{
    id?: string
    label?: string
    emoji?: string
  }>({})

  const calendarOptions = useMemo(() => {
    return [
      { label: Filter.ALL, value: Filter.ALL, emoji: "📅" },
      ...calendars.map((calendar) => ({
        label: calendar.name,
        value: calendar.id,
        emoji: calendar.emoji
      }))
    ]
  }, [calendars])

  const openEditor = useCallback(
    (mode: EditorMode, anchor: HTMLElement, data: { id?: string; label?: string; emoji?: string }) => {
      setEditorMode(mode)
      setEditorData(data)
      setAnchor(anchor)
      setEditorOpen(true)
    },
    []
  )

  const closeEditor = useCallback(() => {
    setEditorOpen(false)
    setEditorData({})
    setAnchor(null)
  }, [])

  const handleChange = useCallback((calendarId: string) => setSelectedCalendar(calendarId), [setSelectedCalendar])

  const handleAfterDelete = useCallback(async () => {
    setSelectedCalendar(Filter.ALL)
    await reloadCalendars()
    await reloadEvents()
    await reloadTasks()
    await reloadNotes()
  }, [reloadCalendars, setSelectedCalendar, reloadEvents, reloadTasks, reloadNotes])

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <Select label={LABEL} value={selectedCalendar} onChange={handleChange} options={calendarOptions}>
        {(option) => (
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box display="flex" alignItems="center" gap={1}>
              <span>{option.emoji}</span>
              <Typography variant="body2">{option.label}</Typography>
            </Box>
            {option.value !== Filter.ALL && (
              <Box display="flex" gap={1}>
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation()
                    openEditor(EditorMode.EDIT, event.currentTarget, {
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
                  onClick={(event) => {
                    event.stopPropagation()
                    openEditor(EditorMode.DELETE, event.currentTarget, {
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
        )}
      </Select>

      <AddButton
        onClick={(event) =>
          openEditor(EditorMode.ADD, event.currentTarget, {
            label: "",
            emoji: "📅"
          })
        }
      />

      <CalendarEditor
        open={editorOpen}
        anchor={anchor}
        mode={editorMode}
        initialData={editorData}
        onClose={closeEditor}
        onDelete={handleAfterDelete}
      />
    </Box>
  )
}
