import Calendar from "@/type/domain/calendar"
import Category from "@/type/domain/category"
import Event from "@/type/domain/event"
import Note from "@/type/domain/note"
import Task from "@/type/domain/task"

import { openDB, DBSchema } from "idb"

interface Database extends DBSchema {
  calendars: {
    key: string
    value: Calendar & {
      localOnly?: boolean
      shouldUpdate?: boolean
      shouldDelete?: boolean
    }
  }
  categories: {
    key: string
    value: Category & {
      localOnly?: boolean
      shouldUpdate?: boolean
      shouldDelete?: boolean
    }
  }
  events: {
    key: string
    value: Event & {
      localOnly?: boolean
      shouldUpdate?: boolean
      shouldDelete?: boolean
    }
  }
  tasks: {
    key: string
    value: Task & {
      localOnly?: boolean
      shouldUpdate?: boolean
      shouldDelete?: boolean
    }
  }
  notes: {
    key: string
    value: Note & {
      localOnly?: boolean
      shouldUpdate?: boolean
      shouldDelete?: boolean
    }
  }
}

type StoreName = "calendars" | "categories" | "events" | "tasks" | "notes"

class SynchronizationManager {
  private databasePromise = openDB<Database>("database", 5, {
    upgrade(database) {
      database.createObjectStore("calendars", { keyPath: "id" })
      database.createObjectStore("categories", { keyPath: "id" })
      database.createObjectStore("events", { keyPath: "id" })
      database.createObjectStore("tasks", { keyPath: "id" })
      database.createObjectStore("notes", { keyPath: "id" })
    }
  })

  constructor(
    private addCalendar: (data: Calendar) => Promise<Calendar>,
    private addCategory: (data: Category) => Promise<Category>,
    private addEvent: (data: Event) => Promise<Event>,
    private addTask: (data: Task) => Promise<Task>,
    private addNote: (data: Note) => Promise<Note>,

    private updateCalendar: (
      id: string,
      updated: Partial<Calendar>
    ) => Promise<void>,
    private updateCategory: (
      id: string,
      updated: Partial<Category>
    ) => Promise<void>,
    private updateEvent: (id: string, updated: Partial<Event>) => Promise<void>,
    private updateTask: (id: string, updated: Partial<Task>) => Promise<void>,
    private updateNote: (id: string, updated: Partial<Note>) => Promise<void>,

    private deleteCalendar: (id: string) => Promise<void>,
    private deleteCategory: (id: string) => Promise<void>,
    private deleteEvent: (id: string) => Promise<void>,
    private deleteTask: (id: string) => Promise<void>,
    private deleteNote: (id: string) => Promise<void>
  ) {
    window.addEventListener("online", this.synchronize)
  }

  async saveItem<K extends StoreName>(store: K, data: Database[K]["value"]) {
    const db = await this.databasePromise
    await db.put(store, { ...data, localOnly: true })
  }

  async updateItem<K extends StoreName>(store: K, data: Database[K]["value"]) {
    const db = await this.databasePromise
    await db.put(store, { ...data, shouldUpdate: true })
  }

  async deleteItem<K extends StoreName>(store: K, id: string) {
    const db = await this.databasePromise
    const existing = await db.get(store, id)
    if (existing) {
      await db.put(store, { ...existing, shouldDelete: true })
    }
  }

  synchronize = async () => {
    if (!navigator.onLine) return

    await this.syncStore(
      "calendars",
      this.addCalendar,
      this.updateCalendar,
      this.deleteCalendar
    )
    await this.syncStore(
      "categories",
      this.addCategory,
      this.updateCategory,
      this.deleteCategory
    )
    await this.syncStore(
      "events",
      this.addEvent,
      this.updateEvent,
      this.deleteEvent
    )
    await this.syncStore(
      "tasks",
      this.addTask,
      this.updateTask,
      this.deleteTask
    )
    await this.syncStore(
      "notes",
      this.addNote,
      this.updateNote,
      this.deleteNote
    )
  }

  private async syncStore<K extends StoreName>(
    store: K,
    create: (data: Database[K]["value"]) => Promise<any>,
    update: (
      id: string,
      updated: Partial<Database[K]["value"]>
    ) => Promise<void>,
    remove: (id: string) => Promise<void>
  ) {
    const db = await this.databasePromise
    const allItems = await db.getAll(store)

    for (const item of allItems) {
      try {
        if (item.shouldDelete) {
          await remove(item.id)
          await db.delete(store, item.id)
        } else if (item.shouldUpdate) {
          const { id, ...rest } = item
          const updateData = { ...rest } as Partial<Database[K]["value"]>
          delete updateData.localOnly
          delete updateData.shouldUpdate
          delete updateData.shouldDelete
          await update(id, updateData)
          await db.delete(store, id)
        } else if (item.localOnly) {
          await create(item)
          await db.delete(store, item.id)
        }
      } catch (err) {
        console.error(
          `Synchronization failed for ${store} item: ${item.id}`,
          err
        )
      }
    }
  }
}

export default SynchronizationManager
