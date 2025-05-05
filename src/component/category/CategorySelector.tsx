import { useState, useMemo, useCallback } from "react"
import { Box, Typography, IconButton } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import useApplicationStorage from "@/storage/useApplicationStorage"
import CategoryEditor from "./CategoryEditor"

import EditorMode from "@/model/utility/editorMode"
import LABEL from "@/constant/ui/label"
import FILTER from "@/constant/utility/filter"
import COLOR from "@/constant/ui/color"

import Selector from "@/component/common/selector/Selector"
import AddButton from "@/component/common/button/AddButton"
import ColorDot from "@/component/common/colordot/ColorDot"
import { useCategory, useEvent, useTask, useNote } from "@/repository"

export default function CategorySelector() {
  const categories = useApplicationStorage((state) => state.categories)
  const selectedCategory = useApplicationStorage((state) => state.selectedCategory) || FILTER.ALL
  const setSelectedCategory = useApplicationStorage((state) => state.setSelectedCategory)

  const { reloadCategories } = useCategory()
  const { reloadEvents } = useEvent()
  const { reloadTasks } = useTask()
  const { reloadNotes } = useNote()

  const [editorOpen, setEditorOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.ADD)
  const [editorData, setEditorData] = useState<{
    id?: string
    name?: string
    color?: string
  }>({})

  const categoryOptions = useMemo(() => {
    return [
      { label: FILTER.ALL, value: FILTER.ALL, color: COLOR.WHITE },
      ...categories.map((category) => ({
        label: category.title,
        value: category.id,
        color: category.color
      }))
    ]
  }, [categories])

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

  const handleAfterDelete = useCallback(async () => {
    setSelectedCategory(FILTER.ALL)
    await reloadCategories()
    await reloadEvents()
    await reloadTasks()
    await reloadNotes()
  }, [reloadCategories, setSelectedCategory, reloadEvents, reloadTasks, reloadNotes])

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <Selector label={LABEL.CATEGORY} value={selectedCategory} onChange={handleChange} options={categoryOptions}>
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
        onDelete={handleAfterDelete}
      />
    </Box>
  )
}
