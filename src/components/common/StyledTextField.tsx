import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

type StyledTextFieldProperties = TextFieldProps & {
  shadowColor?: string;
};

export const StyledTextField = ({
  shadowColor = "rgba(0, 0, 0, 0.2)",
  ...properties
}: StyledTextFieldProperties) => {
  const CustomTextField = styled(TextField)(({ theme }) => ({
    position: "relative",

    "& .MuiOutlinedInput-root": {
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      zIndex: 0,

      "& fieldset": {
        border: "none",
      },

      "&:hover": {
        boxShadow: `0 0 5px ${shadowColor}`,
      },

      "& .outline-animation": {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 2,
        animation: "0.5s ease-out 0.5s both"
      },

      "& .line": {
        position: "absolute",
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        zIndex: 2,
      },

      // ✅ BOTTOM (center out)
      "&.Mui-focused .bottom": {
        bottom: 0,
        left: 0,
        width: "100%",
        height: "2px",
        transformOrigin: "center",
        animation: "scale-in-hor-center 0.5s cubic-bezier(.25,.46,.45,.94) both",
      },

      // ✅ LEFT (bottom to top)
      "&.Mui-focused .left": {
        bottom: 0,
        left: 0,
        width: "2px",
        height: "100%",
        transformOrigin: "bottom",
        animation: "scale-in-ver-bottom 0.4s ease-out 0.5s both",
      },

      // ✅ RIGHT (bottom to top)
      "&.Mui-focused .right": {
        bottom: 0,
        right: 0,
        width: "2px",
        height: "100%",
        transformOrigin: "bottom",
        animation: "scale-in-ver-bottom 0.4s ease-out 0.5s both",
      },

      // ✅ TOP (right to left full)
      "&.Mui-focused .top": {
        top: 0,
        left: 0,
        width: "100%",
        height: "2px",
        transformOrigin: "right",
        animation: "scale-in-hor-right-to-left 0.4s ease-out 1s both",
      },
    },

    "& .MuiInputBase-input": {
      position: "relative",
      zIndex: 3,
    },

    "& .MuiInputLabel-root": {
      zIndex: 3,
      backgroundColor: theme.palette.background.paper,
      padding: "0 4px",
    },

    // === ANIMISTA-STYLE KEYFRAMES ===

    "@keyframes scale-in-hor-center": {
      "0%": {
        transform: "scaleX(0)",
        transformOrigin: "center",
        opacity: 1,
      },
      "100%": {
        transform: "scaleX(1)",
        transformOrigin: "center",
        opacity: 1,
      },
    },

    "@keyframes scale-in-ver-bottom": {
      "0%": {
        transform: "scaleY(0)",
        transformOrigin: "bottom",
        opacity: 1,
      },
      "100%": {
        transform: "scaleY(1)",
        transformOrigin: "bottom",
        opacity: 1,
      },
    },

    "@keyframes scale-in-hor-right-to-left": {
      "0%": {
        transform: "scaleX(0)",
        transformOrigin: "right",
        opacity: 1,
      },
      "100%": {
        transform: "scaleX(1)",
        transformOrigin: "right",
        opacity: 1,
      },
    },
  }));

  return (
    <CustomTextField
      variant="outlined"
      InputLabelProps={{ shrink: undefined }}
      InputProps={{
        endAdornment: (
          <div className="outline-animation">
            <div className="line bottom" />
            <div className="line left" />
            <div className="line right" />
            <div className="line top" />
          </div>
        ),
      }}
      {...properties}
    />
  );
};

export default StyledTextField;
