import { Box } from "@mui/material";
import { useState } from "react";
import LeftPanel from "../layouts/LeftPanel";
import RightPanel from "../layouts/RightPanel";

export default function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <Box display="flex" height="100vh" width="100vw" overflow="hidden">
      {/* Sidebar: partially hidden when closed */}
      <Box
        sx={{
          width: "25vw",
          minWidth: 180,
          maxWidth: 300,
          transform: showSidebar ? "translateX(0)" : "translateX(-80%)",
          transition: "transform 0.4s ease-in-out",
          position: "relative",
          zIndex: 2,
        }}
      >
        <LeftPanel onHide={() => setShowSidebar(false)} onShow={() => setShowSidebar(true)} isOpen={showSidebar} />
      </Box>

      {/* Main content */}
      <Box flex={1} bgcolor="#fff" p={2}>
        Main calendar area
      </Box>

      <Box
        width="35vw"
        minWidth={200}
        maxWidth={550}
        height="100%"
        bgcolor="#fafafa"
        sx={{ borderLeft: "1px solid #eee" }}
      >
        <RightPanel />
      </Box>
    </Box>
  );
}
