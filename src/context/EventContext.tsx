import { createContext, useContext, useState, ReactNode } from "react"

import Event from "../type/event"
import EventContextState, { EventEditorData } from "./state/EventContextState"

import useEvent from "../hook/api/useEvent"

const EventContext = createContext<EventContextState | undefined>(undefined)

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<"add" | "edit" | "delete">("add")
  const [editorData, setEditorData] = useState<EventEditorData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    calendarId: ""
  })

  const { events, reloadEvents } = useEvent()

  const openEditor = (
    mode: "add" | "edit" | "delete",
    data: EventEditorData = {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      calendarId: ""
    }
  ) => {
    setEditorMode(mode)
    setEditorData(data)
    setEditorOpen(true)
  }

  const closeEditor = () => setEditorOpen(false)

  return (
    <EventContext.Provider
      value={{
        events,
        reloadEvents,
        editorOpen,
        editorMode,
        editorData,
        openEditor,
        closeEditor
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export default EventContext
