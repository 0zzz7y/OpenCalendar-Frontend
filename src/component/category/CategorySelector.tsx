import { Box, MenuItem, TextField, Typography, IconButton } from "@mui/material"

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import { useMemo } from "react"

import useAppContext from "@/hook/context/useAppContext"

import EditorMode from "@/type/utility/editorMode"
import EditorType from "@/type/utility/editorType"

import PLACEHOLDERS from "@/constant/placeholders"

const CategorySelector = () => {
  const { categories, selectedCategory, setSelectedCategory, openEditor } = useAppContext()

  const categoryOptions: { label: string; value: string; color?: string }[] = useMemo(() => {
    return [
      { label: "All", value: "all" },
      ...categories.map((category: { name: string; id: string; color: string }) => ({
        label: category.name,
        value: category.id,
        color: category.color
      }))
    ]
  }, [categories])

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} width="100%">
        <TextField
          select
          label={PLACEHOLDERS.CATEGORY}
          value={selectedCategory || "all"}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          fullWidth
          size="small"
          SelectProps={{
            renderValue: (selected: unknown) => {
              const selectedValue = selected as string
              const item = categoryOptions.find((d) => d.value === selectedValue)
              return (
                <Box display="flex" alignItems="center" gap={1}>
                  {item?.color && (
                    <Box
                      width={10}
                      height={10}
                      borderRadius="50%"
                      bgcolor={item.color}
                    />
                  )}
                  <Typography variant="body2">{item?.label}</Typography>
                </Box>
              )
            }
          }}
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Box display="flex" alignItems="center" gap={1}>
                  {option.color && (
                    <Box
                      width={10}
                      height={10}
                      borderRadius="50%"
                      bgcolor={option.color}
                    />
                  )}
                  <Typography variant="body2">{option.label}</Typography>
                </Box>
                {option.value !== "all" && (
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditor(EditorType.CATEGORY, EditorMode.EDIT, {
                          id: option.value,
                          label: option.label,
                          color: option.color ?? "#000000"
                        })
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={option.value === selectedCategory}
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditor(EditorType.CATEGORY, EditorMode.DELETE, {
                          id: option.value,
                          label: option.label,
                          color: option.color ?? "#000000"
                        })
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </MenuItem>
          ))}
        </TextField>
        <IconButton
          onClick={() => openEditor(EditorType.CATEGORY, EditorMode.ADD)}
        >
          <AddCircleOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </>
  )
}

export default CategorySelector
