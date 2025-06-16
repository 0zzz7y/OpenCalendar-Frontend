import { useState, useEffect, useRef, useCallback } from "react"
import { Box, Input, TextField, Typography } from "@mui/material"

import { Popover } from "../library/popover/Popover"
import { SaveButton } from "../library/button/SaveButton"
import { CancelButton } from "../library/button/CancelButton"

import { EditorMode } from "../shared/editorMode.type"
import { BUTTON } from "../library/button/button.constant"
import { LABEL } from "../shared/label.constant"
import { MESSAGE } from "../shared/message.constant"
import { useCategory } from "@/features/category/useCategory.hook"
import { COLOR } from "@/themes/color.constant"

interface CategoryEditorProperties {
  open: boolean
  anchor: HTMLElement | null
  mode: EditorMode
  initialData: { id?: string; name?: string; color?: string }
  onClose: () => void
  onSave: (payload: { id?: string; name: string; color: string }) => void
  onDelete: (id: string) => void
}

export default function CategoryEditor({
  open,
  anchor,
  mode,
  initialData,
  onClose,
  onDelete
}: CategoryEditorProperties) {
  const { reloadCategories, addCategory, updateCategory, deleteCategory } = useCategory()
  const inputReference = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState({ name: "", color: "#3b5bdb" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData.name?.trim() || "",
        color: initialData.color || COLOR.WHITE
      })
      setTimeout(() => inputReference.current?.focus(), 100)
    }
  }, [open, initialData])

  const handleChange = useCallback((field: "name" | "color", value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }))
  }, [])

  const handleSave = useCallback(async () => {
    if (!form.name) return
    setLoading(true)
    try {
      if (mode === EditorMode.ADD) {
        await addCategory({ name: form.name, color: form.color })
      } else if (mode === EditorMode.EDIT && initialData.id) {
        await updateCategory({
          id: initialData.id,
          name: form.name,
          color: form.color
        })
      }
      await reloadCategories()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [form, mode, initialData.id, addCategory, updateCategory, reloadCategories, onClose])

  const handleDelete = useCallback(async () => {
    if (!initialData.id) return
    setLoading(true)
    try {
      await deleteCategory(initialData.id)
      await reloadCategories()
      onDelete(initialData.id)
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [initialData.id, deleteCategory, reloadCategories, onClose, onDelete])

  return (
    <Popover open={open} anchor={anchor} onClose={onClose}>
      <Box sx={{ width: 280 }} paddingRight={2}>
        {(mode === EditorMode.ADD || mode === EditorMode.EDIT) && (
          <>
            <Typography variant="subtitle2" color="primary" fontWeight={500}>
              {mode === EditorMode.ADD ? MESSAGE.ADD_CATEGORY : MESSAGE.EDIT_CATEGORY}
            </Typography>

            <TextField
              inputRef={inputReference}
              placeholder={LABEL.NAME}
              value={form.name}
              onChange={(element) => handleChange("name", element.target.value)}
              fullWidth
              size="small"
              margin="dense"
            />

            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
              <Input
                type="color"
                value={form.color}
                onChange={(element) => handleChange("color", element.target.value)}
                sx={{ minWidth: 40 }}
              />
              <SaveButton onClick={handleSave} loading={loading} />
            </Box>
          </>
        )}

        {mode === EditorMode.DELETE && (
          <>
            <Typography variant="body2">{MESSAGE.CONFIRM_DELETE_CATEGORY}</Typography>
            <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
              <CancelButton onClick={onClose} />
              <SaveButton onClick={handleDelete} loading={loading} label={BUTTON.DELETE} />
            </Box>
          </>
        )}
      </Box>
    </Popover>
  )
}
