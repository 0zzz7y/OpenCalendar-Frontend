import type { ReactNode } from "react"

import { type SelectChangeEvent, Box, Select as MaterialSelect, MenuItem, InputLabel, FormControl } from "@mui/material"

import type { LABEL } from "@/components/shared/label.constant"

interface Option {
  label: string
  value: string
  color?: string
  emoji?: string
}

interface SelectorProperties {
  label: typeof LABEL
  value: string
  onChange: (value: string) => void
  options: Option[]
  disabled?: boolean
  children?: (option: Option) => ReactNode
}

export const Select = ({ label, value, onChange, options, disabled = false, children }: SelectorProperties) => {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel>{value}</InputLabel>
      <MaterialSelect
        value={value}
        label={typeof label === "string" ? label : ""}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        renderValue={() => (
          <Box
            sx={{
              height: 24,
              display: "flex",
              alignItems: "center",
              width: "100%",
              overflow: "hidden"
            }}
          >
            {selectedOption && children ? children(selectedOption) : (selectedOption?.label ?? "")}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              "& .MuiMenuItem-root": {
                height: 40
              }
            }
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ minHeight: 40 }}>
            {children ? children(option) : option.label}
          </MenuItem>
        ))}
      </MaterialSelect>
    </FormControl>
  )
}
