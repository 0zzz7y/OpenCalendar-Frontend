import Dashboard from "./page/Dashboard"
import AppProvider from "./provider/AppProvider"
import { CssBaseline } from "@mui/material"

const App = () => {
  return (
    <>
      <AppProvider>
        <CssBaseline />
        <Dashboard />
      </AppProvider>
    </>
  )
}

export default App
