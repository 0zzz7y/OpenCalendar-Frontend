import { CssBaseline } from "@mui/material"

import ThemeProvider from "./components/theme/ThemeProvider"
import Dashboard from "./pages/Dashboard"

const App = () => {
  return (
    <>
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    </>
  )
}

export default App
