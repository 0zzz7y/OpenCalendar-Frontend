import React, { useState } from "react"
import LeftPanel from "@/component/layout/LeftPanel"
import CenterPanel from "@/component/layout/CenterPanel"
import RightPanel from "@/component/layout/RightPanel"
import CalendarEditor from "@/component/calendar/CalendarEditor"
import CategoryEditor from "@/component/category/CategoryEditor"
import useAppContext from "@/hook/context/useAppContext" // Import the custom hook to access AppContext
import EditorType from "@/type/utility/editorType"
import CollapsingPanel from "@/component/layout/ResizableLayout"
import ResizableLayout from "@/component/layout/ResizableLayout"
import CalendarSelector from "@/component/calendar/CalendarSelector"
import MonthlyCalendar from "@/component/calendar/MonthlyCalendar"
import CategorySelector from "@/component/category/CategorySelector"
import NotesPanel from "@/component/note/NotesPanel"
import TasksPanel from "@/component/task/TasksPanel"
import ThemeToggleButton from "@/component/theme/ThemeToggleButton"
import { Box, Stack } from "@mui/material"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"

const Dashboard = () => {
  // Inicjalizacja szerokości paneli jako stanu
  const [leftPanelWidth, setLeftPanelWidth] = useState(20); // 20% szerokości ekranu dla lewego panelu
  const [rightPanelWidth, setRightPanelWidth] = useState(30); // 30% szerokości ekranu dla prawego panelu
  const [centerPanelWidth, setCenterPanelWidth] = useState(50); // 50% szerokości ekranu dla środkowego panelu

  // Funkcja zmieniająca szerokość lewego panelu
  const handleLeftPanelResize = (newWidth: number) => {
    const totalWidth = 100; // Cała szerokość w procentach
    setLeftPanelWidth(newWidth);
    setCenterPanelWidth(totalWidth - newWidth - rightPanelWidth); // Aktualizacja szerokości środkowego panelu
  };

  // Funkcja zmieniająca szerokość prawego panelu
  const handleRightPanelResize = (newWidth: number) => {
    const totalWidth = 100; // Cała szerokość w procentach
    setRightPanelWidth(newWidth);
    setCenterPanelWidth(totalWidth - leftPanelWidth - newWidth); // Aktualizacja szerokości środkowego panelu
  };

  return (
    <PanelGroup direction="horizontal" style={{ height: "100vh", width: "100%" }}>
      {/* Left Panel */}
      <Panel>
        <PanelGroup direction="vertical" style={{ height: "100%", width: "100%" }}>
          {/* Calendar and Category section */}
          <Panel
            style={{
              border: "2px solid #ccc", // Obramowanie
              borderRadius: "8px", // Zaokrąglone rogi
              padding: "10px",
              margin: "10px 5px",
            }}
          >
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
              </Stack>
            </Box>
          </Panel>

          <PanelResizeHandle />

          {/* Monthly Calendar section */}
          <Panel
            style={{
              minHeight: "150px",
              border: "2px solid #ccc", // Obramowanie
              borderRadius: "8px", // Zaokrąglone rogi
              padding: "10px",
              margin: "5px 5px",
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
                width: "100%",
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
          width: `${centerPanelWidth}%`,
          border: "2px solid #ccc", // Obramowanie
          borderRadius: "8px", // Zaokrąglone rogi
          margin: "10px 5px",
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
            border: "2px solid #ccc", // Obramowanie
            borderRadius: "8px", // Zaokrąglone rogi
            margin: "10px 5px",
          }}
        >
          <Box height="0%">
            <NotesPanel />
          </Box>

          <Box flexGrow={1} overflow="auto">
            <TasksPanel />
          </Box>
        </Box>
      </Panel>
    </PanelGroup>
  );
};

export default Dashboard
