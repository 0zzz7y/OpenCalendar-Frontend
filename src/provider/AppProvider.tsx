import React from "react"

import { CssBaseline } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ToastContainer } from "react-toastify"

import ThemeProvider from "./ThemeProvider"

const App = ({ children }: { children: React.ReactNode }) => {
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

export default App
