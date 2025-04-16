import React, { ReactNode, useState } from "react";
import { Box, Paper } from "@mantine/core";
import styles from "./ResizableLayout.module.css";

interface ResizableLayoutProps {
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
  centerMinWidth = 200,
}: ResizableLayoutProps) => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(initialLeftWidth);
  const [rightPanelWidth, setRightPanelWidth] = useState(initialRightWidth);

  const handleResize = (
    e: React.MouseEvent,
    panel: "left" | "right"
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = panel === "left" ? leftPanelWidth : rightPanelWidth;

    document.body.style.userSelect = "none";

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;

      if (panel === "left") {
        const newWidth = Math.max(startWidth + delta, 6);
        const maxWidth = window.innerWidth - rightPanelWidth - centerMinWidth;
        setLeftPanelWidth(Math.min(newWidth, maxWidth));
      }

      if (panel === "right") {
        const newWidth = Math.max(startWidth - delta, 6);
        const maxWidth = window.innerWidth - leftPanelWidth - centerMinWidth;
        setRightPanelWidth(Math.min(newWidth, maxWidth));
      }
    };

    const onMouseUp = () => {
      document.body.style.userSelect = "";

      const totalWidth = leftPanelWidth + rightPanelWidth + centerMinWidth;
      const overflow = totalWidth - window.innerWidth;

      if (overflow > 0) {
        if (panel === "right") {
          setRightPanelWidth((prev) => Math.max(100, prev - overflow));
        } else {
          setLeftPanelWidth((prev) => Math.max(100, prev - overflow));
        }
      }

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.sidePanel} style={{ width: leftPanelWidth }}>
        <Paper withBorder p="md" className={styles.paper}>
          {leftPanel}
        </Paper>
      </Box>

      <div
        className={styles.resizer}
        style={{ left: `${leftPanelWidth - 6}px` }}
        onMouseDown={(e) => handleResize(e, "left")}
      />

      <Box className={styles.centerPanel}>
        <Paper withBorder p="md" className={styles.paper}>
          {centerPanel}
        </Paper>
      </Box>

      <div
        className={styles.resizer}
        style={{ right: `${rightPanelWidth - 6}px` }}
        onMouseDown={(e) => handleResize(e, "right")}
      />

      <Box className={styles.sidePanel} style={{ width: rightPanelWidth }}>
        <Paper withBorder p="md" className={styles.paper}>
          {rightPanel}
        </Paper>
      </Box>
    </Box>
  );
};

export default ResizableLayout;