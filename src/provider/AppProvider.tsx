import React from "react"

import { AppProvider } from "@/context/AppContext"

const App = ({ children }: { children: React.ReactNode }) => {
  return <AppProvider>{children}</AppProvider>
}

export default App
