import { DndProvider } from "react-dnd"

import { CssBaseline } from "@mui/material"
import { HTML5Backend } from "react-dnd-html5-backend"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

import Dashboard from "./page/Dashboard"
import AppProvider from "./provider/AppProvider"
import ThemeModeProvider from "./provider/ThemeProvider"

const App = () => {
  return (
    <>
      <AppProvider>
        <ThemeModeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DndProvider backend={HTML5Backend}>
              <CssBaseline />
              <Dashboard />
            </DndProvider>
          </LocalizationProvider>
        </ThemeModeProvider>
      </AppProvider>
    </>
  )
}

export default App
