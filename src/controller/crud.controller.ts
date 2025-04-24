import useAppStore from "@/store/useAppStore"
import type { CrudService } from "@/service/crud.service"
import capitalize from "@/utilities/capitalize"

type AppState = ReturnType<typeof useAppStore.getState>

type StateKeysFor<T> = {
  [K in keyof AppState]: AppState[K] extends Array<T> ? K : never
}[keyof AppState]

type SetterKey<K extends string> = `set${Capitalize<K>}`

export function createCrudController<TDto, TDomain extends { id: string }, K extends StateKeysFor<TDomain> & string>(
  resourceKey: K,
  service: CrudService<TDto>,
  mapper: {
    toDto: (domain: Partial<TDomain>) => TDto
    fromDto: (dto: TDto) => TDomain
  }
) {
  const setterKey = capitalize(resourceKey) as SetterKey<K>

  async function load(): Promise<void> {
    const dtos = await service.getAll()
    const items = dtos.map(mapper.fromDto)
    useAppStore.getState()[`set${capitalize(resourceKey)}` as SetterKey<K>](items)
  }

  async function add(partial: Partial<TDomain>): Promise<TDomain> {
    const dto = mapper.toDto(partial)
    const created = await service.create(dto)
    const dom = mapper.fromDto(created)
    const state = useAppStore.getState()
    state[`set${capitalize(resourceKey)}` as SetterKey<K>]([...state[resourceKey], dom])
    return dom
  }

  async function update(item: TDomain): Promise<TDomain> {
    const dto = mapper.toDto(item)
    const updated = await service.update(item.id, dto)
    const dom = mapper.fromDto(updated)
    const state = useAppStore.getState()
    state[`set${capitalize(resourceKey)}` as SetterKey<K>](state[resourceKey].map((i) => (i.id === dom.id ? dom : i)))
    return dom
  }

  async function remove(id: string): Promise<void> {
    await service.delete(id)
    const state = useAppStore.getState()
    state[`set${capitalize(resourceKey)}` as SetterKey<K>](state[resourceKey].filter((i) => i.id !== id))
  }

  return { load, add, update, remove }
}
