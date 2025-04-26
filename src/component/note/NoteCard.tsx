import { useCallback, useEffect, useRef, useState } from "react"
import { Box, Paper, Collapse, Menu, MenuItem, Popover, Typography, Button } from "@mui/material"
import NoteToolbar from "./NoteToolbar"
import type FormatCommand from "@/model/utility/formatCommand"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"
import MESSAGES from "@/constant/ui/message"
import type Note from "@/model/domain/note"

export interface NoteCardProperties {
  id: string
  content: string
  initialX?: number
  initialY?: number
  color?: string
  categories: Category[]
  onDelete?: (id: string) => void
  onUpdate: (note: Note) => void
  calendar: Calendar
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
  calendar,
  name = MESSAGES.NEW_NOTE
}: NoteCardProperties) => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const [dimensions, setDimensions] = useState({ width: 380, height: 200 })
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const [dragging, setDragging] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [activeFormats, setActiveFormats] = useState<Record<FormatCommand, boolean>>({
    bold: false,
    italic: false,
    underline: false
  })
  const [noteName, setNoteName] = useState(name)
  const [lastSavedContent, setLastSavedContent] = useState(content)
  const [lastSavedName, setLastSavedName] = useState(name)

  // Debounce timer for saving
  const saveTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (content && !contentRef.current?.innerHTML) {
      if (contentRef.current) {
        contentRef.current.innerHTML = content
      }
    }
  }, [content])

  const getCategoryColor = (category: Category | undefined) => category?.color || color

  const clearText = () => {
    if (contentRef.current) contentRef.current.innerHTML = ""
  }

  const formatText = (command: FormatCommand) => {
    contentRef.current?.focus()
    setTimeout(() => {
      document.execCommand(command, false)
      setActiveFormats((prev) => ({
        ...prev,
        [command]: document.queryCommandState(command)
      }))
    }, 0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging if the toolbar is clicked
    if (toolbarRef.current?.contains(e.target as Node)) {
      setDragging(true)
    }
  }

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return
      setPosition((prev) => ({
        x: Math.max(0, prev.x + e.movementX),
        y: Math.max(0, prev.y + e.movementY)
      }))
    },
    [dragging]
  )

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = dimensions.width
    const startHeight = dimensions.height

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(150, startWidth + (moveEvent.clientX - startX))
      const newHeight = Math.max(100, startHeight + (moveEvent.clientY - startY))
      setDimensions({ width: newWidth, height: newHeight })
    }

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const handleBlur = () => {
    const currentContent = contentRef.current?.innerHTML || ""
    if (currentContent !== lastSavedContent || noteName !== lastSavedName) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = window.setTimeout(() => {
        if (onUpdate) {
          onUpdate({
            id,
            name: noteName,
            description: currentContent,
            calendar
          })
          setLastSavedContent(currentContent)
          setLastSavedName(noteName)
        }
      }, 500) // Save after 500ms of inactivity
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
  }, [dragging, handleDrag, handleMouseUp])

  useEffect(() => {
    const updateActiveFormats = () => {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline")
      })
    }

    contentRef.current?.addEventListener("keyup", updateActiveFormats)
    contentRef.current?.addEventListener("mouseup", updateActiveFormats)

    return () => {
      contentRef.current?.removeEventListener("keyup", updateActiveFormats)
      contentRef.current?.removeEventListener("mouseup", updateActiveFormats)
    }
  }, [])

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
        pointerEvents: "auto",
        transition: "all 0.15s ease",
        transform: dragging ? "scale(1.02)" : "none"
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
        <Box
          ref={toolbarRef}
          sx={{
            cursor: dragging ? "grabbing" : "grab",
            transition: "cursor 0.15s ease"
          }}
        >
          <NoteToolbar
            isCollapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
            onClearText={clearText}
            onDelete={async () => onDelete?.(id)}
            onFormatText={formatText}
            activeFormats={activeFormats}
            selectedCategory={selectedCategory?.id || null}
            onCategoryMenuOpen={(anchor: HTMLElement) => setMenuAnchorEl(anchor)}
            noteName={noteName}
            onNameChange={setNoteName}
            onNameBlur={handleBlur}
            onDrag={(dx, dy) => setPosition((prev) => ({ x: Math.max(0, prev.x + dx), y: Math.max(0, prev.y + dy) }))}
            onCategoryChange={(categoryId) => {
              const category = categories.find((cat) => cat.id === categoryId) || undefined
              setSelectedCategory(category)
            }}
            categories={categories}
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
    </Box>
  )
}

export default NoteCard
