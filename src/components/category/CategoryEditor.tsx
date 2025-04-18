import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener
} from "@mui/material"

import { Sketch } from "@uiw/react-color"
import { useEffect, useRef, useState } from "react"
import axios from "axios"

interface CategoryEditorProperties {
  editMode: "add" | "edit" | "delete"
  labelInput: string
  setLabelInput: (val: string) => void
  colorInput: string
  setColorInput: (val: string) => void
  onClose: () => void

  onAddLocal: (id: string) => void
  onEditLocal: () => void
  onDeleteLocal: () => void

  categoryId?: string
}

const CategoryEditor = ({
  editMode,
  labelInput,
  setLabelInput,
  colorInput,
  setColorInput,
  onClose,
  onAddLocal,
  onEditLocal,
  onDeleteLocal,
  categoryId
}: CategoryEditorProperties) => {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(labelInput.length, labelInput.length)
    }
  }, [editMode])

  const handleAdd = async () => {
    if (!labelInput.trim()) return
    try {
      setLoading(true)
      const response = await axios.post("/categories", {
        name: labelInput,
        color: colorInput
      })
      const newId = response.data.id
      onAddLocal(newId)
    } catch (e) {
      console.error("Error creating category", e)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleEdit = async () => {
    if (!labelInput.trim() || !categoryId) return
    try {
      setLoading(true)
      await axios.put(`/categories/${categoryId}`, {
        name: labelInput,
        color: colorInput
      })
      onEditLocal()
    } catch (e) {
      console.error("Error editing category", e)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleDelete = async () => {
    if (!categoryId) return
    try {
      setLoading(true)
      await axios.delete(`/categories/${categoryId}`)
      onDeleteLocal()
    } catch (e) {
      console.error("Error deleting category", e)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ p: 2, width: 280, boxShadow: 3, borderRadius: 2 }}>
          {(editMode === "add" || editMode === "edit") && (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={500}
                gutterBottom
              >
                {editMode === "add" ? "New category" : "Edit name"}
              </Typography>

              <TextField
                inputRef={inputRef}
                placeholder="Name"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />

              <Box mt={2}>
                <Sketch
                  color={colorInput}
                  onChange={(color) => setColorInput(color.hex)}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editMode === "add" ? handleAdd : handleEdit}
                disabled={loading}
              >
                {editMode === "add" ? "ADD" : "SAVE"}
              </Button>
            </>
          )}

          {editMode === "delete" && (
            <>
              <Typography variant="body2">
                Are you sure you want to delete this category?
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={onClose}>
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
    </>
  )
}

export default CategoryEditor
