import {
  Box,
  IconButton,
  Select,
  MenuItem
} from "@mui/material";
import BrushIcon from "@mui/icons-material/Brush";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";

// Dodano obsługę rozmycia do zapisania notatki

interface NoteToolbarProperties {
  isCollapsed: boolean;
  isDrawing: boolean;
  onToggleCollapse: () => void;
  onToggleMode: () => void;
  onClearCanvas: () => void;
  onClearText: () => void;
  onDelete: () => void;
  onFormatText: (command: "bold" | "italic" | "underline") => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  activeFormats: { bold: boolean; italic: boolean; underline: boolean };
  selectedCategory: string | null;
  onCategoryMenuOpen: (anchor: HTMLElement) => void;
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
  onCategoryMenuOpen
}: NoteToolbarProperties) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      bgcolor="rgba(255,255,255,0.4)"
      p={0.5}
    >
      <IconButton size="small" onClick={onToggleCollapse}>
        {isCollapsed ? (
          <ChevronRightIcon
            fontSize="small"
            sx={{ color: "#000", transform: "rotate(270deg)" }}
          />
        ) : (
          <ExpandMoreIcon fontSize="small" sx={{ color: "#000" }} />
        )}
      </IconButton>

      <Box display="flex" gap={0.5} alignItems="center">
        {isDrawing ? (
          <>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
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
            >
              {[1, 2, 4, 8, 12].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px
                </MenuItem>
              ))}
            </Select>
            <IconButton size="small" onClick={onClearCanvas}>
              <ClearIcon fontSize="small" sx={{ color: "#000" }} />
            </IconButton>
          </>
        ) : (
          <>
            {["bold", "italic", "underline"].map((cmd) => {
              const Icon =
                cmd === "bold"
                  ? FormatBoldIcon
                  : cmd === "italic"
                    ? FormatItalicIcon
                    : FormatUnderlinedIcon;
              return (
                <IconButton
                  key={cmd}
                  size="small"
                  onClick={() => onFormatText(cmd as any)}
                  sx={{
                    bgcolor: activeFormats[cmd as keyof typeof activeFormats]
                      ? "#ddd"
                      : "transparent"
                  }}
                >
                  <Icon fontSize="small" sx={{ color: "#000" }} />
                </IconButton>
              );
            })}
            <IconButton size="small" onClick={onClearText}>
              <ClearIcon fontSize="small" sx={{ color: "#000" }} />
            </IconButton>
          </>
        )}

        <IconButton size="small" onClick={onToggleMode}>
          {isDrawing ? (
            <BrushIcon sx={{ color: "#000" }} />
          ) : (
            <EditIcon sx={{ color: "#000" }} />
          )}
        </IconButton>

        <IconButton
          size="small"
          onClick={(e) => onCategoryMenuOpen(e.currentTarget)}
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

        <IconButton size="small" onClick={onDelete}>
          <DeleteIcon fontSize="small" sx={{ color: "#000" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NoteToolBar;
