import React from 'react';
import { MenuItem, TextField } from '@mui/material';

interface ColorOption {
  value: string;
  label: string;
}

interface ColorPickerProperties {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  options?: ColorOption[];
}

const defaultOptions: ColorOption[] = [
  { value: '#2196f3', label: 'Blue' },
  { value: '#f44336', label: 'Red' },
  { value: '#4caf50', label: 'Green' },
  { value: '#ff9800', label: 'Orange' },
  { value: '#9c27b0', label: 'Purple' },
];

const ColorPicker: React.FC<ColorPickerProperties> = ({ value, onChange, label = "Color", options = defaultOptions }) => {
  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((color) => (
        <MenuItem key={color.value} value={color.value}>
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              backgroundColor: color.value,
              borderRadius: '50%',
              marginRight: 8,
            }}
          />
          {color.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default ColorPicker;
