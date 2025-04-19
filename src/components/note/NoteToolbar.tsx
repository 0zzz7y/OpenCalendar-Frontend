import {
  Box,
  IconButton,
  Select,
  MenuItem,
  Popover,
  Typography,
  Button,
  TextField
} from "@mui/material"

import BrushIcon from "@mui/icons-material/Brush"
import EditIcon from "@mui/icons-material/Edit"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined"

import { useState } from "react"
import MESSAGES from "@/constants/messages"

export type FormatCommand =
  | typeof MESSAGES.TOOLBAR.BOLD
  | typeof MESSAGES.TOOLBAR.ITALIC
  | typeof MESSAGES.TOOLBAR.UNDERLINE

interface NoteToolbarProperties {
  isCollapsed: boolean
  isDrawing: boolean
  onToggleCollapse: () => void
  onToggleMode: () => void
  onClearCanvas: () => void
  onClearText: () => void
  onDelete: () => void
  onFormatText: (command: FormatCommand) => void
  brushColor: string
  setBrushColor: (color: string) => void
  brushSize: number
  setBrushSize: (size: number) => void
  activeFormats: Record<FormatCommand, boolean>
  selectedCategory: string | null
  onCategoryMenuOpen: (anchor: HTMLElement) => void
  noteName: string
  onNameChange: (newName: string) => void
}

const NoteToolBar = ({
  isCollapsed,
  isDrawing,
  onToggleCollapse,
  onToggleMode,
  onClearCanvas,
  onClearText,
  onDelete,
  onFormatText,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  activeFormats,
  selectedCategory,
  onCategoryMenuOpen,
  noteName,
  onNameChange
}: NoteToolbarProperties) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleConfirm = () => {
    onDelete()
    setAnchorEl(null)
  }

  const handleCancel = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="rgba(255,255,255,0.4)"
      p={0.5}
      sx={{ cursor: "move", userSelect: "none" }}
    >
      <Box display="flex" alignItems="center">
        <IconButton
          size="small"
          onClick={onToggleCollapse}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {isCollapsed ? (
            <ChevronRightIcon
              fontSize="small"
              sx={{ color: "#000", transform: "rotate(270deg)" }}
            />
          ) : (
            <ExpandMoreIcon fontSize="small" sx={{ color: "#000" }} />
          )}
        </IconButton>

        <TextField
          placeholder="Name"
          value={noteName}
          onChange={(e) => onNameChange(e.target.value)}
          variant="outlined"
          size="small"
          onMouseDown={(e) => e.stopPropagation()}
          sx={{
            ml: 1,
            width: 140,
            input: {
              fontSize: 14,
              fontWeight: 500,
              color: "#333"
            }
          }}
        />
      </Box>

      {!isCollapsed && (
        <Box display="flex" gap={0.5} alignItems="center">
          {isDrawing ? (
            <>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  width: 24,
                  height: 24,
                  border: "none",
                  background: "none",
                  cursor: "pointer"
                }}
              />
              <Select
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                size="small"
                sx={{ height: 24, fontSize: 12 }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {[1, 2, 4, 8, 12].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}px
                  </MenuItem>
                ))}
              </Select>
              <IconButton
                size="small"
                onClick={onClearCanvas}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ClearIcon fontSize="small" sx={{ color: "#000" }} />
              </IconButton>
            </>
          ) : (
            <>
              {[
                MESSAGES.TOOLBAR.BOLD,
                MESSAGES.TOOLBAR.ITALIC,
                MESSAGES.TOOLBAR.UNDERLINE
              ].map((cmd) => {
                const Icon =
                  cmd === MESSAGES.TOOLBAR.BOLD
                    ? FormatBoldIcon
                    : cmd === MESSAGES.TOOLBAR.ITALIC
                      ? FormatItalicIcon
                      : FormatUnderlinedIcon
                return (
                  <IconButton
                    key={cmd}
                    size="small"
                    onClick={() => onFormatText(cmd)}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                      bgcolor: activeFormats[cmd] ? "#ddd" : "transparent"
                    }}
                  >
                    <Icon fontSize="small" sx={{ color: "#000" }} />
                  </IconButton>
                )
              })}
              <IconButton
                size="small"
                onClick={onClearText}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ClearIcon fontSize="small" sx={{ color: "#000" }} />
              </IconButton>
            </>
          )}

          <IconButton
            size="small"
            onClick={onToggleMode}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isDrawing ? (
              <BrushIcon sx={{ color: "#000" }} />
            ) : (
              <EditIcon sx={{ color: "#000" }} />
            )}
          </IconButton>

          <IconButton
            size="small"
            onClick={(e) => onCategoryMenuOpen(e.currentTarget)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Box
              sx={{
                color: "#000",
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: selectedCategory || "#fff59d",
                border: "1px solid #333"
              }}
            />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleDeleteClick}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DeleteIcon fontSize="small" sx={{ color: "#000" }} />
          </IconButton>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCancel}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            PaperProps={{ sx: { p: 2 } }}
          >
            <Typography variant="body2" gutterBottom>
              {MESSAGES.POPOVER.CONFIRM_DELETE_NOTE}
            </Typography>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={handleConfirm}
              >
                Delete
              </Button>
            </Box>
          </Popover>
        </Box>
      )}
    </Box>
  )
}

export default NoteToolBar
