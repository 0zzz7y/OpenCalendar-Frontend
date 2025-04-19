import { DashboardProvider } from "../context/DashboardContext"

import LeftPanel from "../component/layout/LeftPanel"
import CenterPanel from "../component/layout/CenterPanel"
import RightPanel from "../component/layout/RightPanel"
import ResizableLayout from "../component/layout/ResizableLayout"

const Dashboard = () => {
  return (
    <>
      <ResizableLayout
        leftPanel={<LeftPanel />}
        centerPanel={<CenterPanel />}
        rightPanel={<RightPanel />}
        initialLeftWidth={300}
        initialRightWidth={800}
        centerMinWidth={200}
      />
    </>
  )
}

export default Dashboard
