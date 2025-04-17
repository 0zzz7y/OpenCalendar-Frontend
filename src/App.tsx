import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

import ThemeProvider from "./components/theme/ThemeProvider"
import Dashboard from "./pages/Dashboard"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { CssBaseline } from "@mui/material"

const App = () => {
  return (
    <>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <Dashboard />
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default App
