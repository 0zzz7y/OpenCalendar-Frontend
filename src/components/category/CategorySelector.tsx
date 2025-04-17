import {
  MenuItem,
  TextField,
  IconButton,
  Popper,
  Box,
  Typography
} from "@mui/material"

import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { useState } from "react"

import CategoryEditor from "./CategoryEditor"

export interface CategoryOption {
  label: string
  value: string
  color?: string
}

interface CategorySelectorProperties {
  data: CategoryOption[]
  value: string | null
  onChange: (val: string | null) => void
  setData: (data: CategoryOption[]) => void
}

const CategorySelector = ({ data, value, onChange, setData }: CategorySelectorProperties) => {
  const [editMode, setEditMode] = useState<"add" | "edit" | "delete">("add")
  const [currentValue, setCurrentValue] = useState("")
  const [labelInput, setLabelInput] = useState("")
  const [colorInput, setColorInput] = useState("#3b5bdb")

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isPopoverOpen = Boolean(anchorEl)

  const handleAdd = () => {
    if (!labelInput.trim()) return
    const newValue = labelInput.toLowerCase().replace(/\s+/g, "-")
    setData([...data, { label: labelInput, value: newValue, color: colorInput }])
    setAnchorEl(null)
    setLabelInput("")
    setColorInput("#3b5bdb")
  }

  const handleEdit = () => {
    if (!labelInput.trim()) return
    setData(
      data.map((item) =>
        item.value === currentValue ? { ...item, label: labelInput, color: colorInput } : item
      )
    )
    setAnchorEl(null)
    setLabelInput("")
    setColorInput("#3b5bdb")
  }

  const handleDelete = () => {
    setData(data.filter((item) => item.value !== currentValue))
    if (value === currentValue) onChange(null)
    setAnchorEl(null)
    setLabelInput("")
    setColorInput("#3b5bdb")
  }

  const openPopover = (
    mode: "add" | "edit" | "delete",
    e: React.MouseEvent,
    val = "",
    label = "",
    color = "#3b5bdb"
  ) => {
    if (mode === "delete" && val === value) return
    setEditMode(mode)
    setCurrentValue(val)
    setLabelInput(label)
    setColorInput(color)
    setAnchorEl(e.currentTarget as HTMLElement)
  }

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} width="100%" zIndex={1}>
        <TextField
          select
          label="Category"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          fullWidth
          size="small"
          SelectProps={{
            renderValue: (selected) => {
              const item = data.find((d) => d.value === selected)
              return (
                <Box display="flex" alignItems="center" gap={1}>
                  {item?.color && (
                    <Box width={10} height={10} borderRadius="50%" bgcolor={item.color} />
                  )}
                  <Typography variant="body2">{item?.label}</Typography>
                </Box>
              )
            }
          }}
        >
          {data.map((option) => (
            <MenuItem key={option.value} value={option.value} sx={{ pl: 1, zIndex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Box display="flex" alignItems="center" gap={1}>
                  {option.color && (
                    <Box width={10} height={10} borderRadius="50%" bgcolor={option.color} />
                  )}
                  <Typography variant="body2">{option.label}</Typography>
                </Box>

                {option.value !== "all" && (
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        openPopover("edit", e, option.value, option.label, option.color)
                      }}
                    >
                      <IconPencil size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={option.value === value}
                      onClick={(e) => {
                        e.stopPropagation()
                        openPopover("delete", e, option.value, option.label, option.color)
                      }}
                    >
                      <IconTrash size={16} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </MenuItem>
          ))}
        </TextField>

        <IconButton onClick={(e) => openPopover("add", e)}>
          <IconCirclePlus size={20} />
        </IconButton>
      </Box>

      <Popper
        open={isPopoverOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 2000 }}
        modifiers={[{
          name: "preventOverflow",
          options: { boundary: "viewport" }
        }]}
      >
        <Box zIndex={2000}>
          <CategoryEditor
            editMode={editMode}
            labelInput={labelInput}
            setLabelInput={setLabelInput}
            onClose={() => setAnchorEl(null)}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            colorInput={colorInput}
            setColorInput={setColorInput}
          />
        </Box>
      </Popper>
    </>
  )
}

export default CategorySelector
