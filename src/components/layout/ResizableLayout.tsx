// src/layouts/resizable/ResizableLayout.tsx
import React, { useState, useRef, useEffect, ReactNode } from "react"
import { Box, Paper } from "@mui/material"
import styles from "./ResizableLayout.module.css"

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
  initialLeftWidth = 250,
  initialRightWidth = 350,
  centerMinWidth = 200,
}: ResizableLayoutProperties) => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(initialLeftWidth)
  const [rightPanelWidth, setRightPanelWidth] = useState(initialRightWidth)
  const [showLeftPanelContent, setShowLeftPanelContent] = useState(true)

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
    const startX = e.clientX
    const startWidth = panel === "left" ? leftPanelWidth : rightPanelWidth

    document.body.style.userSelect = "none"

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX

      if (panel === "left") {
        const newWidth = Math.max(startWidth + delta, 6)
        const maxWidth = window.innerWidth - rightPanelWidth - centerMinWidth
        setLeftPanelWidth(Math.min(newWidth, maxWidth))
      }

      if (panel === "right") {
        const newWidth = Math.max(startWidth - delta, 6)
        const maxWidth = window.innerWidth - leftPanelWidth - centerMinWidth
        setRightPanelWidth(Math.min(newWidth, maxWidth))
      }
    }

    const onMouseUp = () => {
      document.body.style.userSelect = ""

      const totalWidth = leftPanelWidth + rightPanelWidth + centerMinWidth
      const overflow = totalWidth - window.innerWidth

      if (overflow > 0) {
        if (panel === "right") {
          setRightPanelWidth((prev) => Math.max(100, prev - overflow))
        } else {
          setLeftPanelWidth((prev) => Math.max(100, prev - overflow))
        }
      }

      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.sidePanel} style={{ width: leftPanelWidth }} ref={leftPanelRef}>
        <Paper elevation={1} className={styles.paper}>
          {showLeftPanelContent && leftPanel}
        </Paper>
      </Box>

      <div className={styles.resizer} style={{ left: `${leftPanelWidth - 6}px` }} onMouseDown={(e) => handleResize(e, "left")} />

      <Box className={styles.centerPanel}>
        <Paper elevation={1} className={styles.paper}>
          {centerPanel}
        </Paper>
      </Box>

      <div className={styles.resizer} style={{ right: `${rightPanelWidth - 6}px` }} onMouseDown={(e) => handleResize(e, "right")} />

      <Box className={styles.sidePanel} style={{ width: rightPanelWidth }}>
        <Paper elevation={1} className={styles.paper}>
          {rightPanel}
        </Paper>
      </Box>
    </Box>
  )
}

export default ResizableLayout
