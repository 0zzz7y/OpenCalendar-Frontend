import { Box, IconButton, Paper, Collapse } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BrushIcon from "@mui/icons-material/Brush";
import { useEffect, useRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { Category } from "../../types/models";

interface NoteCardProps {
  id: string;
  initialX?: number;
  initialY?: number;
  color?: string;
  defaultText?: string;
  onDelete?: () => void;
  onInteract?: () => void;
}

export default function NoteCard({
  id,
  initialX = 0,
  initialY = 0,
  color = "#fff59d",
  defaultText = "",
  onDelete,
  onInteract,
}: NoteCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [textContent, setTextContent] = useState(defaultText);
  const [drawingDataURL, setDrawingDataURL] = useState<string | null>(null);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);

  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragReady = useRef(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDrawingDataURL(null);
    }
  };
  const handleConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };
  const clearText = () => {
    setTextContent("");
    if (contentRef.current) contentRef.current.innerText = "";
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });
    };
  
    document.addEventListener("selectionchange", handleSelectionChange);
  
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  // === Płynne rysowanie ===
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

  // Wczytaj zapisany rysunek
  useEffect(() => {
    if (isDrawing && drawingDataURL && canvasRef.current) {
      const img = new Image();
      img.onload = () => canvasRef.current?.getContext("2d")?.drawImage(img, 0, 0);
      img.src = drawingDataURL;
    }
  }, [isDrawing, drawingDataURL]);

  const toggleMode = () => {
    if (isDrawing && canvasRef.current) {
      setDrawingDataURL(canvasRef.current.toDataURL());
    } else if (contentRef.current) {
      setTextContent(contentRef.current.innerText);
    }
    setIsDrawing((prev) => !prev);
  };

  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDrawing || (e.target as HTMLElement).closest("button")) return;
  
    dragReady.current = false;
    holdTimeout.current = setTimeout(() => {
      dragReady.current = true;
      setDragging(true);
      onInteract?.();
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }, 100); // skrócony czas reakcji
  };
  
  const handleMouseUp = () => {
    clearTimeout(holdTimeout.current!);
    setDragging(false);
    dragReady.current = false;
    lastMousePos.current = null;
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !lastMousePos.current) return;
  
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  
    setPosition((pos) => ({
      x: Math.max(0, pos.x + dx),
      y: Math.max(0, pos.y + dy)
    }));
  };
  

  const formatText = (command: "bold" | "italic" | "underline") => {
    document.execCommand(command);
    setActiveFormats((prev) => ({ ...prev, [command]: !prev[command] }));
  };
  
  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: 240,
        userSelect: "none",
        zIndex: dragging ? 1000 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Paper
        sx={{
          width: "100%",
          backgroundColor: color,
          borderRadius: 2,
          boxShadow: dragging ? "0 0 10px #2196f3" : 3,
          overflow: "hidden",
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: "rgba(255,255,255,0.4)", p: "2px" }}>
          <IconButton size="small" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? "🔽" : "🔼"}
          </IconButton>
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            {isDrawing && (
              <>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  style={{ width: 24, height: 24, border: "none", padding: 0, background: "none", cursor: "pointer" }}
                />
                <select
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  style={{ height: 24, fontSize: "12px", cursor: "pointer" }}
                >
                  <option value={1}>1px</option>
                  <option value={2}>2px</option>
                  <option value={4}>4px</option>
                  <option value={8}>8px</option>
                  <option value={12}>12px</option>
                </select>
                <IconButton size="small" onClick={(e) => { 
  e.stopPropagation(); 
  handleConfirm("Czy na pewno wyczyścić rysunek?", clearCanvas);
}}>
  <ClearIcon fontSize="small" />
</IconButton>
              </>
            )}
{!isDrawing && (
  <>
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        formatText("bold");
      }}
      sx={{ bgcolor: activeFormats.bold ? "#ddd" : "transparent" }}
    >
      <FormatBoldIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        formatText("italic");
      }}
      sx={{ bgcolor: activeFormats.italic ? "#ddd" : "transparent" }}
    >
      <FormatItalicIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        formatText("underline");
      }}
      sx={{ bgcolor: activeFormats.underline ? "#ddd" : "transparent" }}
    >
      <FormatUnderlinedIcon fontSize="small" />
    </IconButton>
    <IconButton size="small" onClick={(e) => { 
  e.stopPropagation(); 
  handleConfirm("Czy na pewno wyczyścić tekst?", clearText);
}}>
  <ClearIcon fontSize="small" />
</IconButton>
  </>
)}

            <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleMode(); }}>
              {isDrawing ? <EditIcon /> : <BrushIcon />}
            </IconButton>
            <IconButton size="small" onClick={(e) => { 
  e.stopPropagation(); 
  handleConfirm("Czy na pewno usunąć notatkę?", () => onDelete?.());
}}>
  <DeleteIcon fontSize="small" />
</IconButton>
          </Box>
        </Box>


        <Collapse in={!collapsed}>
          {isDrawing ? (
            <canvas ref={canvasRef} width={240} height={220} style={{ display: "block", cursor: "crosshair" }} />
          ) : (
            <Box
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              sx={{
                height: 220,
                p: 1,
                pr: "8px",
                fontSize: "14px",
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
      <ConfirmDialog 
  open={confirmOpen}
  title="Potwierdzenie"
  message={confirmMessage}
  onConfirm={() => {
    confirmAction();
    setConfirmOpen(false);
  }}
  onClose={() => setConfirmOpen(false)}
/>
    </Box>

  );
}
