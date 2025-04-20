import React from "react"
import { Box, Stack } from "@mui/material"
import PanelGroup from "react-resizable-panels"
import Panel from "react-resizable-panels/lib/Panel"
import PanelResizeHandle from "react-resizable-panels/lib/PanelResizeHandle"

import ThemeToggleButton from "@/component/theme/ThemeToggleButton"
import CategorySelector from "@/component/category/CategorySelector"
import CalendarSelector from "@/component/calendar/CalendarSelector"
import MonthlyCalendar from "@/component/calendar/MonthlyCalendar"

import CalendarEditor from "@/component/calendar/CalendarEditor"
import CategoryEditor from "@/component/category/CategoryEditor"

import NotesPanel from "@/component/note/NotesPanel"
import TasksPanel from "@/component/task/TasksPanel"

const LeftPanel = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
      width="100%"
    >
      <Stack spacing={2}>
        <CalendarSelector />
        <CalendarEditor />
        <CategorySelector />
        <CategoryEditor />
        <Box sx={{ alignSelf: "flex-start", mt: "-16px", ml: "-24px" }}>
          <MonthlyCalendar />
        </Box>
      </Stack>
      <Box>
        <ThemeToggleButton />
      </Box>
    </Box>
  )
}

const RightPanel = () => {
  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box height="0%">
        <NotesPanel />
      </Box>

      <Box flexGrow={1} overflow="auto">
        <TasksPanel />
      </Box>
    </Box>
  )
}

const ResizableLayout = () => {
  return (
    <PanelGroup
      direction="horizontal"
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Left Panel */}
      <Panel>
        <LeftPanel />
      </Panel>

      <PanelResizeHandle />

      {/* Center Panel */}
      <Panel>
        <PanelGroup direction="vertical" style={{ height: "100%" }}>
          {/* Top Panel */}
          <Panel>
            <Box sx={{ backgroundColor: "#f0f0f0", height: "100%" }}>
              {/* This can be any content, for example */}
              <h2>Top Content</h2>
            </Box>
          </Panel>

          <PanelResizeHandle />

          {/* Nested Horizontal Panels */}
          <Panel>
            <PanelGroup direction="horizontal" style={{ height: "100%" }}>
              {/* Left side of nested horizontal panel */}
              <Panel>
                <Box sx={{ backgroundColor: "#e0e0e0", height: "100%" }}>
                  <h3>Nested Left</h3>
                </Box>
              </Panel>

              <PanelResizeHandle />

              {/* Right side of nested horizontal panel */}
              <Panel>
                <Box sx={{ backgroundColor: "#d0d0d0", height: "100%" }}>
                  <h3>Nested Right</h3>
                </Box>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </Panel>

      <PanelResizeHandle />

      {/* Right Panel */}
      <Panel>
        <RightPanel />
      </Panel>
    </PanelGroup>
  )
}

export default ResizableLayout
