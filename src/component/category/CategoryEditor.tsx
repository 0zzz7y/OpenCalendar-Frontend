import { useEffect, useRef, useState } from "react"

import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener
} from "@mui/material"

import useCategoryContext from "../../hook/context/useCategoryContext"
import useCategories from "../../hook/api/useCategory"
import MESSAGES from "../../constant/message"

const CategoryEditor = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const {
    editorOpen,
    editorMode,
    editorData,
    closeEditor,
    selectedCategory,
    setSelectedCategory,
    reloadCategories
  } = useCategoryContext()

  const { addCategory, updateCategory, deleteCategory } = useCategories()

  const [label, setLabel] = useState("")
  const [color, setColor] = useState("#3b5bdb")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editorOpen) {
      setLabel(editorData.label || "")
      setColor(editorData.color || "#3b5bdb")

      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [editorOpen, editorData])

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      closeEditor()
    }
  }

  const handleAdd = async () => {
    if (!label.trim()) return
    setLoading(true)
    try {
      const created = await addCategory({ name: label.trim(), color })
      await reloadCategories()
      setSelectedCategory(created.id)
      closeEditor()
    } catch (e) {
      console.error("Failed to add category", e)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!label.trim() || !editorData.id) return
    setLoading(true)
    try {
      await updateCategory(editorData.id, { name: label.trim(), color })
      await reloadCategories()
      closeEditor()
    } catch (e) {
      console.error("Failed to update category", e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!editorData.id) return
    setLoading(true)
    try {
      await deleteCategory(editorData.id)
      await reloadCategories()
      if (selectedCategory === editorData.id) {
        setSelectedCategory("all")
      }
      closeEditor()
    } catch (e) {
      console.error("Failed to delete category", e)
    } finally {
      setLoading(false)
    }
  }

  if (!editorOpen) return null

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper
          ref={containerRef}
          sx={{ p: 2, width: 280, boxShadow: 3, borderRadius: 2 }}
        >
          {(editorMode === "add" || editorMode === "edit") && (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={500}
                gutterBottom
              >
                {editorMode === "add"
                  ? MESSAGES.PLACEHOLDERS.NEW_NOTE
                  : "Edit category"}
              </Typography>

              <TextField
                inputRef={inputRef}
                placeholder={MESSAGES.PLACEHOLDERS.NAME}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />

              <TextField
                label="Color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
                sx={{ mt: 1 }}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editorMode === "add" ? handleAdd : handleEdit}
                disabled={loading}
              >
                {editorMode === "add"
                  ? MESSAGES.BUTTONS.ADD
                  : MESSAGES.BUTTONS.SAVE}
              </Button>
            </>
          )}

          {editorMode === "delete" && (
            <>
              <Typography variant="body2">
                {MESSAGES.POPOVER.CONFIRM_DELETE_NOTE}
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={closeEditor}>
                  {MESSAGES.BUTTONS.CANCEL}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {MESSAGES.BUTTONS.DELETE}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </ClickAwayListener>
    </>
  )
}

export default CategoryEditor
