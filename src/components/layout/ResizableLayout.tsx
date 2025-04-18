import React, { useState, useRef, useEffect, ReactNode } from "react";
import { Box, Paper } from "@mui/material";

interface ResizableLayoutProperties {
  leftPanel?: ReactNode;
  centerPanel: ReactNode;
  rightPanel?: ReactNode;
  initialLeftWidth?: number;
  initialRightWidth?: number;
  centerMinWidth?: number;
}

const ResizableLayout = ({
  leftPanel,
  centerPanel,
  rightPanel,
  initialLeftWidth = 250,
  initialRightWidth = 350,
  centerMinWidth = 200
}: ResizableLayoutProperties) => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(initialLeftWidth);
  const [rightPanelWidth, setRightPanelWidth] = useState(initialRightWidth);
  const [showLeftPanelContent, setShowLeftPanelContent] = useState(true);
  const [isDragging, setIsDragging] = useState<"left" | "right" | null>(null);

  const leftPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = leftPanelRef.current?.offsetWidth || 0;
      console.log("Left panel resized to:", width);
      setShowLeftPanelContent(width > 50);
    };

    const observer = new ResizeObserver(handleResize);
    if (leftPanelRef.current) observer.observe(leftPanelRef.current);

    return () => observer.disconnect();
  }, []);

  const handleResize = (e: React.MouseEvent, panel: "left" | "right") => {
    e.preventDefault();
    setIsDragging(panel);
    const startX = e.clientX;
    const startWidth = panel === "left" ? leftPanelWidth : rightPanelWidth;

    document.body.style.userSelect = "none";

    console.log(
      "Start resizing",
      panel,
      "at",
      startX,
      "with width",
      startWidth
    );

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;

      if (panel === "left") {
        const newWidth = Math.max(startWidth + delta, 24);
        const maxWidth = window.innerWidth - rightPanelWidth - centerMinWidth;
        console.log("Dragging left panel to:", newWidth);
        setLeftPanelWidth(Math.min(newWidth, maxWidth));
      }

      if (panel === "right") {
        const newWidth = Math.max(startWidth - delta, 24);
        const maxWidth = startWidth - delta;
        console.log("Dragging right panel to:", newWidth);
        setRightPanelWidth(Math.min(newWidth, maxWidth));
      }
    };

    const onMouseUp = () => {
      setIsDragging(null);
      document.body.style.userSelect = "";

      const totalWidth = leftPanelWidth + rightPanelWidth + centerMinWidth;
      const overflow = totalWidth - window.innerWidth;

      if (overflow > 0) {
        if (panel === "right") {
          console.log("Adjusting right panel for overflow:", overflow);
          setRightPanelWidth((prev) => Math.max(100, prev - overflow));
        } else {
          console.log("Adjusting left panel for overflow:", overflow);
          setLeftPanelWidth((prev) => Math.max(100, prev - overflow));
        }
      }

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const themeTransition = "all 0.5s ease";
  const dragTransition = isDragging ? "all 0.2s ease" : "all 0.5s ease";

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        transition: themeTransition,
        backgroundColor: "background.default"
      }}
    >
      <Box
        ref={leftPanelRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 50,
          backgroundColor: "background.default",
          width: leftPanelWidth,
          zIndex: 1,
          transition: dragTransition
        }}
      >
        <Paper
          elevation={1}
          sx={{
            height: "100%",
            overflow: "hidden",
            p: 2,
            backgroundColor: "inherit",
            transition: themeTransition
          }}
        >
          {showLeftPanelContent && leftPanel}
        </Paper>
      </Box>

      <Box
        onMouseDown={(e) => handleResize(e, "left")}
        sx={{
          position: "absolute",
          top: 0,
          left: leftPanelWidth - 24,
          bottom: 0,
          width: 12,
          cursor: "col-resize",
          zIndex: 10,
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent"
          }
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: centerMinWidth,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.default",
          zIndex: 1,
          transition: dragTransition
        }}
      >
        <Paper
          elevation={1}
          sx={{
            height: "100%",
            overflow: "hidden",
            p: 2,
            backgroundColor: "inherit",
            transition: themeTransition
          }}
        >
          {centerPanel}
        </Paper>
      </Box>

      <Box
        onMouseDown={(e) => handleResize(e, "right")}
        sx={{
          position: "absolute",
          top: 0,
          right: rightPanelWidth - 24,
          bottom: 0,
          width: 12,
          cursor: "col-resize",
          zIndex: 10,
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent"
          }
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 50,
          backgroundColor: "background.default",
          width: rightPanelWidth,
          zIndex: 1,
          transition: dragTransition
        }}
      >
        <Paper
          elevation={1}
          sx={{
            height: "100%",
            overflow: "hidden",
            p: 2,
            backgroundColor: "inherit",
            transition: themeTransition
          }}
        >
          {rightPanel}
        </Paper>
      </Box>
    </Box>
  );
};

export default ResizableLayout;
