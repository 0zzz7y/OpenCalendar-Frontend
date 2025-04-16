import React from "react";
// import LeftPanel from "../../layouts/left/LeftPanel";
// import CenterPanel from "../../layouts/middle/CenterPanel";
// import RightPanel from "../../layouts/right/RightPanel";
import ResizableLayout from "@/layouts/resizable/ResizableLayout";
import LeftPanel from "@/layouts/left/LeftPanel";

const Dashboard = () => {
  return (
    <>
      <ResizableLayout
        leftPanel={
        <LeftPanel/>}
                centerPanel={<div style={{ height: "100%", background: "#ffffff" }} />}
                rightPanel={<div style={{ height: "100%", background: "#f1f3f5" }} />}
                initialLeftWidth={300}
                initialRightWidth={400}
                centerMinWidth={250}
              />

    </>
  );
};

export default Dashboard;
