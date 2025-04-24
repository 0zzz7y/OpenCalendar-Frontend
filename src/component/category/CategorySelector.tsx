import PLACEHOLDERS from "@/constant/ui/labels"
import useAppStore from "@/store/useAppStore"
import CategoryEditor from "./CategoryEditor"

import { useMemo, useState } from "react"
import {
  Box,
  MenuItem,
  TextField,
  Typography,
  IconButton
} from "@mui/material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

const CategorySelector = () => {
  const { categories } = useAppStore()
  const selectedCategory = useAppStore((s) => s.selectedCategory)
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editorAnchor, setEditorAnchor] = useState<HTMLElement | null>(null)
  const [editorMode, setEditorMode] = useState<"add" | "edit" | "delete">("add")
  const [editorData, setEditorData] = useState<{
    id?: string
    label?: string
    color?: string
  }>({})

  const openEditor = (
    mode: "add" | "edit" | "delete",
    anchor: HTMLElement,
    data: { id?: string; label?: string; color?: string } = {}
  ) => {
    setEditorMode(mode)
    setEditorData(data)
    setEditorAnchor(anchor)
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setEditorAnchor(null)
    setEditorData({})
  }

  const categoryOptions = useMemo(() => {
    return [
      { label: "All", value: "all", color: "#ffffff" },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
        color: category.color
      }))
    ]
  }, [categories])
  
  return (
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
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
                      openEditor("edit", e.currentTarget, {
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
                      openEditor("delete", e.currentTarget, {
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
        onClick={(e) =>
          openEditor("add", e.currentTarget, {
            label: "",
            color: "#3b5bdb"
          })
        }
      >
        <AddCircleOutlineIcon fontSize="small" />
      </IconButton>

      <CategoryEditor
        open={editorOpen}
        anchorEl={editorAnchor}
        mode={editorMode}
        initialData={editorData}
        onClose={closeEditor}
      />
    </Box>
  )
}

export default CategorySelector
