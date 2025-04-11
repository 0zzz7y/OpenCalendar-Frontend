import React from 'react';
import TextField from '@mui/material/TextField';

interface TextInputProperties {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

const TextInput: React.FC<TextInputProperties> = ({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  error = false,
  helperText,
}) => {
  return (
    <TextField
      fullWidth
      required={required}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
    />
  );
};

export default TextInput;
