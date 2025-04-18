import {
  MenuItem,
  TextField,
  IconButton,
  Popper,
  Box,
  Typography
} from "@mui/material"

import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { useState, useEffect } from "react"

import CalendarEditor from "./CalendarEditor"

export interface CalendarOption {
  label: string
  value: string
  emoji?: string
}

interface CalendarSelectorProperties {
  data: CalendarOption[]
  value: string | null
  onChange: (val: string | null) => void
  setData: (data: CalendarOption[]) => void
}

const CalendarSelector = ({
  data,
  value,
  onChange,
  setData
}: CalendarSelectorProperties) => {
  const [editMode, setEditMode] = useState<"add" | "edit" | "delete">("add")
  const [currentValue, setCurrentValue] = useState("")
  const [labelInput, setLabelInput] = useState("")
  const [emojiInput, setEmojiInput] = useState("📅")

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isPopoverOpen = Boolean(anchorEl)

  useEffect(() => {
    const hasAll = data.some((item) => item.value === "all")
    if (!hasAll) {
      setData([{ label: "All", value: "all", emoji: "📅" }, ...data])
    }
  }, [data, setData])

  useEffect(() => {
    if (value === null || value === "") {
      onChange("all")
    }
  }, [value, onChange])

  const handleAddLocal = (id: string) => {
    const newCalendar = {
      label: labelInput,
      value: id,
      emoji: emojiInput
    }
    setData([...data, newCalendar])
    onChange(id)
  }

  const handleEditLocal = () => {
    setData(
      data.map((item) =>
        item.value === currentValue
          ? { ...item, label: labelInput, emoji: emojiInput }
          : item
      )
    )
    onChange(currentValue)
  }

  const handleDeleteLocal = () => {
    setData(data.filter((item) => item.value !== currentValue))
    if (value === currentValue) onChange("all")
  }

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
          select
          label="Calendar"
          value={value || "all"}
          onChange={(e) => onChange(e.target.value || null)}
          fullWidth
          size="small"
          SelectProps={{
            renderValue: (selected) => {
              const item = data.find((d) => d.value === selected)
              return (
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{item?.emoji || "📅"}</span>
                  <Typography variant="body2">{item?.label}</Typography>
                </Box>
              )
            }
          }}
        >
          {data.map((option) => (
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
            onAddLocal={() => handleAddLocal(crypto.randomUUID())}
            onEditLocal={handleEditLocal}
            onDeleteLocal={handleDeleteLocal}
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
