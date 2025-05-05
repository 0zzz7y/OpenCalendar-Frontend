/**
 * Copyright (c) Tomasz Wnuk
 */
import { useCallback } from "react"
import useApplicationStorage from "@/storage/useApplicationStorage"
import capitalize from "@/utilities/capitalize"

export function createUseCrud<Domain extends { id: string }, CreateDto, RawDto>(
  resourceKey: string,
  service: {
    getAll: () => Promise<RawDto[]>
    create: (dto: CreateDto) => Promise<RawDto>
    update: (id: string, dto: CreateDto) => Promise<RawDto>
    delete: (id: string) => Promise<void>
  },
  toDto: (domain: Partial<Domain>) => CreateDto,
  fromDto: (raw: RawDto) => Domain,
  validate: (domain: Partial<Domain>) => void
) {
  return () => {
    const { getAll, create: createService, update: updateService, delete: deleteService } = service

    const store = useApplicationStorage()
    const typedStore = store as unknown as Record<string, unknown>

    const items = (typedStore[resourceKey] as Domain[] | undefined) ?? ([] as Domain[])
    const setterName = `set${capitalize(resourceKey)}`
    const setItems = typedStore[setterName] as (list: Domain[]) => void

    const reload = useCallback(async (): Promise<void> => {
      const rawList = await getAll()
      setItems(rawList.map(fromDto))
    }, [getAll, setItems, fromDto])

    const add = useCallback(
      async (domainObj: Partial<Domain>): Promise<Domain> => {
        validate(domainObj) // Validate the input
        const dto = toDto(domainObj)
        const raw = await createService(dto)
        const newDomain = fromDto(raw)
        setItems([...items, newDomain])
        return newDomain
      },
      [createService, toDto, fromDto, items, setItems, validate]
    )

    const update = useCallback(
      async (domainObj: Partial<Domain> & { id: string }): Promise<Domain> => {
        validate(domainObj) // Validate the input
        const dto = toDto(domainObj)
        const raw = await updateService(domainObj.id, dto)
        const updatedDomain = fromDto(raw)
        setItems(items.map((item) => (item.id === domainObj.id ? updatedDomain : item)))
        return updatedDomain
      },
      [updateService, toDto, fromDto, items, setItems, validate]
    )

    const remove = useCallback(
      async (id: string): Promise<void> => {
        await deleteService(id)
        setItems(items.filter((item) => item.id !== id))
      },
      [deleteService, items, setItems]
    )

    return { reload, add, update, remove }
  }
}
