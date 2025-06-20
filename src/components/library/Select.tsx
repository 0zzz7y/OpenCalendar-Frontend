// components/Select.tsx
import React from "react"
import {
  FormControl,
  MenuItem,
  Select as MuiSelect,
  type SelectProps,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

interface Option { label: string; value: string }

interface SelectProperties
  extends Omit<SelectProps, "onChange"> {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  /** Optional colour of the animated outline */
  outlineColor?: string
}

/* ─────────────────  core animation styling ───────────────── */
const WaterOutlineSelect = styled(MuiSelect, {
  shouldForwardProp: (prop) => prop !== "outlineColor",
})<{ outlineColor?: string }>(({ theme, outlineColor }) => {
  const colour = outlineColor ?? theme.palette.primary.main
  const radius = theme.shape.borderRadius

  return {
    position: "relative",
    // Hide the default outline so only the animated one is visible
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
    },

    /*  overlay border that “fills”  */
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      border: `2px solid ${colour}`,
      borderRadius: radius,
      transform: "scaleY(0)",
      transformOrigin: "bottom",
      transition: "transform .4s ease",
    },

    // Optional preview on hover (remove if you want it only on focus)
    "&:hover::after": { transform: "scaleY(.35)" },

    // Full fill on focus
    "&.Mui-focused::after": { transform: "scaleY(1)" },

    // Make sure disabled state doesn’t animate
    "&.Mui-disabled::after": { opacity: 0.3 },
  }
})

/* ───────────────────── exported component ────────────────── */
export const Select = ({
  label,
  options,
  value,
  onChange,
  outlineColor,
  ...props
}: SelectProperties) => (
  <FormControl fullWidth size="small" variant="outlined">
    <Typography
      variant="body2"
      sx={{ mb: 0.5, fontWeight: 500, color: "text.primary" }}
    >
      {label}
    </Typography>

    <WaterOutlineSelect 
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      outlineColor={outlineColor}
      {...props}
    >
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </WaterOutlineSelect>
  </FormControl>
)
