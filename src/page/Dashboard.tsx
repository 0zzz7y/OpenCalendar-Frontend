import CalendarEditor from "@/component/calendar/CalendarEditor"
import CalendarPanel from "@/component/calendar/CalendarPanel"
import CalendarSelector from "@/component/calendar/CalendarSelector"
import MonthlyCalendar from "@/component/calendar/MonthlyCalendar"
import CategoryEditor from "@/component/category/CategoryEditor"
import CategorySelector from "@/component/category/CategorySelector"
import NotesPanel from "@/component/note/NotesPanel"
import TasksPanel from "@/component/task/TasksPanel"
import ThemeToggleButton from "@/theme/ThemeToggleButton"

import { Box } from "@mui/material"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"

const panelStyle = {
  border: "2px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  margin: "10px 5px"
}

const Dashboard = () => {
  return (
    <PanelGroup direction="horizontal" style={{ height: "100vh", width: "100%" }}>
      {/* Left Panel */}
      <Panel defaultSize={16}>
        <PanelGroup direction="vertical" style={{ height: "100%", width: "100%" }}>
          {/* Calendar and Category Section */}
          <Panel style={panelStyle}>
            <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
              <Box display="flex" flexDirection="column" gap={2}>
                <CalendarSelector />
                <CategorySelector />
              </Box>
            </Box>
          </Panel>

          <PanelResizeHandle />

          {/* Monthly Calendar */}
          <Panel defaultSize={30} style={{ ...panelStyle, minHeight: "150px", position: "relative", margin: "5px 5px" }}>
            <Box sx={{ alignSelf: "flex-start", mt: "-16px", ml: "-24px" }}>
              <MonthlyCalendar />
            </Box>
          </Panel>

          <PanelResizeHandle />

          {/* Notes Section */}
          <Panel defaultSize={58.5} style={{ ...panelStyle, margin: "10px 5px", padding: 0 }}>
            <Box display="flex" flexDirection="column" height="100%" position="relative">
              <Box flexGrow={1} overflow="auto">
                <NotesPanel />
              </Box>
              <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 1.5, width: "100%" }}>
                <ThemeToggleButton />
              </Box>
            </Box>
          </Panel>
        </PanelGroup>
      </Panel>

      <PanelResizeHandle />

      {/* Center Panel */}
      <Panel style={{ ...panelStyle, margin: "10px 5px" }}>
        <CalendarPanel />
      </Panel>

      <PanelResizeHandle />

      {/* Right Panel */}
      <Panel defaultSize={26}>
        <Box display="flex" flexDirection="column" height="100%" sx={{ ...panelStyle, m: "10px 10px 5px 5px" }}>
          <Box flexGrow={1} overflow="auto">
            <TasksPanel />
          </Box>
        </Box>
      </Panel>
    </PanelGroup>
  )
}

export default Dashboard
