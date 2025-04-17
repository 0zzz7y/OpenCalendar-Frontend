import LeftPanel from "../components/layout/LeftPanel"
import CenterPanel from "../components/layout/CenterPanel"
import RightPanel from "../components/layout/RightPanel"
import ResizableLayout from "../components/layout/ResizableLayout"

const Dashboard = () => {
  return (
    <>
      <ResizableLayout
        leftPanel={<LeftPanel />}
        centerPanel={<CenterPanel />}
        rightPanel={<RightPanel />}
      />
    </>
  )
}

export default Dashboard
