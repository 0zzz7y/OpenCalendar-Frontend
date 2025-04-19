import { createContext, useContext, useState, ReactNode } from "react"

import EventContextState, { EventEditorData } from "./state/EventContextState"

import useEvent from "@/hook/api/useEvent"

import EditorMode from "@/type/utility/editorMode"

const EventContext = createContext<EventContextState | undefined>(undefined)

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<EditorMode>("add")
  const [editorData, setEditorData] = useState<EventEditorData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    recurringPattern: "NONE",
    calendarId: ""
  })

  const { events, reloadEvents } = useEvent()

  const openEditor = (
    mode: EditorMode,
    data: EventEditorData = {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      recurringPattern: "NONE",
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
