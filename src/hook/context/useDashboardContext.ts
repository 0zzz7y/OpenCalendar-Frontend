import { useContext } from "react"
import DashboardContext from "@/context/DashboardContext"

const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboardContext must be used within a DashboardProvider.")
  return context
}

export default useDashboardContext
