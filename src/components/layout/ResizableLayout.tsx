import React, { useState, useRef, useEffect, ReactNode } from "react"
import { Box, Paper } from "@mui/material"

interface ResizableLayoutProperties {
  leftPanel?: ReactNode
  centerPanel: ReactNode
  rightPanel?: ReactNode
  initialLeftWidth?: number
  initialRightWidth?: number
  centerMinWidth?: number
}

const ResizableLayout = ({
  leftPanel,
  centerPanel,
  rightPanel,
  initialLeftWidth = 300,
  initialRightWidth = 800,
  centerMinWidth = 200
}: ResizableLayoutProperties) => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(initialLeftWidth)
  const [rightPanelWidth, setRightPanelWidth] = useState(initialRightWidth)
  const [showLeftPanelContent, setShowLeftPanelContent] = useState(true)
  const [isDragging, setIsDragging] = useState<"left" | "right" | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      const width = leftPanelRef.current?.offsetWidth || 0
      setShowLeftPanelContent(width > 50)
    }

    const observer = new ResizeObserver(handleResize)
    if (leftPanelRef.current) observer.observe(leftPanelRef.current)

    return () => observer.disconnect()
  }, [])

  const handleResize = (e: React.MouseEvent, panel: "left" | "right") => {
    e.preventDefault()
    setIsDragging(panel)

    const startX = e.clientX
    const startLeftWidth = leftPanelWidth
    const startRightWidth = rightPanelWidth
    const containerWidth =
      containerRef.current?.offsetWidth || window.innerWidth

    document.body.style.userSelect = "none"
    document.body.style.cursor = "col-resize"

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX

      if (panel === "left") {
        const newLeftWidth = Math.max(startLeftWidth + delta, 50)
        const maxLeftWidth = containerWidth - rightPanelWidth - centerMinWidth
        setLeftPanelWidth(Math.min(newLeftWidth, maxLeftWidth))
      }

      if (panel === "right") {
        const newRightWidth = Math.max(startRightWidth - delta, 50)
        const maxRightWidth = containerWidth - leftPanelWidth - centerMinWidth
        setRightPanelWidth(Math.min(newRightWidth, maxRightWidth))
      }
    }

    const onMouseUp = () => {
      setIsDragging(null)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  const themeTransition = "all 0.5s ease"
  const dragTransition = isDragging ? "none" : themeTransition

  return (
    <Box
      ref={containerRef}
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
          left: leftPanelWidth,
          bottom: 0,
          width: 12,
          transform: "translateX(-50%)",
          cursor: "col-resize",
          zIndex: 10,
          backgroundColor: "transparent",
          transition: dragTransition,
          pointerEvents: "auto"
        }}
      >
        <Box
          sx={{
            width: 8,
            height: "100%",
            backgroundColor: "#bbb",
            margin: "0 auto",
            borderRadius: "4px"
          }}
        />
      </Box>

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
          right: rightPanelWidth,
          bottom: 0,
          width: 12,
          transform: "translateX(50%)",
          cursor: "col-resize",
          zIndex: 10,
          backgroundColor: "transparent",
          transition: dragTransition,
          pointerEvents: "auto"
        }}
      >
        <Box
          sx={{
            width: 8,
            height: "100%",
            backgroundColor: "#bbb",
            margin: "0 auto",
            borderRadius: "4px"
          }}
        />
      </Box>

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
  )
}

export default ResizableLayout
