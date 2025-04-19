import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Collapse,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Button
} from "@mui/material";

import NoteToolbar, { FormatCommand } from "./NoteToolbar";
import Note from "../../types/note";
import Category from "../../types/category";

import MESSAGES from "@/constants/messages";

export interface NoteCardProperties {
  id: string;
  content: string;
  initialX?: number;
  initialY?: number;
  color?: string;
  categories: Category[];
  onDelete?: (id: string) => void;
  onUpdate?: (note: Note) => void;
  calendarId?: string;
  name?: string;
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
  name = ""
}: NoteCardProperties) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef({ x: initialX, y: initialY });
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dragReady = useRef(false);

  const [position, setPosition] = useState(positionRef.current);
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingDataURL, setDrawingDataURL] = useState<string | null>(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [confirmAnchorEl, setConfirmAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFormats, setActiveFormats] = useState<Record<FormatCommand, boolean>>({
    bold: false,
    italic: false,
    underline: false
  });

  const getCategoryColor = (categoryId: string | null) =>
    categories.find((c) => c.id === categoryId)?.color || color;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDrawingDataURL(null);
    }
  };

  const clearText = () => {
    if (contentRef.current) contentRef.current.innerText = "";
  };

  const toggleMode = () => {
    setIsDrawing((prev) => !prev);
  };

  const formatText = (command: FormatCommand) => {
    contentRef.current?.focus();
    document.execCommand(command);
  
    setActiveFormats((prev) => ({
      ...prev,
      [command]: !prev[command]
    }));
  };
  

  const handleMouseDown = (e: React.MouseEvent) => {
    if (toolbarRef.current && toolbarRef.current.contains(e.target as Node)) {
      dragReady.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      setDragging(true);
    }
  };

  const handleMouseUp = () => {
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

  const handleBlur = () => {
    if (onUpdate) {
      onUpdate({
        id,
        name,
        description: contentRef.current?.innerText || "",
        categoryId: selectedCategory || "",
        calendarId: calendarId || ""
      });
    }
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drawing = false;

    const handleMouseDown = (e: MouseEvent) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.stroke();
    };

    const handleMouseUp = () => {
      drawing = false;
      ctx.closePath();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [brushColor, brushSize]);

  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        id,
        name,
        description: contentRef.current?.innerText || "",
        categoryId: selectedCategory || "",
        calendarId: calendarId || ""
      });
    }
  }, [selectedCategory]);

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
          backgroundColor: getCategoryColor(selectedCategory),
          borderRadius: 2,
          boxShadow: dragging ? "0 0 10px #2196f3" : 3,
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "default"
        }}
      >
        <Box ref={toolbarRef}>
          <NoteToolbar
            isCollapsed={collapsed}
            isDrawing={isDrawing}
            onToggleCollapse={() => setCollapsed((c) => !c)}
            onToggleMode={toggleMode}
            onClearCanvas={() => handleConfirm("Clear drawing?", clearCanvas)}
            onClearText={() => handleConfirm("Clear text?", clearText)}
            onDelete={() =>
              (contentRef.current?.innerText.trim() || drawingDataURL)
                ? handleConfirm("Delete note?", () => onDelete?.(id))
                : onDelete?.(id)
            }
            onFormatText={formatText}
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            activeFormats={activeFormats}
            selectedCategory={selectedCategory}
            onCategoryMenuOpen={(e: any) => setMenuAnchorEl(e)}
          />
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
              onBlur={handleBlur}
              sx={{
                height: 220,
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
        {categories.map(({ id, name, color }) => (
          <MenuItem
            key={id}
            selected={selectedCategory === id}
            onClick={() => {
              setSelectedCategory(id);
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
                backgroundColor: color,
                mr: 1
              }}
            />
            {name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default NoteCard;
