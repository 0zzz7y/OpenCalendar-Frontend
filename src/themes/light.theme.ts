import { createTheme } from "@mui/material/styles"

import { Theme } from "@/themes/theme.type"
import { COLOR } from "@/themes/color.constant"
import { FONT } from "@/themes/font.constant"

export const lightTheme = createTheme({
  palette: {
    mode: Theme.LIGHT,

    primary: {
      main: COLOR.PRIMARY,
    },

    secondary: {
      main: COLOR.SECONDARY,
    },

    success: {
      main: COLOR.SUCCESS,
    },

    error: {
      main: COLOR.DANGER,
    },

    warning: {
      main: COLOR.WARNING,
    },

    info: {
      main: COLOR.INFO,
    },

    background: {
      default: COLOR.LIGHT_GRAY,
      paper: COLOR.WHITE,
    },

    divider: COLOR.BORDER_GRAY,

    text: {
      primary: COLOR.DARK_TEXT,
      secondary: COLOR.MUTED_TEXT,
    },
  },

  typography: {
    fontFamily: FONT.DEFAULT,
  }
})
