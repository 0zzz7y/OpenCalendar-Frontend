import { CssBaseline } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

import { ThemeProvider } from "@/themes/ThemeProvider"

import "@/index"

export const ApplicationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}
