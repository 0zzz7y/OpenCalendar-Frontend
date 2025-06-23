import { BrowserRouter, Routes, Route } from "react-router-dom"

import { ApplicationProvider } from "@/ApplicationProvider"

import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import Register from "@/pages/Registration"

export const Application = () => {
  return (
    <BrowserRouter>
      <ApplicationProvider>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </ApplicationProvider>
    </BrowserRouter>
  )
}
