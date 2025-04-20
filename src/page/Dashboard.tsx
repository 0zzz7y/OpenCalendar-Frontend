import React from "react"
import LeftPanel from "@/component/layout/LeftPanel"
import CenterPanel from "@/component/layout/CenterPanel"
import RightPanel from "@/component/layout/RightPanel"
import CalendarEditor from "@/component/calendar/CalendarEditor"
import CategoryEditor from "@/component/category/CategoryEditor"
import useAppContext from "@/hook/context/useAppContext" // Import the custom hook to access AppContext
import EditorType from "@/type/utility/editorType"
import CollapsingPanel from "@/component/layout/ResizableLayout"

const Dashboard = () => {
  const { editorOpen, editorType, editorData, closeEditor } = useAppContext() // Access the global context

  return (
    <>
      <CollapsingPanel
        leftPanel={<LeftPanel />}
        centerPanel={<CenterPanel />}
        rightPanel={<RightPanel />}
      />

      {editorOpen && editorType === EditorType.CALENDAR && (
        <CalendarEditor
          type={editorType}
          data={editorData}
          closeEditor={closeEditor}
        />
      )}

      {editorOpen && editorType === EditorType.CATEGORY && (
        <CategoryEditor
          type={editorType}
          data={editorData}
          closeEditor={closeEditor}
        />
      )}
    </>
  )
}

export default Dashboard
