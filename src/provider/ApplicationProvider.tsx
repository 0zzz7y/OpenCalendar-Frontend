import { CssBaseline } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ToastContainer } from "react-toastify"

import ThemeProvider from "@/theme/ThemeProvider"
import { useEffect } from "react"

const Application = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission()
    }
  }, [])
  
  return (
    <>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DndProvider backend={HTML5Backend}>
            <ToastContainer />
            <CssBaseline />
            {children}
          </DndProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default Application
