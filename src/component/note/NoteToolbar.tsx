import TOOLBAR from "@/constant/utility/toolbar"
import MESSAGES from "@/constant/ui/messages"
import FormatCommand from "@/model/utility/formatCommand"

import { useState } from "react"

import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FormatBoldIcon from "@mui/icons-material/FormatBold"
import FormatItalicIcon from "@mui/icons-material/FormatItalic"
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined"
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Button,
  TextField
} from "@mui/material"

interface NoteToolbarProperties {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onClearText: () => void
  onDelete: () => void
  onFormatText: (command: FormatCommand) => void
  activeFormats: Record<FormatCommand, boolean>
  selectedCategory: string | null
  onCategoryMenuOpen: (anchor: HTMLElement) => void
  noteName: string
  onNameChange: (newName: string) => void
  onNameBlur?: () => void
}

const NoteToolbar = ({
  isCollapsed,
  onToggleCollapse,
  onClearText,
  onDelete,
  onFormatText,
  activeFormats,
  selectedCategory,
  onCategoryMenuOpen,
  noteName,
  onNameChange,
  onNameBlur
}: NoteToolbarProperties) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleDeleteClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleConfirmDelete = () => {
    onDelete()
    setAnchorEl(null)
  }

  const handleCancelDelete = () => {
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
          onBlur={onNameBlur}
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
          {[TOOLBAR.BOLD, TOOLBAR.ITALIC, TOOLBAR.UNDERLINE].map((cmd) => {
            const Icon =
              cmd === TOOLBAR.BOLD
                ? FormatBoldIcon
                : cmd === TOOLBAR.ITALIC
                ? FormatItalicIcon
                : FormatUnderlinedIcon

            return (
              <IconButton
                key={cmd}
                size="small"
                onClick={() => onFormatText(cmd)}
                onMouseDown={(e) => e.stopPropagation()}
                sx={{ bgcolor: activeFormats[cmd] ? "#ddd" : "transparent" }}
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

          <IconButton
            size="small"
            onClick={(e) => onCategoryMenuOpen(e.currentTarget)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                bgcolor: selectedCategory || "#fff59d",
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
          {MESSAGES.CONFIRM_DELETE_NOTE}
        </Typography>
        <Box display="flex" gap={1} justifyContent="flex-end">
          <Button size="small" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default NoteToolbar
