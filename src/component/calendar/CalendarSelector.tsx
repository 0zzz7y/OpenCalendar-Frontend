import { Box, MenuItem, TextField, Typography, IconButton } from "@mui/material"

import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"

import { useMemo } from "react"

import useAppContext from "@/hook/context/useAppContext"

import EditorMode from "@/type/utility/editorMode"

import EditorType from "@/type/utility/editorType"

const CalendarSelector = () => {
  const { calendars, selectedCalendar, setSelectedCalendar, openEditor } =
    useAppContext()

  const calendarOptions = useMemo(() => {
    return [
      { label: "All", value: "all", emoji: "📅" },
      ...calendars.map(
        (calendar: { name: string; id: string; emoji: string }) => ({
          label: calendar.name,
          value: calendar.id,
          emoji: calendar.emoji
        })
      )
    ]
  }, [calendars])

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} width="100%">
        <TextField
          select
          label="Calendar"
          value={selectedCalendar || "all"}
          onChange={e => setSelectedCalendar(e.target.value || null)}
          fullWidth
          size="small"
          SelectProps={{
            renderValue: selected => {
              const item = calendarOptions.find(d => d.value === selected)
              return (
                <>
                  <Box display="flex" alignItems="center" gap={1}>
                    <span>{item?.emoji || "📅"}</span>
                    <Typography variant="body2">{item?.label}</Typography>
                  </Box>
                </>
              )
            }
          }}
        >
          {calendarOptions.map(option => (
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
                      onClick={e => {
                        e.stopPropagation()
                        openEditor(EditorType.CALENDAR, EditorMode.EDIT, {
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
                      onClick={e => {
                        e.stopPropagation()
                        openEditor(EditorType.CALENDAR, EditorMode.DELETE, {
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
          onClick={() =>
            openEditor(EditorType.CALENDAR, EditorMode.ADD, {
              label: "",
              emoji: "📅"
            })
          }
        >
          <AddCircleOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </>
  )
}

export default CalendarSelector
