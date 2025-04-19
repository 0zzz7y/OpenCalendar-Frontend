import { Box, MenuItem, TextField, Typography, IconButton } from "@mui/material"

import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react"
import { useMemo } from "react"

import useCategoryContext from "../../hook/context/useCategoryContext"

const CategorySelector = () => {
  const { categories, selectedCategory, setSelectedCategory, openEditor } =
    useCategoryContext()

  const categoryOptions: { label: string; value: string; color?: string }[] =
    useMemo(() => {
      return [
        { label: "All", value: "all" },
        ...categories.map((category) => ({
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
          key={categoryOptions.map((c) => `${c.value}-${c.label}`).join("-")}
          select
          label="Category"
          value={selectedCategory || "all"}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          fullWidth
          size="small"
          SelectProps={{
            renderValue: (selected: unknown) => {
              const selectedValue = selected as string
              const item = categoryOptions.find(
                (d) => d.value === selectedValue
              )
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
                      onClick={(e: { stopPropagation: () => void }) => {
                        e.stopPropagation()
                        openEditor("edit", {
                          id: option.value,
                          label: option.label,
                          color: option.color ?? "#000000"
                        })
                      }}
                    >
                      <IconPencil size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={option.value === selectedCategory}
                      onClick={(e: { stopPropagation: () => void }) => {
                        e.stopPropagation()
                        openEditor("delete", {
                          id: option.value,
                          label: option.label,
                          color: option.color ?? "#000000"
                        })
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

        <IconButton onClick={() => openEditor("add")}>
          <IconCirclePlus size={20} />
        </IconButton>
      </Box>
    </>
  )
}

export default CategorySelector
