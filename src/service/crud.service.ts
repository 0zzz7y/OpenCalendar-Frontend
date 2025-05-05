/**
 * Copyright (c) Tomasz Wnuk
 */

import type PaginatedResponse from "@/model/communication/paginatedResponse"

export interface CrudService<TDto> {
  getAll: () => Promise<TDto[]>
  create: (dto: TDto) => Promise<TDto>
  update: (id: string, dto: TDto) => Promise<TDto>
  delete: (id: string) => Promise<void>
}

export function createCrudService<TDto>(resource: string): CrudService<TDto> {
  const url = `${resource}`

  async function getAll(): Promise<TDto[]> {
    const allItems: TDto[] = []
    let pageIndex = 0
    let totalPages = 1

    while (pageIndex < totalPages) {
      const res = await fetch(`${url}?page=${pageIndex}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch ${resource} page ${pageIndex}: ${res.statusText}`)
      }
      const page = (await res.json()) as PaginatedResponse<TDto>
      allItems.push(...page.content)
      totalPages = page.totalPages
      pageIndex += 1
    }

    return allItems
  }

  async function create(dto: TDto): Promise<TDto> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    })
    if (!res.ok) throw new Error(`Failed to create ${resource}: ${res.statusText}`)
    return (await res.json()) as TDto
  }

  async function update(id: string, dto: TDto): Promise<TDto> {
    const res = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    })
    if (!res.ok) throw new Error(`Failed to update ${resource}/${id}: ${res.statusText}`)
    return (await res.json()) as TDto
  }

  async function remove(id: string): Promise<void> {
    const res = await fetch(`${url}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error(`Failed to delete ${resource}/${id}: ${res.statusText}`)
  }

  return { getAll, create, update, delete: remove }
}
