import { useStorage } from "@/storage/useStorage.hook"

import { capitalize } from "@/utilities/text.utility"

export interface CrudRepository<T> {
  getAll: () => T[]
  getById: (id: string) => T | undefined
  setAll: (list: T[]) => void
  setById: (item: T) => void
  add: (item: T) => void
  update: (item: T) => void
  remove: (id: string) => void
}

export function createCrudRepository<Domain extends { id: string }>(resourceKey: string): CrudRepository<Domain> {
  const storage = useStorage()
  const items = (storage[resourceKey as keyof typeof storage] as unknown as Domain[]) ?? []
  const setItems = storage[`set${capitalize(resourceKey)}` as keyof typeof storage] as unknown as (
    items: Domain[]
  ) => void

  function getAll(): Domain[] {
    return items
  }

  function getById(id: string): Domain | undefined {
    return items.find((i) => i.id === id)
  }

  function setAll(list: Domain[]): void {
    setItems(list)
  }

  function setById(item: Domain): void {
    setItems(items.map((i) => (i.id === item.id ? item : i)))
  }

  function add(item: Domain): void {
    setItems([...items, item])
  }

  function update(updated: Domain): void {
    setItems(items.map((i) => (i.id === updated.id ? updated : i)))
  }

  function remove(id: string): void {
    setItems(items.filter((i) => i.id !== id))
  }

  return {
    getAll,
    getById,
    setAll,
    setById,
    add,
    update,
    remove
  }
}
