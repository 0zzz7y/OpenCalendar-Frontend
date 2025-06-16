import { useCallback } from "react"

import type { CrudController } from "@/features/crud/crud.controller"
import type { CrudRepository } from "@/features/crud/crud.repository"

export function createCrudService<Domain extends { id: string }, CreateDto extends Dto, Dto>(
  controller: CrudController<Dto>,
  repository: CrudRepository<Domain>,
  toDto: (domain: Partial<Domain>) => CreateDto,
  fromDto: (dto: Dto) => Domain,
  validate: (domain: Partial<Domain>) => void
) {
  const reload = useCallback(async () => {
    const dtos = await controller.getAll()
    repository.setAll(dtos.map(fromDto))
  }, [controller, repository, fromDto])

  const add = useCallback(
    async (partial: Partial<Domain>): Promise<Domain> => {
      validate(partial)
      const dto = toDto(partial)
      const created = await controller.create(dto)
      const domain = fromDto(created)
      repository.add(domain)
      return domain
    },
    [controller, repository, toDto, fromDto, validate]
  )

  const update = useCallback(
    async (partial: Partial<Domain> & { id: string }): Promise<Domain> => {
      validate(partial)
      const dto = toDto(partial)
      const updated = await controller.update(partial.id, dto)
      const domain = fromDto(updated)
      repository.update(domain)
      return domain
    },
    [controller, repository, toDto, fromDto, validate]
  )

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await controller.delete(id)
      repository.remove(id)
    },
    [controller, repository]
  )

  return {
    reload,
    add,
    update,
    remove
  }
}
