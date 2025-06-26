import { createTheme } from "@mui/material/styles"

import { Theme } from "@/themes/theme.type"
import { COLOR } from "@/themes/color.constant"
import { FONT } from "@/themes/font.constant"

export const darkTheme = createTheme({
  palette: {
    mode: Theme.DARK,

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
      default: COLOR.BLACK,
      paper: COLOR.GRAY,
    },

    divider: COLOR.DARK_GRAY,

    text: {
      primary: COLOR.LIGHT_TEXT,
      secondary: COLOR.MUTED_TEXT,
    },
  },

  typography: {
    fontFamily: FONT.DEFAULT,
  }
})
