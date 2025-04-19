import { ReactNode } from "react"

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import ThemeProvider from "@/component/theme/ThemeProvider"

import { CalendarProvider } from "@/context/CalendarContext"
import { CategoryProvider } from "@/context/CategoryContext"
import { NoteProvider } from "@/context/NoteContext"
import { TaskProvider } from "@/context/TaskContext"
import { EventProvider } from "@/context/EventContext"
import { DashboardProvider } from "@/context/DashboardContext"

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DndProvider backend={HTML5Backend}>
            <CalendarProvider>
              <CategoryProvider>
                <EventProvider>
                  <TaskProvider>
                    <NoteProvider>
                      <DashboardProvider>{children}</DashboardProvider>
                    </NoteProvider>
                  </TaskProvider>
                </EventProvider>
              </CategoryProvider>
            </CalendarProvider>
          </DndProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default AppProvider
