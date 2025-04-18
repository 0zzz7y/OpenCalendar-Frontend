import { useEffect, useRef, useState } from "react";

import {
  Box,
  Paper,
  Collapse,
  Menu,
  MenuItem,
  IconButton,
  Popover,
  Typography,
  Button
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

import Note from "../../types/note";

export interface NoteCardProperties {
  id: string;
  content: string;
  initialX?: number;
  initialY?: number;
  color?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (note: Note) => void;
}

const NoteCard = ({
  id,
  initialX = 0,
  initialY = 0,
  color = "#fff59d",
  content = "",
  onDelete
}: NoteCardProperties) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef({ x: initialX, y: initialY });
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragReady = useRef(false);

  const [position, setPosition] = useState(positionRef.current);
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [textContent, setTextContent] = useState(content);
  const [drawingDataURL, setDrawingDataURL] = useState<string | null>(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [confirmAnchorEl, setConfirmAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  const categories = [
    { label: "Brak", value: "", color: "#fff59d" },
    { label: "Siłownia", value: "siłownia", color: "#ffcc80" },
    { label: "Praca", value: "praca", color: "#90caf9" },
    { label: "Ogród", value: "ogród", color: "#c5e1a5" }
  ];

  const getCategoryColor = (category: string) =>
    categories.find((c) => c.value === category)?.color || color;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDrawingDataURL(null);
    }
  };

  const clearText = () => {
    setTextContent("");
    if (contentRef.current) contentRef.current.innerText = "";
  };

  const toggleMode = () => {
    if (isDrawing && canvasRef.current) {
      setDrawingDataURL(canvasRef.current.toDataURL());
    } else if (contentRef.current) {
      setTextContent(contentRef.current.innerText);
    }
    setIsDrawing((prev) => !prev);
  };

  const formatText = (command: "bold" | "italic" | "underline") => {
    document.execCommand(command);
    setActiveFormats((prev) => ({ ...prev, [command]: !prev[command] }));
    contentRef.current?.focus();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDrawing) return;
    dragReady.current = false;
    holdTimeout.current = setTimeout(() => {
      dragReady.current = true;
      setDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }, 100);
  };

  const handleMouseUp = () => {
    clearTimeout(holdTimeout.current!);
    setDragging(false);
    dragReady.current = false;
    lastMousePos.current = null;
  };

  const handleDrag = (e: MouseEvent) => {
    if (!dragging || !lastMousePos.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    positionRef.current = {
      x: Math.max(0, positionRef.current.x + dx),
      y: Math.max(0, positionRef.current.y + dy)
    };
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(() => {
        setPosition({ ...positionRef.current });
        animationFrameRef.current = null;
      });
    }
  };

  const handleConfirm = (message: string, action: () => void) => {
    setConfirmAction(() => action);
    setConfirmOpen(true);
    setConfirmAnchorEl(wrapperRef.current);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setConfirmAnchorEl(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging]);

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: 300,
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
          backgroundColor: getCategoryColor(selectedCategory ?? color),
          borderRadius: 2,
          boxShadow: dragging ? "0 0 10px #2196f3" : 3,
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "grab"
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          bgcolor="rgba(255,255,255,0.4)"
          p={0.5}
        >
          <IconButton size="small" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? (
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
                <select
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  style={{ height: 24, fontSize: "12px", cursor: "pointer" }}
                >
                  {[1, 2, 4, 8, 12].map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirm("Clear drawing?", clearCanvas);
                  }}
                >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        formatText(cmd as "bold" | "italic" | "underline");
                      }}
                      sx={{
                        bgcolor: activeFormats[
                          cmd as keyof typeof activeFormats
                        ]
                          ? "#ddd"
                          : "transparent"
                      }}
                    >
                      <Icon fontSize="small" sx={{ color: "#000" }} />
                    </IconButton>
                  );
                })}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirm("Clear text?", clearText);
                  }}
                >
                  <ClearIcon fontSize="small" sx={{ color: "#000" }} />
                </IconButton>
              </>
            )}

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleMode();
              }}
            >
              {isDrawing ? (
                <BrushIcon sx={{ color: "#000" }} />
              ) : (
                <EditIcon sx={{ color: "#000" }} />
              )}
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setMenuAnchorEl(e.currentTarget);
              }}
            >
              <Box
                sx={{
                  color: "#000",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: getCategoryColor(selectedCategory ?? ""),
                  border: "1px solid #333"
                }}
              />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (textContent.trim() !== "" || drawingDataURL) {
                  handleConfirm("Delete note?", () => onDelete?.(id));
                } else {
                  onDelete?.(id);
                }
              }}
            >
              <DeleteIcon fontSize="small" sx={{ color: "#000" }} />
            </IconButton>
          </Box>
        </Box>

        <Collapse in={!collapsed}>
          {isDrawing ? (
            <canvas
              ref={canvasRef}
              width={300}
              height={220}
              style={{ display: "block", cursor: "crosshair" }}
            />
          ) : (
            <Box
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              sx={{
                height: 220,
                p: 1,
                pr: "8px",
                fontSize: 14,
                outline: "none",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "#000" // zawsze czarny tekst
              }}
            >
              {textContent}
            </Box>
          )}
        </Collapse>
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
          Are you sure?
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
              confirmAction();
              handleConfirmClose();
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
        {categories.map(({ label, value }) => (
          <MenuItem
            key={value}
            selected={selectedCategory === value}
            onClick={() => {
              setSelectedCategory(value);
              setMenuAnchorEl(null);
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: getCategoryColor(value),
                mr: 1
              }}
            />
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default NoteCard;
