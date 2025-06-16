import { useEffect, useState } from "react"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { Box, Button } from "@mui/material"

import { CalendarSelector, CalendarPanel } from "@/component/calendar"
import { CategorySelector } from "@/component/category"
import MonthlyCalendar from "@/component/calendar/MonthlyCalendar"
import NotesPanel from "@/component/note/NotePanel"
import TasksPanel from "@/component/task/TaskPanel"
import ThemeToggleButton from "@/theme/ThemeToggleButton"
import { loadCalendars, loadCategories, loadEvents, loadTasks, loadNotes } from "@/controller"
import ViewType from "@/model/utility/viewType"
import { logout } from "@/service/authentication.service"

const panelStyle = {
  border: "2px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  margin: "10px 5px"
}

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>(CalendarView.WEEK)
  const [jumpToDate, setJumpToDate] = useState<Date | null>(null)

  const { reloadCalendars } = useCalendar()
  const { reloadCategories } = useCategory()
  const { reloadEvents } = useEvent()
  const { reloadTasks } = useTask()
  const { reloadNotes } = useNote()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    reloadCalendars()
    reloadCategories()
    reloadEvents()
    reloadTasks()
    reloadNotes()
  }, [])

  return (
    <PanelGroup direction="horizontal" style={{ height: "100vh", width: "100%" }}>
      <Panel defaultSize={18}>
        <PanelGroup direction="vertical" style={{ height: "100%", width: "100%" }}>
          <Panel defaultSize={12} style={{ ...panelStyle, minWidth: "160px", minHeight: "125px" }}>
            <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
              <Box display="flex" flexDirection="column" gap={2}>
                <CalendarSelector />
                <CategorySelector />
              </Box>
            </Box>
          </Panel>

          <PanelResizeHandle />

          <Panel defaultSize={30} style={{ ...panelStyle, minHeight: "290px", minWidth: "320px" }}>
            <Box sx={{ alignSelf: "left", mt: "-16px", ml: "-24px" }}>
              <DatePicker
                onDateSelect={(date) => {
                  setSelectedDate(date)
                }}
              />
            </Box>
          </Panel>

          <PanelResizeHandle />

          <Panel style={{ ...panelStyle, margin: "10px 5px", padding: 0 }}>
            <Box display="flex" flexDirection="column" height="100%" position="relative">
              <Box flexGrow={1} overflow="auto">
                <NotesPanel />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  p: 1.5,
                  width: "100%",
                  zIndex: 2,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <ThemeToggleButton />
              </Box>
            </Box>
          </Panel>
        </PanelGroup>
      </Panel>

      <PanelResizeHandle />

      <Panel style={{ ...panelStyle, margin: "10px 5px" }}>
        <CalendarPanel
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          view={view}
          setView={setView}
          jumpToDate={jumpToDate}
          setJumpToDate={setJumpToDate}
        />
      </Panel>

      <PanelResizeHandle />

      <Panel defaultSize={20}>
        <Box display="flex" flexDirection="column" height="100%" sx={{ ...panelStyle, m: "10px 10px 5px 5px" }}>
          <Box flexGrow={1} overflow="auto">
            <TasksPanel />
          </Box>
          <Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={async () => {
                try {
                  await logout()
                } finally {
                  localStorage.removeItem("token")
                  window.location.href = "/login"
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Panel>
    </PanelGroup>
  )
}

export default Dashboard
