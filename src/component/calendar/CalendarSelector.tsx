import { Box, MenuItem, TextField, Typography, IconButton } from "@mui/material"

import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { useMemo } from "react"

import useCalendarContext from "../../hook/context/useCalendarContext"

const CalendarSelector = () => {
  const { calendars, selectedCalendar, setSelectedCalendar, openEditor } =
    useCalendarContext()

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

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} width="100%">
        <TextField
          key={calendarOptions.map((c) => `${c.value}-${c.label}`).join("-")}
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
                        openEditor("edit", {
                          id: option.value,
                          label: option.label,
                          emoji: option.emoji
                        })
                      }}
                    >
                      <IconPencil size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={option.value === selectedCalendar}
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditor("delete", {
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

        <IconButton onClick={() => openEditor("add")}>
          <IconCirclePlus size={20} />
        </IconButton>
      </Box>
    </>
  )
}

export default CalendarSelector
