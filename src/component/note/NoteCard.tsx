import { useEffect, useRef, useState } from "react"
import {
  Box,
  Paper,
  Collapse,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Button
} from "@mui/material"

import NoteToolbar, { FormatCommand } from "./NoteToolbar"

import Note from "@/type/domain/note"
import Category from "@/type/domain/category"

import MESSAGES from "@/constant/message"

export interface NoteCardProperties {
  id: string
  content: string
  initialX?: number
  initialY?: number
  color?: string
  categories: Category[]
  onDelete?: (id: string) => void
  onUpdate?: (note: Note) => void
  calendarId?: string
  name?: string
}

const NoteCard = ({
  id,
  initialX = 0,
  initialY = 0,
  color = "#fff59d",
  content = "",
  categories,
  onDelete,
  onUpdate,
  calendarId,
  name = MESSAGES.PLACEHOLDERS.NEW_NOTE
}: NoteCardProperties) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const positionRef = useRef({ x: initialX, y: initialY })
  const lastMousePos = useRef<{ x: number; y: number } | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const dragReady = useRef(false)

  const [dimensions, setDimensions] = useState({ width: 420, height: 270 })
  const [position, setPosition] = useState(positionRef.current)
  const [dragging, setDragging] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [confirmAnchorEl, setConfirmAnchorEl] = useState<null | HTMLElement>(
    null
  )
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [activeFormats, setActiveFormats] = useState<
    Record<FormatCommand, boolean>
  >({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false
  })
  const [noteName, setNoteName] = useState(name)

  useEffect(() => {
    if (content && !contentRef.current?.innerHTML) {
      contentRef.current!.innerHTML = content
    }
  }, [])

  const getCategoryColor = (categoryId: string | null) =>
    categories.find((c) => c.id === categoryId)?.color || color

  const clearText = () => {
    if (contentRef.current) contentRef.current.innerHTML = ""
  }

  const formatText = (command: FormatCommand) => {
    contentRef.current?.focus()
    setTimeout(() => {
      document.execCommand(command, false)
      setActiveFormats((prev) => ({
        ...prev,
        [command]: !prev[command]
      }))
    }, 0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
      dragReady.current = true
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      setDragging(true)
    }
  }

  const handleMouseUp = () => {
    setDragging(false)
    dragReady.current = false
    lastMousePos.current = null
  }

  const handleDrag = (e: MouseEvent) => {
    if (!dragging || !lastMousePos.current) return
    const dx = e.clientX - lastMousePos.current.x
    const dy = e.clientY - lastMousePos.current.y
    lastMousePos.current = { x: e.clientX, y: e.clientY }
    positionRef.current = {
      x: Math.max(0, positionRef.current.x + dx),
      y: Math.max(0, positionRef.current.y + dy)
    }
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(() => {
        setPosition({ ...positionRef.current })
        animationFrameRef.current = null
      })
    }
  }

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = dimensions.width
    const startHeight = dimensions.height

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(150, startWidth + (moveEvent.clientX - startX))
      const newHeight = Math.max(
        100,
        startHeight + (moveEvent.clientY - startY)
      )
      setDimensions({ width: newWidth, height: newHeight })
    }

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const handleConfirm = (message: string, action: () => void) => {
    setConfirmAction(() => action)
    setConfirmOpen(true)
    setConfirmAnchorEl(wrapperRef.current)
  }

  const handleConfirmClose = () => {
    setConfirmOpen(false)
    setConfirmAnchorEl(null)
  }

  const handleBlur = () => {
    if (onUpdate) {
      onUpdate({
        id,
        name: noteName,
        description: contentRef.current?.innerHTML || "",
        categoryId: selectedCategory || "",
        calendarId: calendarId || ""
      })
    }
  }

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleDrag)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleDrag)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [dragging])

  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        id,
        name: noteName,
        description: contentRef.current?.innerHTML || "",
        categoryId: selectedCategory || "",
        calendarId: calendarId || ""
      })
    }
  }, [selectedCategory])

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: dimensions.width,
        userSelect: "none",
        zIndex: dragging ? 1000 : 100,
        pointerEvents: "auto"
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Paper
        sx={{
          color: "#000",
          width: "100%",
          backgroundColor: getCategoryColor(selectedCategory),
          borderRadius: 2,
          boxShadow: dragging ? "0 0 10px #2196f3" : 3,
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "default",
          position: "relative"
        }}
      >
        <Box ref={toolbarRef}>
          <NoteToolbar
            isCollapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
            onClearText={clearText}
            onDelete={() =>
              contentRef.current?.innerText.trim()
                ? handleConfirm(MESSAGES.POPOVER.CONFIRM_DELETE_NOTE, () =>
                    onDelete?.(id)
                  )
                : onDelete?.(id)
            }
            onFormatText={formatText}
            activeFormats={activeFormats}
            selectedCategory={selectedCategory}
            onCategoryMenuOpen={(e: any) => setMenuAnchorEl(e)}
            noteName={noteName}
            onNameChange={setNoteName}
            onNameBlur={handleBlur}
          />
        </Box>

        <Collapse in={!collapsed}>
          <Box
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            sx={{
              height: dimensions.height,
              p: 1,
              pr: "8px",
              fontSize: 14,
              outline: "none",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#000"
            }}
          />
        </Collapse>

        <Box
          onMouseDown={handleResize}
          sx={{
            width: 20,
            height: 20,
            position: "absolute",
            bottom: 0,
            right: 0,
            cursor: "nwse-resize",
            zIndex: 10
          }}
        />
      </Paper>

      <Popover
        open={confirmOpen}
        anchorEl={confirmAnchorEl}
        onClose={handleConfirmClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{ sx: { p: 2 } }}
      >
        <Typography variant="body2" gutterBottom>
          {MESSAGES.POPOVER.CONFIRM_CLEAR_CONTENTS}
        </Typography>
        <Box display="flex" gap={1} justifyContent="flex-end">
          <Button size="small" onClick={handleConfirmClose}>
            Cancel
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => {
              confirmAction()
              handleConfirmClose()
            }}
          >
            Delete
          </Button>
        </Box>
      </Popover>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        MenuListProps={{ dense: true }}
      >
        {categories.map(({ id, name, color }) => (
          <MenuItem
            key={id}
            selected={selectedCategory === id}
            onClick={() => {
              setSelectedCategory(id)
              setMenuAnchorEl(null)
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: color,
                mr: 1
              }}
            />
            {name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default NoteCard
