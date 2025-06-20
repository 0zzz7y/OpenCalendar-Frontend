import type { PaginatedResponse } from "@/features/crud/paginatedResponse.type"

export interface CrudController<TDto> {
  create: (dto: TDto) => Promise<TDto>
  getById: (id: string) => Promise<TDto>
  getAll: () => Promise<TDto[]>
  update: (id: string, dto: TDto) => Promise<TDto>
  delete: (id: string) => Promise<void>
}

function getAuthenticationHeaders(): HeadersInit {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${text}`)
  }

  if (response.status === 204) return undefined as unknown as T
  return await response.json()
}

export function createCrudController<TDto>(resource: string): CrudController<TDto> {
  const url = `${resource}`

  async function create(dto: TDto): Promise<TDto> {
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthenticationHeaders(),
      body: JSON.stringify(dto)
    })
    return await handleResponse<TDto>(response)
  }

  async function getById(id: string): Promise<TDto> {
    const response = await fetch(`${url}/${id}`, {
      headers: getAuthenticationHeaders()
    })
    return await handleResponse<TDto>(response)
  }

  async function getAll(): Promise<TDto[]> {
    const allItems: TDto[] = []
    let pageIndex = 0
    let totalPages = 1

    while (pageIndex < totalPages) {
      const response = await fetch(`${url}?page=${pageIndex}`, {
        headers: getAuthenticationHeaders()
      })
      const page = await handleResponse<PaginatedResponse<TDto>>(response)
      allItems.push(...page.content)
      totalPages = page.totalPages
      pageIndex += 1
    }

    return allItems
  }

  async function update(id: string, dto: TDto): Promise<TDto> {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: getAuthenticationHeaders(),
      body: JSON.stringify(dto)
    })
    return await handleResponse<TDto>(response)
  }

  async function remove(id: string): Promise<void> {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: getAuthenticationHeaders()
    })
    await handleResponse<TDto>(response)
  }

  return { create, getAll, getById, update, delete: remove }
}
