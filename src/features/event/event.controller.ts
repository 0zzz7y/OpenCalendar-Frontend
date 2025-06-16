import { createCrudController } from "@/features/crud/crud.controller"

import { useApiUrl } from "@/utilities/api.utility"

import type { EventDto } from "@/features/event/event.dto"

export function useEventController() {
  const apiUrl = useApiUrl()
  return createCrudController<EventDto>(`${apiUrl}/api/v1/events`)
}
