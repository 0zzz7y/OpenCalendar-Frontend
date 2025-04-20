import { DndProvider } from "react-dnd"
import Dashboard from "./page/Dashboard"
import AppProvider from "./provider/AppProvider"
import { CssBaseline } from "@mui/material"
import { HTML5Backend } from "react-dnd-html5-backend"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
const App = () => {
  return (
    <>
      <AppProvider>
        <DndProvider backend={HTML5Backend}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <Dashboard />
          </LocalizationProvider>
        </DndProvider>
      </AppProvider>
    </>
  )
}

export default App
