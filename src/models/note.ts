export interface Note {
  id: string
  content: string
  drawing?: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  categoryId?: string
}
