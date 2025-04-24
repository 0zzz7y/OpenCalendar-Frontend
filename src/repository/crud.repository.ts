import { useCallback } from "react";
import useAppStore from "@/store/useAppStore";

/** Helpers */
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getId(obj: any): string {
  return obj.id;
}

export function createUseCrud<Domain, CreateDto, RawDto>(
  resourceKey: string,
  service: {
    getAll: () => Promise<RawDto[]>;
    create: (dto: CreateDto) => Promise<RawDto>;
    update: (id: string, dto: CreateDto) => Promise<RawDto>;
    delete: (id: string) => Promise<void>;
  },
  toDto: (obj: CreateDto) => CreateDto,
  fromDto: (obj: RawDto) => Domain
) {
  return () => {
    const store = useAppStore();
    const items: Domain[] = (store as any)[resourceKey] || [];
    const setterName = `set${capitalize(resourceKey)}`;
    const setItems: (list: Domain[]) => void = (store as any)[setterName];

    const reload = useCallback(async () => {
      const raw = await service.getAll();
      setItems(raw.map(fromDto));
    }, [service, setItems]);

    const add = useCallback(async (dto: CreateDto) => {
      const raw = await service.create(dto);
      const domain = fromDto(raw);
      setItems([...items, domain]);
      return domain;
    }, [service, items, setItems]);

    const update = useCallback(async (id: string, dto: CreateDto) => {
      const raw = await service.update(id, dto);
      const domain = fromDto(raw);
      setItems(items.map(item => (getId(item) === id ? domain : item)));
      return domain;
    }, [service, items, setItems]);

    const remove = useCallback(async (id: string) => {
      await service.delete(id);
      setItems(items.filter(item => getId(item) !== id));
    }, [service, items, setItems]);

    return { reload, add, update, remove };
  };
}
