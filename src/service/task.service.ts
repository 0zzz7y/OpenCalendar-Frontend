import type TaskDto from "@/model/dto/task.dto";
import { createCrudService } from "./crud.service";

export const { getAll: getTasks, create: createTask, update: updateTask, delete: deleteTask } = createCrudService<TaskDto>("tasks");
