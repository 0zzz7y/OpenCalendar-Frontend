import { useState, useMemo, useCallback } from "react"
import { Box, Typography, IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import useAppStore from "@/store/useAppStore"
import CategoryEditor from "./CategoryEditor"

import EditorMode from "@/model/utility/editorMode"
import LABEL from "@/constant/ui/label"
import FILTER from "@/constant/utility/filter"
import COLOR from "@/constant/ui/color"

import Selector from "@/component/common/selector/Selector"
import AddButton from "@/component/common/button/AddButton"
import ColorDot from "@/component/common/colordot/ColorDot"
import { isCategoryUsed } from "@/utilities/filter"

export default function CategorySelector() {
  const categories = useAppStore((state) => state.categories)
  const selectedCategory = useAppStore((state) => state.selectedCategory) || FILTER.ALL
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory)

  const tasks = useAppStore((state) => state.tasks)
  const events = useAppStore((state) => state.events)
  const notes = useAppStore((state) => state.notes)

  const [editorOpen, setEditorOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.ADD)
  const [editorData, setEditorData] = useState<{
    id?: string
    name?: string
    color?: string
  }>({})

  const filteredCategories = useMemo(() => {
    return [
      { label: FILTER.ALL, value: FILTER.ALL, color: COLOR.WHITE },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
        color: category.color
      }))
    ].filter((option) => isCategoryUsed(option.value, tasks, events, notes))
  }, [categories, tasks, events, notes])

  const openEditor = useCallback(
    (mode: EditorMode, anchor: HTMLElement, data: { id?: string; name?: string; color?: string }) => {
      setEditorMode(mode)
      setEditorData(data)
      setAnchor(anchor)
      setEditorOpen(true)
    },
    []
  )

  const closeEditor = useCallback(() => {
    setEditorOpen(false)
    setEditorData({})
    setAnchor(null)
  }, [])

  const handleChange = useCallback((categoryId: string) => setSelectedCategory(categoryId), [setSelectedCategory])

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <Selector label={LABEL.CATEGORY} value={selectedCategory} onChange={handleChange} options={filteredCategories}>
        {(option) => (
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box display="flex" alignItems="center" gap={1}>
              <ColorDot color={option.color ?? COLOR.WHITE} size={10} />
              <Typography variant="body2">{option.label}</Typography>
            </Box>
            {option.value !== FILTER.ALL && (
              <Box display="flex" gap={1}>
                <IconButton
                  size="small"
                  onClick={(element) => {
                    element.stopPropagation()
                    openEditor(EditorMode.EDIT, element.currentTarget, {
                      id: option.value,
                      name: option.label,
                      color: option.color
                    })
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={option.value === selectedCategory}
                  onClick={(element) => {
                    element.stopPropagation()
                    openEditor(EditorMode.DELETE, element.currentTarget, {
                      id: option.value,
                      name: option.label,
                      color: option.color
                    })
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </Selector>

      <AddButton
        onClick={(element) =>
          openEditor(EditorMode.ADD, element.currentTarget, {
            name: "",
            color: "#3b5bdb"
          })
        }
      />

      <CategoryEditor
        open={editorOpen}
        anchor={anchor}
        mode={editorMode}
        initialData={editorData}
        onClose={closeEditor}
        onSave={() => {}}
        onDelete={() => {}}
      />
    </Box>
  )
}
