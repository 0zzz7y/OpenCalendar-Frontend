import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

import ThemeProvider from "./components/theme/ThemeProvider"
import Dashboard from "./pages/Dashboard"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { CssBaseline } from "@mui/material"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const App = () => {
  return (
    <>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DndProvider backend={HTML5Backend}>
            <CssBaseline />
            <Dashboard />
          </DndProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default App
