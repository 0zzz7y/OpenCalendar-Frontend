import { CssBaseline } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { ThemeProvider } from "@/themes/ThemeProvider"

export const ApplicationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DndProvider backend={HTML5Backend}>
            <CssBaseline />
            {children}
          </DndProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}
