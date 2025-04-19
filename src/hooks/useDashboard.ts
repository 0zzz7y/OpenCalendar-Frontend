import useEvents from "./useEvents"
import useTasks from "./useTasks"
import useNotes from "./useNotes"
import useCalendars from "./useCalendars"
import useCategories from "./useCategories"

const useDashboard = () => {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    reloadEvents,
    loadNextPage: loadMoreEvents,
    page: eventsPage,
    totalPages: eventsTotalPages,
    isLoadingMore: isLoadingEvents
  } = useEvents()

  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    reloadTasks,
    loadNextPage: loadMoreTasks,
    page: tasksPage,
    totalPages: tasksTotalPages,
    isLoadingMore: isLoadingTasks
  } = useTasks()

  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    reloadNotes,
    loadNextPage: loadMoreNotes,
    page: notesPage,
    totalPages: notesTotalPages,
    isLoadingMore: isLoadingNotes
  } = useNotes()

  const {
    calendars,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    reloadCalendars,
    loadNextPage: loadMoreCalendars,
    page: calendarsPage,
    totalPages: calendarsTotalPages,
    isLoadingMore: isLoadingCalendars
  } = useCalendars()

  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reloadCategories,
    loadNextPage: loadMoreCategories,
    page: categoriesPage,
    totalPages: categoriesTotalPages,
    isLoadingMore: isLoadingCategories
  } = useCategories()

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    reloadEvents,
    loadMoreEvents,
    eventsPage,
    eventsTotalPages,
    isLoadingEvents,

    tasks,
    addTask,
    updateTask,
    deleteTask,
    reloadTasks,
    loadMoreTasks,
    tasksPage,
    tasksTotalPages,
    isLoadingTasks,

    notes,
    addNote,
    updateNote,
    deleteNote,
    reloadNotes,
    loadMoreNotes,
    notesPage,
    notesTotalPages,
    isLoadingNotes,

    calendars,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    reloadCalendars,
    loadMoreCalendars,
    calendarsPage,
    calendarsTotalPages,
    isLoadingCalendars,

    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reloadCategories,
    loadMoreCategories,
    categoriesPage,
    categoriesTotalPages,
    isLoadingCategories
  }
}

export default useDashboard
