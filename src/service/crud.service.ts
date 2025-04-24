import PaginatedResponse from "@/model/communication/paginatedResponse";

/**
 * Generic CRUD service factory.
 * @template TDto - DTO type for this resource
 */
export function createCrudService<TDto>(
  /** Base endpoint path, e.g. "tasks" maps to "/api/tasks" */
  resource: string
) {
  const baseUrl = `${resource}`;

  async function getAll(): Promise<TDto[]> {
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error(`Failed to fetch ${resource}: ${res.statusText}`);
    const body: PaginatedResponse<TDto> = await res.json();
    return body.content;
  }

  async function create(dto: TDto): Promise<TDto> {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(`Failed to create ${resource}: ${res.statusText}`);
    return res.json();
  }

  async function update(id: string, dto: TDto): Promise<TDto> {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error(`Failed to update ${resource}: ${res.statusText}`);
    return res.json();
  }

  async function remove(id: string): Promise<void> {
    const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete ${resource}: ${res.statusText}`);
  }

  return { getAll, create, update, delete: remove };
}
