import React from 'react';
import TextField from '@mui/material/TextField';

interface DescriptionInputProperties {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const DescriptionInput: React.FC<DescriptionInputProperties> = ({
  label = 'Description',
  value,
  onChange,
}) => {
  return (
    <TextField
      fullWidth
      multiline
      minRows={3}
      maxRows={8}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default DescriptionInput;
