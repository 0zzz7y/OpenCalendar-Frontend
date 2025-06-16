import { useTaskService } from "@/features/task/task.service"

export function useTask() {
  const { reload, add, update, remove } = useTaskService()

  return {
    reloadTasks: reload,
    addTask: add,
    updateTask: update,
    deleteTask: remove
  }
}
