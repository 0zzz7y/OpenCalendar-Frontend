import {
  getTasks,
  createTask,
  updateTask as serviceUpdateTask,
  deleteTask as serviceDeleteTask
} from "@/service/task.service"
import { taskToDto, dtoToTask } from "@/model/mapper/task.mapper"
import type Task from "@/model/domain/task"
import type TaskDto from "@/model/dto/task.dto"
import useApplicationStorage from "@/storage/useApplicationStorage"
import { createUseCrud } from "@/repository/crud.repository"
import MESSAGE from "@/constant/ui/message"

const useCrudTask = () => {
  const { calendars, categories } = useApplicationStorage()

  const validateTask = (task: Partial<Task>) => {
    if (!task.name) {
      throw new Error("Task name is required")
    }
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
      return savedTask
    } catch {
      throw new Error(MESSAGE.TASK_CREATE_FAILED)
    }
  }

  const updateTask = async (data: Partial<Task> & { id: string }): Promise<Task> => {
    try {
      const updatedTask = await update(data)
      return updatedTask
    } catch {
      throw new Error(MESSAGE.TASK_CREATE_FAILED)
    }
  }

  const deleteTask = async (id: string): Promise<void> => {
    try {
      await remove(id)
    } catch {
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
