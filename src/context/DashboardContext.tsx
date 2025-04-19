import { createContext, useContext } from "react"
import useDashboard from "../hooks/useDashboard"

const DashboardContext = createContext<ReturnType<typeof useDashboard> | null>(
  null
)

export const DashboardProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const dashboard = useDashboard()

  return (
    <DashboardContext.Provider value={dashboard}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    )
  }
  return context
}
