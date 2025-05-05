/**
 * Copyright (c) Tomasz Wnuk
 */

import Dashboard from "@/page/Dashboard"
import ApplicationProvider from "@/provider/ApplicationProvider"

const Application = () => {
  return (
    <>
      <ApplicationProvider>
        <Dashboard />
      </ApplicationProvider>
    </>
  )
}

export default Application
