import {
  MenuItem,
  TextField,
  IconButton,
  Popper,
  Box,
  Typography
} from "@mui/material"

import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import useCategoryContext from "../../hook/context/useCategoryContext"
import CategoryEditor from "./CategoryEditor"

const CategorySelector = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    openEditor,
    editorOpen
  } = useCategoryContext()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isPopoverOpen = Boolean(anchorEl)

  const categoryOptions = useMemo(() => {
    if (!Array.isArray(categories))
      return [{ label: "All", value: "all", color: undefined }]
    return [
      { label: "All", value: "all", color: undefined },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
        color: category.color
      }))
    ]
  }, [categories])

  const handleOpenEditor = (
    mode: "add" | "edit" | "delete",
    e: React.MouseEvent,
    val = "",
    label = "",
    color = "#3b5bdb"
  ) => {
    if (mode === "delete" && val === selectedCategory) return
    openEditor(mode, { id: val, label, color })
    setAnchorEl(e.currentTarget as HTMLElement)
  }

  const handleCloseEditor = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box display="flex" alignItems="center" gap={1} width="100%" zIndex={1}>
        <TextField
          key={categoryOptions.map((c) => `${c.value}-${c.label}`).join("-")}
          select
          label="Category"
          value={selectedCategory || "all"}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          fullWidth
          size="small"
          SelectProps={{
            renderValue: (selected) => {
              const item = categoryOptions.find((d) => d.value === selected)
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
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ pl: 1, zIndex: 1 }}
            >
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
                        handleOpenEditor(
                          "edit",
                          e,
                          option.value,
                          option.label,
                          option.color
                        )
                      }}
                    >
                      <IconPencil size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={option.value === selectedCategory}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEditor(
                          "delete",
                          e,
                          option.value,
                          option.label,
                          option.color
                        )
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

        <IconButton onClick={(e) => handleOpenEditor("add", e)}>
          <IconCirclePlus size={20} />
        </IconButton>
      </Box>

      <Popper
        open={isPopoverOpen && editorOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 2000 }}
        modifiers={[
          { name: "preventOverflow", options: { boundary: "viewport" } }
        ]}
      >
        <Box zIndex={2000}>
          <CategoryEditor />
        </Box>
      </Popper>
    </>
  )
}

export default CategorySelector
