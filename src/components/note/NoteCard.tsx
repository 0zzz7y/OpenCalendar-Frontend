import { useEffect, useRef, useState } from "react";

import { Box, Paper, Collapse, Menu, MenuItem, IconButton } from "@mui/material";

import BrushIcon from "@mui/icons-material/Brush";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";

import ConfirmDialog from "../dialog/ConfirmDialog";

interface NoteCardProperties {
  id: string;
  content: string;
  initialX?: number;
  initialY?: number;
  color?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, content: string) => void;
  onInteract?: () => void;
}

export default function NoteCard({
  id,
  initialX = 0,
  initialY = 0,
  color = "#fff59d",
  content = "",
  onDelete,
  onInteract,
}: NoteCardProperties) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragReady = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  const categories = [
    { label: "Brak", value: "", color: "#fff59d" },
    { label: "Siłownia", value: "siłownia", color: "#ffcc80" },
    { label: "Praca", value: "praca", color: "#90caf9" },
    { label: "Ogród", value: "ogród", color: "#c5e1a5" },
  ];

  const [isDrawing, setIsDrawing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [textContent, setTextContent] = useState(content);
  const [drawingDataURL, setDrawingDataURL] = useState<string | null>(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(settingsAnchorEl);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const getCategoryColor = (category: string) => {
    const match = categories.find((c) => c.value === category);
    return match?.color || color;
  };

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

  const handleConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
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
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!isFocused) return;
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [isFocused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let drawing = false;

    const startDraw = (e: MouseEvent) => {
      drawing = true;
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e: MouseEvent) => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stopDraw = () => {
      if (drawing) {
        ctx.closePath();
        setDrawingDataURL(canvas.toDataURL());
      }
      drawing = false;
    };

    canvas.addEventListener("mousedown", startDraw);
    window.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      window.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stopDraw);
    };
  }, [isDrawing, brushColor, brushSize]);

  useEffect(() => {
    if (isDrawing && drawingDataURL && canvasRef.current) {
      const img = new Image();
      img.onload = () => canvasRef.current?.getContext("2d")?.drawImage(img, 0, 0);
      img.src = drawingDataURL;
    }
  }, [isDrawing, drawingDataURL]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !lastMousePos.current) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    positionRef.current = {
      x: Math.max(0, positionRef.current.x + dx),
      y: Math.max(0, positionRef.current.y + dy),
    };

    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    }
  };

  const positionRef = useRef({ x: initialX, y: initialY });
  const [position, setPosition] = useState(positionRef.current);
  const animationFrameRef = useRef<number | null>(null);

  const updatePosition = () => {
    setPosition({ ...positionRef.current });
    animationFrameRef.current = null;
  };

  const handleDrag = (e: MouseEvent) => {
    if (!dragging || !lastMousePos.current) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    positionRef.current = {
      x: Math.max(0, positionRef.current.x + dx),
      y: Math.max(0, positionRef.current.y + dy),
    };

    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDrawing || (e.target as HTMLElement).closest("button")) return;

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

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleMouseUp);
    };
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
        pointerEvents: "auto",
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Paper
        sx={{
          width: "100%",
          backgroundColor: getCategoryColor(selectedCategory ?? color),
          borderRadius: 2,
          boxShadow: dragging ? "0 0 10px #2196f3" : 3,
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        {/* === Toolbar === */}
        <Box display="flex" justifyContent="space-between" bgcolor="rgba(255,255,255,0.4)" p={0.5}>
          <IconButton size="small" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? (
              <ChevronRightIcon fontSize="small" sx={{ transform: "rotate(270deg)" }} />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>

          <Box display="flex" gap={0.5} alignItems="center">
            {/* Drawing tools */}
            {isDrawing && (
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
                    cursor: "pointer",
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
                    handleConfirm("Czy na pewno wyczyścić rysunek?", clearCanvas);
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </>
            )}

            {/* Text tools */}
            {!isDrawing && (
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
                        contentRef.current?.focus();
                      }}
                      sx={{
                        bgcolor: activeFormats[cmd as keyof typeof activeFormats]
                          ? "#ddd"
                          : "transparent",
                      }}
                    >
                      <Icon fontSize="small" />
                    </IconButton>
                  );
                })}

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfirm("Czy na pewno wyczyścić tekst?", clearText);
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </>
            )}

            {/* Toggle edit mode */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleMode();
              }}
            >
              {isDrawing ? <BrushIcon /> : <EditIcon />}
            </IconButton>

            {/* Category selector */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setMenuAnchorEl(e.currentTarget);
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: getCategoryColor(selectedCategory ?? ""),
                  border: "1px solid #333",
                }}
              />
            </IconButton>

            {/* Delete button */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (textContent.trim() !== "" || drawingDataURL) {
                  handleConfirm("Czy na pewno usunąć notatkę?", () => onDelete?.(id));
                } else {
                  onDelete?.(id);
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* === Content === */}
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              sx={{
                height: 220,
                p: 1,
                pr: "8px",
                fontSize: 14,
                outline: "none",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {textContent}
            </Box>
          )}
        </Collapse>
      </Paper>

      {/* === Confirm dialog === */}
      <ConfirmDialog
        open={confirmOpen}
        title="Potwierdzenie"
        message={confirmMessage}
        paperProps={{ zIndex: 3000 }}
        onConfirm={() => {
          confirmAction();
          setConfirmOpen(false);
        }}
        onClose={() => setConfirmOpen(false)}
      />

      {/* === Category menu === */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
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
                mr: 1,
              }}
            />
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
