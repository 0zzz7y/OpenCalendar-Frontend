import { DashboardProvider } from "../context/DashboardContext";

import LeftPanel from "../components/layout/LeftPanel";
import CenterPanel from "../components/layout/CenterPanel";
import RightPanel from "../components/layout/RightPanel";
import ResizableLayout from "../components/layout/ResizableLayout";

const Dashboard = () => {
  return (
    <>
      <DashboardProvider>
        <ResizableLayout
          leftPanel={<LeftPanel />}
          centerPanel={<CenterPanel />}
          rightPanel={<RightPanel />}
          initialLeftWidth={300}
          initialRightWidth={800}
          centerMinWidth={200}
        />
      </DashboardProvider>
    </>
  );
};

export default Dashboard;
