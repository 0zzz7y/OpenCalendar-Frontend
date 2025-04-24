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

const useCrudTask = createUseCrud<Task, TaskDto, TaskDto>(
  "tasks",
  {
    getAll: getTasks,
    create: createTask,
    update: serviceUpdateTask,
    delete: serviceDeleteTask
  },
  taskToDto,
  (dto) => dtoToTask(dto, useAppStore().calendars, useAppStore().categories)
)

export function useTask() {
  const { reload, add, update, remove } = useCrudTask()
  return {
    reloadTasks: reload,
    addTask: add,
    updateTask: update,
    deleteTask: remove
  }
}

export default useTask
