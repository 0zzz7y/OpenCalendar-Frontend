import Dashboard from "./page/Dashboard"
import AppProvider from "./provider/AppProvider"

const App = () => {
  return (
    <>
      <AppProvider>
        <Dashboard />
      </AppProvider>
    </>
  )
}

export default App
