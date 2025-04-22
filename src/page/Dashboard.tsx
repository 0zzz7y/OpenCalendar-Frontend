import CalendarEditor from "@/component/calendar/CalendarEditor"
import CalendarPanel from "@/component/calendar/CalendarPanel"
import CalendarSelector from "@/component/calendar/CalendarSelector"
import MonthlyCalendar from "@/component/calendar/MonthlyCalendar"
import CategoryEditor from "@/component/category/CategoryEditor"
import CategorySelector from "@/component/category/CategorySelector"
import NotesPanel from "@/component/note/NotesPanel"
import TasksPanel from "@/component/task/TasksPanel"
import ThemeToggleButton from "@/component/theme/ThemeToggleButton"

import { Box } from "@mui/material"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"

const Dashboard = () => {
  return (
    <PanelGroup
      direction="horizontal"
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Left Panel */}
      <Panel defaultSize={16}>
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
            defaultSize={30}
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
          </Panel>

          <PanelResizeHandle />

          {/* Notes section */}
          <Panel
            defaultSize={58.5}
            style={{
              border: "2px solid #ccc",
              borderRadius: "8px",
              margin: "10px 5px"
            }}
          >
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
              <Box flexGrow={1} overflow="auto">
                <NotesPanel />
              </Box>
              <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                padding: "10px",
                borderRadius: "8px",
                width: "100%",
                margin: "5px 0 "
              }}
            >
              <ThemeToggleButton />
            </Box>
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
        <CalendarPanel />
      </Panel>

      <PanelResizeHandle />

      {/* Right Panel */}
      <Panel defaultSize={26}>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          style={{
            border: "2px solid #ccc",
            borderRadius: "8px",
            margin: "10px 10px 5px 5px"
          }}
        >
          <Box flexGrow={1} overflow="auto">
            <TasksPanel />
          </Box>
        </Box>
      </Panel>
    </PanelGroup>
  )
}

export default Dashboard
