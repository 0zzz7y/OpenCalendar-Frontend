import { useContext } from "react"
import EventContext from "@/context/EventContext"

const useEventContext = () => {
  const context = useContext(EventContext)
  if (!context) throw new Error("useEventContext must be used within an EventProvider.")
  return context
}

export default useEventContext
