// src/controller/crud.controller.ts
import useAppStore from "@/store/useAppStore";
import type { CrudService } from "@/service/crud.service";

// 1. Grab the full AppState shape
type AppState = ReturnType<typeof useAppStore.getState>;

// 2. Compute which keys of AppState are arrays of some domain type
type StateKeysFor<T> = {
  [K in keyof AppState]: AppState[K] extends Array<T> ? K : never
}[keyof AppState];

// 3. For any such key K, the matching setter is “set${Capitalize<K>}”
type SetterKey<K extends string> = `set${Capitalize<K>}`;

// Helper to capitalize string literals
function capitalize<S extends string>(s: S): Capitalize<S> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<S>;
}

/**
 * @template TDto     your DTO type (e.g. CalendarDto)
 * @template TDomain  your domain type (must have an id)
 * @template K        the exact key in AppState whose value is TDomain[]
 */
export function createCrudController<
  TDto,
  TDomain extends { id: string },
  K extends StateKeysFor<TDomain> & string
>(
  resourceKey: K,
  service: CrudService<TDto>,
  mapper: {
    toDto:   (domain: Partial<TDomain>) => TDto;
    fromDto: (dto: TDto)            => TDomain;
  }
) {
  // Now TS knows this setterKey is really on AppState
  const setterKey = capitalize(resourceKey) as SetterKey<K>;

  /** Load all items into the store */
  async function load(): Promise<void> {
    const dtos   = await service.getAll();
    const items  = dtos.map(mapper.fromDto);
    useAppStore.getState()[`set${capitalize(resourceKey)}` as SetterKey<K>](items);
  }

  /** Create one and append */
  async function add(partial: Partial<TDomain>): Promise<TDomain> {
    const dto     = mapper.toDto(partial);
    const created = await service.create(dto);
    const dom     = mapper.fromDto(created);
    const state   = useAppStore.getState();
    state[`set${capitalize(resourceKey)}` as SetterKey<K>]([
      ...state[resourceKey],
      dom,
    ]);
    return dom;
  }

  /** Update one in‐place */
  async function update(item: TDomain): Promise<TDomain> {
    const dto     = mapper.toDto(item);
    const updated = await service.update(item.id, dto);
    const dom     = mapper.fromDto(updated);
    const state   = useAppStore.getState();
    state[`set${capitalize(resourceKey)}` as SetterKey<K>](
      state[resourceKey].map(i => i.id === dom.id ? dom : i)
    );
    return dom;
  }

  /** Delete one by id */
  async function remove(id: string): Promise<void> {
    await service.delete(id);
    const state = useAppStore.getState();
    state[`set${capitalize(resourceKey)}` as SetterKey<K>](
      state[resourceKey].filter(i => i.id !== id)
    );
  }

  return { load, add, update, remove };
}
