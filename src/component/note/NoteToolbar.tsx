import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Box, IconButton, Popover, Typography, TextField, MenuItem, Menu } from "@mui/material"
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  CalendarToday as CalendarTodayIcon
} from "@mui/icons-material"

import CancelButton from "@/component/common/button/CancelButton"
import TOOLBAR from "@/constant/utility/toolbar"
import MESSAGE from "@/constant/ui/message"
import FILTER from "@/constant/utility/filter"
import DeleteButton from "../common/button/DeleteButton"
import type FormatCommand from "@/model/utility/formatCommand"
import type Category from "@/model/domain/category"
import type Calendar from "@/model/domain/calendar"

export interface NoteToolbarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onClearText: () => void
  onDelete: () => void
  onFormatText: (command: FormatCommand) => void
  activeFormats: Record<FormatCommand, boolean>
  selectedCategory: string | null
  selectedCalendarId: string | null
  noteName: string
  onNameChange: (name: string) => void
  onNameBlur: () => void
  onDrag: (dx: number, dy: number) => void
  onCategoryChange: (categoryId: string) => void
  onCalendarChange: (calendarId: string) => void
  categories: Category[]
  calendars: Calendar[]
}

const NoteToolbar: React.FC<NoteToolbarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onClearText,
  onDelete,
  onFormatText,
  activeFormats,
  selectedCategory,
  selectedCalendarId,
  onCategoryChange,
  onCalendarChange,
  noteName,
  onNameChange,
  onNameBlur,
  onDrag,
  categories,
  calendars
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<HTMLElement | null>(null)
  const [calendarMenuAnchor, setCalendarMenuAnchor] = useState<HTMLElement | null>(null)
  const [loading, setLoading] = useState(false)

  const isDragging = useRef(false)
  const lastMousePos = useRef<{ x: number; y: number } | null>(null)
  const dragTimeoutRef = useRef<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, input, textarea")) return
    lastMousePos.current = { x: e.clientX, y: e.clientY }
    dragTimeoutRef.current = window.setTimeout(() => {
      isDragging.current = true
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }, 200)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !lastMousePos.current) return
    const dx = e.clientX - lastMousePos.current.x
    const dy = e.clientY - lastMousePos.current.y
    lastMousePos.current = { x: e.clientX, y: e.clientY }
    onDrag(dx, dy)
  }

  const handleMouseUp = () => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current)
      dragTimeoutRef.current = null
    }
    isDragging.current = false
    lastMousePos.current = null
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", handleMouseUp)
  }

  const handleDeleteClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }, [])

  const handleDelete = useCallback(async () => {
    setLoading(true)
    try {
      await onDelete()
    } finally {
      setLoading(false)
      setAnchorEl(null)
    }
  }, [onDelete])

  const handleCancelDelete = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleCategoryMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setCategoryMenuAnchor(e.currentTarget)
  }

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchor(null)
  }

  const handleCategorySelect = (categoryId: string | null) => {
    onCategoryChange(categoryId || "")
    handleCategoryMenuClose()
  }

  const handleCalendarMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setCalendarMenuAnchor(e.currentTarget)
  }

  const handleCalendarMenuClose = () => {
    setCalendarMenuAnchor(null)
  }

  const handleCalendarSelect = (calendarId: string) => {
    onCalendarChange(calendarId)
    handleCalendarMenuClose()
  }

  const currentCalendar = calendars.find((c) => c.id === selectedCalendarId)

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="rgba(255,255,255,0.4)"
      p={0.5}
      sx={{ cursor: "move", userSelect: "none" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Box display="flex" alignItems="center">
        <IconButton size="small" onClick={onToggleCollapse} onMouseDown={(e) => e.stopPropagation()}>
          {isCollapsed ? (
            <ChevronRightIcon fontSize="small" sx={{ transform: "rotate(270deg)" }} />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </IconButton>

        <TextField
          placeholder={MESSAGE.NEW_NOTE}
          value={noteName}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={onNameBlur}
          variant="outlined"
          size="small"
          sx={{
            ml: 1,
            width: 140,
            "& .MuiInputBase-input": { fontSize: 14, fontWeight: 500 }
          }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </Box>

      {!isCollapsed && (
        <Box display="flex" gap={0.5} alignItems="center">
          {([TOOLBAR.BOLD, TOOLBAR.ITALIC, TOOLBAR.UNDERLINE] as FormatCommand[]).map((cmd) => {
            const Icon =
              cmd === TOOLBAR.BOLD ? FormatBoldIcon : cmd === TOOLBAR.ITALIC ? FormatItalicIcon : FormatUnderlinedIcon
            return (
              <IconButton
                key={cmd}
                size="small"
                onClick={() => onFormatText(cmd)}
                onMouseDown={(e) => e.stopPropagation()}
                sx={{ bgcolor: activeFormats[cmd] ? "#ddd" : "transparent" }}
              >
                <Icon fontSize="small" />
              </IconButton>
            )
          })}

          {/* Clear Text */}
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClearText() }}>
            <ClearIcon fontSize="small" />
          </IconButton>

          {/* Select Category */}
          <IconButton size="small" onClick={handleCategoryMenuOpen}>
            <Box
              width={14}
              height={14}
              borderRadius="50%"
              bgcolor={selectedCategory || "#fff"}
              border="1px solid #333"
            />
          </IconButton>

          <Menu anchorEl={categoryMenuAnchor} open={Boolean(categoryMenuAnchor)} onClose={handleCategoryMenuClose}>
            <MenuItem onClick={() => handleCategorySelect(null)}>{FILTER.ALL}</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} onClick={() => handleCategorySelect(category.id)}>
                <Box
                  width={14}
                  height={14}
                  borderRadius="50%"
                  bgcolor={category.color}
                  border="1px solid #333"
                  mr={1}
                />
                {category.name}
              </MenuItem>
            ))}
          </Menu>

          {/* Select Calendar */}
          <IconButton size="small" onClick={handleCalendarMenuOpen}>
            <Typography fontSize="18px">{currentCalendar?.emoji || "📅"}</Typography>
          </IconButton>

          <Menu anchorEl={calendarMenuAnchor} open={Boolean(calendarMenuAnchor)} onClose={handleCalendarMenuClose}>
            {calendars.map((calendar) => (
              <MenuItem key={calendar.id} onClick={() => handleCalendarSelect(calendar.id)}>
                <Typography fontSize="18px" mr={1}>{calendar.emoji}</Typography>
                {calendar.name}
              </MenuItem>
            ))}
          </Menu>

          {/* Delete */}
          <IconButton size="small" onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCancelDelete}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{ sx: { p: 2 } }}
      >
        <Typography variant="body2" gutterBottom>
          {MESSAGE.CONFIRM_DELETE_NOTE}
        </Typography>
        <Box display="flex" gap={1} justifyContent="flex-end">
          <CancelButton onClick={handleCancelDelete} />
          <DeleteButton onClick={handleDelete} />
        </Box>
      </Popover>
    </Box>
  )
}

export default NoteToolbar
