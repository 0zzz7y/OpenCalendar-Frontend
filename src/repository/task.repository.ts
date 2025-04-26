import {
  getTasks,
  createTask,
  updateTask as serviceUpdateTask,
  deleteTask as serviceDeleteTask
} from "@/service/task.service"
import { taskToDto, dtoToTask } from "@/model/mapper/task.mapper"
import type Task from "@/model/domain/task"
import type TaskDto from "@/model/dto/task.dto"
import useAppStore from "@/store/useAppStore"
import { createUseCrud } from "@/repository/crud.repository"
import { showToast } from "@/component/toast/Toast"
import MESSAGE from "@/constant/ui/message"

const useCrudTask = () => {
  const { calendars, categories } = useAppStore()

  const validateTask = (task: Partial<Task>) => {
    if (!task.name) {
      throw new Error("Task title is required")
    }
    // Add other validation rules as needed
  }

  return createUseCrud<Task, TaskDto, TaskDto>(
    "tasks",
    {
      getAll: getTasks,
      create: createTask,
      update: serviceUpdateTask,
      delete: serviceDeleteTask
    },
    taskToDto,
    (dto) => dtoToTask(dto, calendars, categories),
    validateTask
  )()
}

export function useTask() {
  const { reload, add, update, remove } = useCrudTask()

  const addTask = async (data: Partial<Task>): Promise<Task> => {
    try {
      const savedTask = await add(data)
      showToast("success", MESSAGE.TASK_CREATED_SUCCESSFULLY)
      return savedTask
    } catch {
      showToast("error", MESSAGE.TASK_SAVE_FAILED)
      throw new Error(MESSAGE.TASK_SAVE_FAILED)
    }
  }

  const updateTask = async (data: Partial<Task> & { id: string }): Promise<Task> => {
    try {
      const updatedTask = await update(data)
      showToast("success", MESSAGE.TASK_UPDATED_SUCCESSFULLY)
      return updatedTask
    } catch {
      showToast("error", MESSAGE.TASK_SAVE_FAILED)
      throw new Error(MESSAGE.TASK_SAVE_FAILED)
    }
  }

  const deleteTask = async (id: string): Promise<void> => {
    try {
      await remove(id)
      showToast("success", MESSAGE.TASK_DELETED_SUCCESSFULLY)
    } catch {
      showToast("error", MESSAGE.TASK_DELETE_FAILED)
      throw new Error(MESSAGE.TASK_DELETE_FAILED)
    }
  }

  return {
    reloadTasks: reload,
    addTask,
    updateTask,
    deleteTask
  }
}

export default useTask
