import React from "react"
import { Box } from "@mui/material"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"

import CalendarSelector from "@/component/calendar/CalendarSelector"
import CalendarEditor from "@/component/calendar/CalendarEditor"
import CategorySelector from "@/component/category/CategorySelector"
import CategoryEditor from "@/component/category/CategoryEditor"
import MonthlyCalendar from "@/component/calendar/MonthlyCalendar"
import ThemeToggleButton from "@/component/theme/ThemeToggleButton"
import DraggableNotes from "@/component/note/DraggableNotes"
import TasksPanel from "@/component/task/TasksPanel"
import CenterPanel from "../component/layout/CenterPanel"
import NotesPanel from "@/component/note/NotesPanel"

const Dashboard = () => {
  return (
    <PanelGroup
      direction="horizontal"
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Left Panel */}
      <Panel>
        <PanelGroup
          direction="vertical"
          style={{ height: "100%", width: "100%" }}
        >
          {/* Calendar and Category section */}
          <Panel
            style={{
              border: "2px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              margin: "10px 5px"
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="100%"
              width="100%"
            >
              <Box display="flex" flexDirection="column" gap={2}>
                <CalendarSelector />
                <CalendarEditor />
                <CategorySelector />
                <CategoryEditor />
              </Box>
            </Box>
          </Panel>

          <PanelResizeHandle />

          {/* Monthly Calendar section */}
          <Panel
            style={{
              minHeight: "150px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              margin: "5px 5px",
              position: "relative"
            }}
          >
            <Box sx={{ alignSelf: "flex-start", mt: "-16px", ml: "-24px" }}>
              <MonthlyCalendar />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                padding: "10px",
                borderRadius: "8px",
                width: "100%"
              }}
            >
              <ThemeToggleButton />
            </Box>
          </Panel>
        </PanelGroup>
      </Panel>

      <PanelResizeHandle />

      {/* Center Panel */}
      <Panel
        style={{
          border: "2px solid #ccc",
          borderRadius: "8px",
          margin: "10px 5px"
        }}
      >
        <CenterPanel />
      </Panel>

      <PanelResizeHandle />

      {/* Right Panel */}
      <Panel>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          style={{
            border: "2px solid #ccc",
            borderRadius: "8px",
            margin: "10px 5px"
          }}
        >
          <Box height="0%">
            <NotesPanel></NotesPanel>
          </Box>

          <Box flexGrow={1} overflow="auto">
            <TasksPanel />
          </Box>
        </Box>
      </Panel>
    </PanelGroup>
  )
}

export default Dashboard
