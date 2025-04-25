// src/component/common/selector/Selector.tsx
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  type SelectChangeEvent,
  Box,
} from "@mui/material";

import type { ReactNode } from "react";
import type LABEL from "@/constant/ui/label";

interface Option {
  label: string;
  value: string;
  color?: string;
  emoji?: string;
}

interface SelectorProperties {
  label: LABEL;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
  children?: (option: Option) => ReactNode;
}

const Selector = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  children,
}: SelectorProperties) => {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        renderValue={() => (
          <Box
            sx={{
              height: 24,
              display: "flex",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {selectedOption && children
              ? children(selectedOption)
              : selectedOption?.label ?? ""}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              "& .MuiMenuItem-root": {
                height: 40, // Fixed height for menu items
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ minHeight: 40 }}
          >
            {children ? children(option) : option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Selector;
