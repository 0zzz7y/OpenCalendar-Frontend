import { Box, Grid } from "@mui/material"

import LeftPanel from "../components/layout/LeftPanel"
import MiddlePanel from "../components/layout/MiddlePanel"
import RightPanel from "../components/layout/RightPanel"
import ResizableLayout from "../components/layout/ResizableLayout"

export default function Dashboard() {
  return (
    <>
      <ResizableLayout
        leftPanel={<LeftPanel />}
        centerPanel={<MiddlePanel />}
        rightPanel={<RightPanel />}
      />
    </>
  )
}