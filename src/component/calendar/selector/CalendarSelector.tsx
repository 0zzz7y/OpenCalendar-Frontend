import { useState, useMemo, useCallback } from "react"
import { Box, Typography, IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import useApplicationStorage from "@/storage/useApplicationStorage"
import CalendarEditor from "./CalendarEditor"

import EditorMode from "@/model/utility/editorMode"
import LABEL from "@/constant/ui/label"
import FILTER from "@/constant/utility/filter"

import Selector from "@/component/common/selector/Selector"
import AddButton from "@/component/common/button/AddButton"
import { isCalendarUsed } from "@/function/filter/useFilter"
import useCalendar from "@/repository/calendar.repository"
import { useEvent, useNote, useTask } from "@/repository"

export default function CalendarSelector() {
  const calendars = useApplicationStorage((state) => state.calendars)
  const selectedCalendar = useApplicationStorage((state) => state.selectedCalendar) || FILTER.ALL
  const setSelectedCalendar = useApplicationStorage((state) => state.setSelectedCalendar)

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

  // No filtering applied to calendars
  const calendarOptions = useMemo(() => {
    return [
      { label: FILTER.ALL, value: FILTER.ALL, emoji: "📅" },
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
    setSelectedCalendar(FILTER.ALL)
    await reloadCalendars()
    await reloadEvents()
    await reloadTasks()
    await reloadNotes()
  }, [reloadCalendars, setSelectedCalendar, reloadEvents, reloadTasks, reloadNotes])

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <Selector label={LABEL.CALENDAR} value={selectedCalendar} onChange={handleChange} options={calendarOptions}>
        {(option) => (
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box display="flex" alignItems="center" gap={1}>
              <span>{option.emoji}</span>
              <Typography variant="body2">{option.label}</Typography>
            </Box>
            {option.value !== FILTER.ALL && (
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
      </Selector>

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
