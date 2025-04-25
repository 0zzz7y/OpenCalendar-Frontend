enum MESSAGE {
  NEW_EVENT = "New event",
  NEW_TASK = "New task",
  NEW_NOTE = "New note",

  ADD_EVENT = "Add event",
  ADD_TASK = "Add task",
  ADD_NOTE = "Add note",
  ADD_CATEGORY = "Add category",
  ADD_CALENDAR = "Add calendar",

  EDIT_EVENT = "Edit event",
  EDIT_TASK = "Edit task",
  EDIT_NOTE = "Edit note",
  EDIT_CATEGORY = "Edit category",
  EDIT_CALENDAR = "Edit calendar",

  EMPTY_STATE = "No data available.",
  EMPTY_STATE_CALENDAR = "No calendars available.",
  EMPTY_STATE_CATEGORY = "No categories available.",
  EMPTY_STATE_EVENT = "No events available.",
  EMPTY_STATE_TASK = "No tasks available.",
  EMPTY_STATE_NOTE = "No notes available.",

  EVENT_CREATED_SUCCESSFULLY = "Event created successfully.",
  EVENT_UPDATED_SUCCESSFULLY = "Event updated successfully.",
  EVENT_DELETED_SUCCESSFULLY = "Event deleted successfully.",

  EVENT_SAVE_FAILED = "Failed to save event.",
  EVENT_DELETE_FAILED = "Failed to delete event.",

  TASK_CREATED_SUCCESSFULLY = "Task created successfully.",
  TASK_UPDATED_SUCCESSFULLY = "Task updated successfully.",
  TASK_DELETED_SUCCESSFULLY = "Task deleted successfully.",

  TASK_SAVE_FAILED = "Failed to save task.",
  TASK_DELETE_FAILED = "Failed to delete task.",

  NOTE_CREATED_SUCCESSFULLY = "Note created successfully.",
  NOTE_UPDATED_SUCCESSFULLY = "Note updated successfully.",
  NOTE_DELETED_SUCCESSFULLY = "Note deleted successfully.",

  NOTE_SAVE_FAILED = "Failed to save note.",
  NOTE_DELETE_FAILED = "Failed to delete note.",

  CATEGORY_CREATED_SUCCESSFULLY = "Category created successfully.",
  CATEGORY_UPDATED_SUCCESSFULLY = "Category updated successfully.",
  CATEGORY_DELETED_SUCCESSFULLY = "Category deleted successfully.",

  CATEGORY_SAVE_FAILED = "Failed to save category.",
  CATEGORY_DELETE_FAILED = "Failed to delete category.",

  CALENDAR_CREATED_SUCCESSFULLY = "Calendar created successfully.",
  CALENDAR_UPDATED_SUCCESSFULLY = "Calendar updated successfully.",
  CALENDAR_DELETED_SUCCESSFULLY = "Calendar deleted successfully.",

  CALENDAR_SAVE_FAILED = "Failed to save calendar.",
  CALENDAR_DELETE_FAILED = "Failed to delete calendar.",

  CONFIRM_CLEAR_CONTENTS = "Are you sure you want to clear contents?",
  CONFIRM_CLEAR_TEXT = "Are you sure you want to clear text?",

  CONFIRM_DELETE_CALENDAR = "Are you sure you want to delete this calendar?",
  CONFIRM_DELETE_CATEGORY = "Are you sure you want to delete this category?",
  CONFIRM_DELETE_EVENT = "Are you sure you want to delete this event?",
  CONFIRM_DELETE_TASK = "Are you sure you want to delete this task?",
  CONFIRM_DELETE_NOTE = "Are you sure you want to delete this note?",

  TITLE_REQUIRED = "Title is required.",
  CALENDAR_REQUIRED = "Calendar is required.",
  END_AFTER_START = "End date must be after start date."
}

export default MESSAGE
