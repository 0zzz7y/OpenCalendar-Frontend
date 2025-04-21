import { AppProvider } from "@/context/AppContext"

import React from "react"

const App = ({ children }: { children: React.ReactNode }) => {
  return <AppProvider>{children}</AppProvider>
}

export default App
