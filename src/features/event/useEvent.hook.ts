import { useEventService } from "@/features/event/event.service"

export function useEvent() {
  const { reload, add, update, remove } = useEventService()

  return {
    reloadEvents: reload,
    addEvent: add,
    updateEvent: update,
    deleteEvent: remove
  }
}
