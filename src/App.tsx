import CssBaseline from "@mui/material/CssBaseline"
import Dashboard from "./page/Dashboard"
import AppProvider from "./provider/AppProvider"

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
