import {
  Box,
  Button,
  CircularProgress,
  Typography
} from "@mui/material"

import LeftPanel from "../components/layout/LeftPanel"
import CenterPanel from "../components/layout/CenterPanel"
import RightPanel from "../components/layout/RightPanel"
import ResizableLayout from "../components/layout/ResizableLayout"

import useDashboard from "../hooks/useDashboard"

const Dashboard = () => {
  const {
    loading,
    refetch
  } = useDashboard()

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography>Loading dashboard data...</Typography>
        <Button onClick={refetch} variant="outlined">
          Retry
        </Button>
      </Box>
    )
  }

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
