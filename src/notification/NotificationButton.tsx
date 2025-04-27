import { useState, useEffect } from "react"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import NotificationsIcon from "@mui/icons-material/Notifications"

export default function NotificationToggleButton() {
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission)

  useEffect(() => {
    const handlePermissionChange = () => {
      setPermission(Notification.permission)
    }

    document.addEventListener("visibilitychange", handlePermissionChange)

    return () => {
      document.removeEventListener("visibilitychange", handlePermissionChange)
    }
  }, [])

  const handleRequestPermission = async () => {
    if (permission !== "granted") {
      const result = await Notification.requestPermission()
      setPermission(result)
    }
  }

  return (
    <Tooltip title={permission === "granted" ? "Notifications enabled" : "Enable notifications"}>
      <IconButton onClick={handleRequestPermission} color={permission === "granted" ? "primary" : "default"}>
        {permission === "granted" ? <NotificationsIcon /> : <NotificationsNoneIcon />}
      </IconButton>
    </Tooltip>
  )
}
