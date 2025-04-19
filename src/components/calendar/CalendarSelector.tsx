import {
  MenuItem,
  TextField,
  IconButton,
  Popper,
  Box,
  Typography
} from "@mui/material"

import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import CalendarEditor from "./CalendarEditor"

import useCalendars from "../../hooks/useCalendars"

export interface CalendarOption {
  label: string
  value: string
  emoji?: string
}

interface CalendarSelectorProperties {
  value: string | null
  onChange: (val: string | null) => void
}

const CalendarSelector = ({ value, onChange }: CalendarSelectorProperties) => {
  const { calendars, reloadCalendars } = useCalendars()

  const [editMode, setEditMode] = useState<"add" | "edit" | "delete">("add")
  const [currentValue, setCurrentValue] = useState("")
  const [labelInput, setLabelInput] = useState("")
  const [emojiInput, setEmojiInput] = useState("📅")

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isPopoverOpen = Boolean(anchorEl)

  const calendarOptions = useMemo<CalendarOption[]>(() => {
    if (!Array.isArray(calendars))
      return [{ label: "All", value: "all", emoji: "📅" }]
    return [
      { label: "All", value: "all", emoji: "📅" },
      ...calendars.map((calendar) => ({
        label: calendar.name,
        value: calendar.id,
        emoji: calendar.emoji
      }))
    ]
  }, [calendars])

  const openPopover = (
    mode: "add" | "edit" | "delete",
    e: React.MouseEvent,
    val = "",
    label = "",
    emoji = "📅"
  ) => {
    if (mode === "delete" && val === value) return
    setEditMode(mode)
    setCurrentValue(val)
    setLabelInput(label)
    setEmojiInput(emoji)
    setAnchorEl(e.currentTarget as HTMLElement)
  }

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} width="100%" zIndex={1}>
        <TextField
          key={calendarOptions.map((c) => `${c.value}-${c.label}`).join("-")}
          select
          label="Calendar"
          value={value || "all"}
          onChange={(e) => onChange(e.target.value || null)}
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
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ pl: 1, zIndex: 1 }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{option.emoji || "📅"}</span>
                  <Typography variant="body2">{option.label}</Typography>
                </Box>

                {option.value !== "all" && (
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        openPopover(
                          "edit",
                          e,
                          option.value,
                          option.label,
                          option.emoji
                        )
                      }}
                    >
                      <IconPencil size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={option.value === value}
                      onClick={(e) => {
                        e.stopPropagation()
                        openPopover(
                          "delete",
                          e,
                          option.value,
                          option.label,
                          option.emoji
                        )
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

        <IconButton onClick={(e) => openPopover("add", e)}>
          <IconCirclePlus size={20} />
        </IconButton>
      </Box>

      <Popper
        open={isPopoverOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 2000 }}
        modifiers={[
          {
            name: "preventOverflow",
            options: { boundary: "viewport" }
          }
        ]}
      >
        <Box zIndex={2000}>
          <CalendarEditor
            editMode={editMode}
            labelInput={labelInput}
            setLabelInput={setLabelInput}
            onClose={() => setAnchorEl(null)}
            onSubmit={() => {
              reloadCalendars()
              setAnchorEl(null)
            }}
            emojiInput={emojiInput}
            setEmojiInput={setEmojiInput}
            calendarId={currentValue}
          />
        </Box>
      </Popper>
    </>
  )
}

export default CalendarSelector
