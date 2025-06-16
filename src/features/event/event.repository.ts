import { createCrudRepository } from "@/features/crud/crud.repository"

import type { Event } from "@/features/event/event.model"

export function useEventRepository() {
  return createCrudRepository<Event>("events")
}
