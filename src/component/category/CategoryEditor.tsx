import BUTTONS from "@/constant/buttons"
import PLACEHOLDERS from "@/constant/labels"
import MESSAGES from "@/constant/messages"
import useCategory from "@/hook/api/useCategory"
import useEditor from "@/hook/editor/useEditor"
import EditorType from "@/type/editor/editorType"

import { useEffect, useRef, useState } from "react"

import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  TextField,
  Typography,
  Input
} from "@mui/material"
import { createPortal } from "react-dom"

const CategoryEditor = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { reloadCategories, addCategory, updateCategory, deleteCategory } =
    useCategory()

  const {
    editorOpen,
    editorType,
    editorMode,
    editorData,
    closeEditor,
    selectedCategory,
    setSelectedCategory
  } = useEditor()

  const [label, setLabel] = useState("")
  const [color, setColor] = useState("#3b5bdb")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editorOpen && editorType === EditorType.CATEGORY) {
      setLabel(editorData.label || "")
      setColor(editorData.color || "#3b5bdb")

      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [editorOpen, editorData, editorType])

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

  if (!editorOpen || editorType !== EditorType.CATEGORY) return null

  return createPortal(
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper
          ref={containerRef}
          sx={{
            p: 2,
            width: 280,
            boxShadow: 3,
            borderRadius: 2,
            position: "fixed",
            top: 140,
            left: 120,
            zIndex: 2000
          }}
        >
          {(editorMode === "add" || editorMode === "edit") && (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={500}
                gutterBottom
              >
                {editorMode === "add" ? BUTTONS.ADD : BUTTONS.SAVE}
              </Typography>

              <TextField
                inputRef={inputRef}
                placeholder={PLACEHOLDERS.NAME}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />

              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  sx={{ minWidth: 40, flex: 1 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={editorMode === "add" ? handleAdd : handleEdit}
                  disabled={loading}
                >
                  {editorMode === "add" ? BUTTONS.ADD : BUTTONS.SAVE}
                </Button>
              </Box>
            </>
          )}

          {editorMode === "delete" && (
            <>
              <Typography variant="body2">
                {MESSAGES.CONFIRM_DELETE_CATEGORY}
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={closeEditor}>
                  {BUTTONS.CANCEL}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {BUTTONS.DELETE}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </ClickAwayListener>
    </>,
    document.body
  )
}

export default CategoryEditor
