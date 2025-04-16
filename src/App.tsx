import { CssBaseline, ThemeProvider } from "@mui/material"
import { theme } from "./theme"
import Dashboard from "./pages/Dashboard"

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  )
}

export default App