import AppContext from "@/context/AppContext"

import { useContext } from "react"

const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider.")
  return context
}

export default useAppContext
