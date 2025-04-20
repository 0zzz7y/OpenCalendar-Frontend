import { Box, MenuItem, TextField, Typography, IconButton } from "@mui/material"
import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { useMemo } from "react"
import useAppContext from "@/hook/context/useAppContext" // Using the global AppContext
import EditorMode from "@/type/utility/editorMode"
import EditorType from "@/type/utility/editorType"

const CalendarSelector = () => {
  // Accessing state and methods from AppContext
  const { calendars, selectedCalendar, setSelectedCalendar, openEditor } =
    useAppContext()

  // Prepare the calendar options (including the "All" option)
  const calendarOptions = useMemo(() => {
    return [
      { label: "All", value: "all", emoji: "📅" },
      ...calendars.map((calendar: { name: any; id: any; emoji: any }) => ({
        label: calendar.name,
        value: calendar.id,
        emoji: calendar.emoji
      }))
    ]
  }, [calendars])

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      {/* Calendar selection dropdown */}
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
        {/* List calendar options */}
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
                  {/* Edit calendar button */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditor(EditorType.CALENDAR, EditorMode.EDIT, {
                        id: option.value,
                        label: option.label,
                        emoji: option.emoji
                      })
                    }}
                  >
                    <IconPencil size={16} />
                  </IconButton>
                  {/* Delete calendar button */}
                  <IconButton
                    size="small"
                    disabled={option.value === selectedCalendar}
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditor(EditorType.CALENDAR, EditorMode.DELETE, {
                        id: option.value,
                        label: option.label,
                        emoji: option.emoji
                      })
                    }}
                  >
                    <IconTrash size={16} />
                  </IconButton>
                </Box>
              )}
            </Box>
          </MenuItem>
        ))}
      </TextField>

      {/* Add new calendar button */}
      <IconButton
        onClick={() =>
          openEditor(EditorType.CALENDAR, EditorMode.ADD, {
            label: "",
            emoji: "📅"
          })
        }
      >
        <IconCirclePlus size={20} />
      </IconButton>
    </Box>
  )
}

export default CalendarSelector
