import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  type SelectChangeEvent,
} from '@mui/material'

interface Option {
  label: string
  value: string
}

interface SelectorProperties {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  disabled?: boolean
}

const Selector = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: SelectorProperties) => (
  <FormControl fullWidth size="small" disabled={disabled}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      label={label}
      onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
    >
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

export default Selector
