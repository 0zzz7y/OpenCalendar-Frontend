import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface ViewSwitcherProperties {
  value: 'week' | 'month';
  onChange: (value: 'week' | 'month') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProperties> = ({ value, onChange }) => {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: 'week' | 'month' | null
  ) => {
    if (newValue) onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size="small"
      color="primary"
    >
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewSwitcher;
