import useAppStore from "@/store/useAppStore";
import * as eventService from "@/service/event.service";
import type Event from "@/model/domain/event";

export const loadEvents = async () => {
  const events = await eventService.getEvents();
  useAppStore.getState().setEvents(events);
};

export const addEvent = async (event: Partial<Event>) => {
  const created = await eventService.createEvent(event);
  useAppStore.getState().setEvents([
    ...useAppStore.getState().events,
    created
  ]);
};

export const updateEvent = async (event: Event) => {
  const updated = await eventService.updateEvent(event.id, event);
  useAppStore.getState().setEvents(
    useAppStore.getState().events.map((e) =>
      e.id === updated.id ? updated : e
    )
  );
};

export const deleteEvent = async (id: string) => {
  await eventService.deleteEvent(id);
  useAppStore.getState().setEvents(
    useAppStore.getState().events.filter((e) => e.id !== id)
  );
};
