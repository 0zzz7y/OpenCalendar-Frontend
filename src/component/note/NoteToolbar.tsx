import type React from "react";
import { useState, useCallback } from "react";
import { Box, IconButton, Popover, Typography, Button, TextField } from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { FormatBold as FormatBoldIcon, FormatItalic as FormatItalicIcon, FormatUnderlined as FormatUnderlinedIcon } from "@mui/icons-material";

import TOOLBAR from "@/constant/utility/toolbar";
import MESSAGES from "@/constant/ui/messages";
import type FormatCommand from "@/model/utility/formatCommand";
import BUTTONS from "@/constant/ui/buttons";

export interface NoteToolbarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClearText: () => void;
  onDelete: () => void;
  onFormatText: (command: FormatCommand) => void;
  activeFormats: Record<FormatCommand, boolean>;
  selectedCategory: string | null;
  onCategoryMenuOpen: (anchor: HTMLElement) => void;
  noteName: string;
  onNameChange: (newName: string) => void;
  onNameBlur?: () => void;
}

/**
 * Toolbar for note formatting and actions within a NoteCard.
 */
const NoteToolbar: React.FC<NoteToolbarProps> = ({
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
  onNameBlur,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleDeleteClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete();
    setAnchorEl(null);
  }, [onDelete]);

  const handleCancelDelete = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="rgba(255,255,255,0.4)"
      p={0.5}
      sx={{ cursor: "move", userSelect: "none" }}
      onMouseDown={(e) => e.stopPropagation()}
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
          placeholder={MESSAGES.NEW_NOTE}
          value={noteName}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={onNameBlur}
          variant="outlined"
          size="small"
          sx={{ ml: 1, width: 140, "& .MuiInputBase-input": { fontSize: 14, fontWeight: 500 } }}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </Box>

      {!isCollapsed && (
        <Box display="flex" gap={0.5} alignItems="center">
          {([TOOLBAR.BOLD, TOOLBAR.ITALIC, TOOLBAR.UNDERLINE] as FormatCommand[]).map((cmd) => {
            const Icon =
              cmd === TOOLBAR.BOLD ? FormatBoldIcon :
              cmd === TOOLBAR.ITALIC ? FormatItalicIcon :
              FormatUnderlinedIcon;
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
            );
          })}

          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClearText(); }}>
            <ClearIcon fontSize="small" />
          </IconButton>

          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onCategoryMenuOpen(e.currentTarget); }}>
            <Box
              width={14}
              height={14}
              borderRadius="50%"
              bgcolor={selectedCategory || "#fff"}
              border="1px solid #333"
            />
          </IconButton>

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
          {MESSAGES.CONFIRM_DELETE_NOTE}
        </Typography>
        <Box display="flex" gap={1} justifyContent="flex-end">
          <Button size="small" onClick={handleCancelDelete}>
            {BUTTONS.CANCEL}
          </Button>
          <Button size="small" variant="contained" color="error" onClick={handleConfirmDelete}>
            {BUTTONS.DELETE}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}
