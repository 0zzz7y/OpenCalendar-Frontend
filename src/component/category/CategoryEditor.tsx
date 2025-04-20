import { useEffect, useRef, useState } from "react"
import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener
} from "@mui/material"

import useAppContext from "@/hook/context/useAppContext" // Using global AppContext
import { createPortal } from "react-dom"

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
    reloadCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useAppContext() // Accessing state from AppContext

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
                {editorMode === "add" ? "New category" : "Edit category"}
              </Typography>

              <TextField
                inputRef={inputRef}
                placeholder="Category name"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />

              <Box
                mt={2}
                mb={1}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" fontWeight={500}>
                  Selected color:
                </Typography>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: color
                  }}
                />
              </Box>

              {/* You can add a color picker component here */}

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editorMode === "add" ? handleAdd : handleEdit}
                disabled={loading}
              >
                {editorMode === "add" ? "Add" : "Save"}
              </Button>
            </>
          )}

          {editorMode === "delete" && (
            <>
              <Typography variant="body2">
                Are you sure you want to delete this category?
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={closeEditor}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
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
