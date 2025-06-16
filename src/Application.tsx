import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "@/page/Dashboard"
import Login from "@/page/Login"
import Register from "@/page/Registration"
import ApplicationProvider from "@/provider/ApplicationProvider"

import { ApplicationProvider } from "@/ApplicationProvider"

import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import Register from "@/pages/Registration"

export const Application = () => {
  return (
    <Router>
      <ApplicationProvider>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} /> {/* default to login */}
        </Routes>
      </ApplicationProvider>
    </Router>
  )
}
