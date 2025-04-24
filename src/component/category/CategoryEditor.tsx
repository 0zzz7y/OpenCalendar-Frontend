import { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  ClickAwayListener,
  Input,
  Paper,
  Popover,
  TextField,
  Typography
} from "@mui/material"
import type Category from "@/model/domain/category"
import useCategory from "@/hook/useCategory"
import useAppStore from "@/store/useAppStore"
import MESSAGES from "@/constant/ui/messages"
import BUTTONS from "@/constant/ui/buttons"
import PLACEHOLDERS from "@/constant/ui/labels"
import EditorMode from "@/model/utility/editorMode"

interface CategoryEditorProperties {
  open: boolean
  anchorEl: HTMLElement | null
  mode: EditorMode.ADD | EditorMode.EDIT | EditorMode.DELETE
  initialData?: Partial<Category>
  onClose: () => void
}

const CategoryEditor = ({
  open,
  anchorEl,
  mode,
  initialData,
  onClose
}: CategoryEditorProperties) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const {
    addCategory,
    updateCategory,
    deleteCategory,
    reloadCategories
  } = useCategory()
  const selectedCategory = useAppStore((s) => s.selectedCategory)
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory)

  const [label, setLabel] = useState("")
  const [color, setColor] = useState("#3b5bdb")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLabel(initialData?.name ?? "")
      setColor(initialData?.color ?? "#3b5bdb")
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, initialData])

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (!anchorEl?.contains(event.target as Node)) {
      onClose()
    }
  }

  const handleSave = async () => {
    if (!label.trim()) return
    setLoading(true)
    try {
      if (mode === EditorMode.ADD) {
        const created = await addCategory({ name: label.trim(), color })
        await reloadCategories()
        setSelectedCategory(created.id)
      } else if (mode === EditorMode.EDIT && initialData?.id) {
        await updateCategory(initialData.id, { name: label.trim(), color })
        await reloadCategories()
      }
      onClose()
    } catch (e) {
      console.error("Failed to save category", e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    setLoading(true)
    try {
      await deleteCategory(initialData.id)
      await reloadCategories()
      if (selectedCategory === initialData.id) {
        setSelectedCategory("all")
      }
      onClose()
    } catch (e) {
      console.error("Failed to delete category", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper sx={{ p: 2, width: 280 }}>
          {(mode === EditorMode.ADD || mode === EditorMode.EDIT) && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                {mode === EditorMode.ADD ? BUTTONS.ADD : BUTTONS.SAVE}
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
                  onClick={handleSave}
                  disabled={loading}
                >
                  {mode === EditorMode.ADD ? BUTTONS.ADD : BUTTONS.SAVE}
                </Button>
              </Box>
            </>
          )}
          {mode === EditorMode.DELETE && (
            <>
              <Typography variant="body2">
                {MESSAGES.CONFIRM_DELETE_CATEGORY}
              </Typography>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={onClose}>
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
    </Popover>
  )
}

export default CategoryEditor
