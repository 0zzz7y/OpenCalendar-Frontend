import {
  Combobox,
  useCombobox,
  ComboboxOption,
  InputBase,
  Popover,
  TextInput,
  Button,
  ColorInput,
  Group
} from "@mantine/core";
import { IconTrash, IconPencil, IconCirclePlus } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./CustomSelector.module.css";

interface Option {
  label: string;
  value: string;
  emoji?: string;
  color?: string;
}

interface CustomSelectorProps {
  data: Option[];
  value: string | null;
  onChange: (val: string | null) => void;
  onEdit: (value: string) => void;
  onDelete: (value: string) => void;
  onAdd: (newOption: Option) => void;
}

export default function CustomSelector({
  data,
  value,
  onChange,
  onEdit,
  onDelete,
  onAdd,
}: CustomSelectorProps) {
  const combobox = useCombobox();
  const selectedLabel = data.find((item) => item.value === value)?.label || "";

  const [addOpen, setAddOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#3b5bdb");

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    onAdd({ label: newLabel, value: newLabel.toLowerCase(), color: newColor });
    setNewLabel("");
    setNewColor("#3b5bdb");
    setAddOpen(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      {/* Selector */}
      <Combobox
        store={combobox}
        onOptionSubmit={onChange}
        size="md"
      >
        <Combobox.Target>
  <div style={{ flexGrow: 1 }}>
    <InputBase
      component="button"
      type="button"
      pointer
      variant="filled"
      radius="sm"
      className={styles.selectInput}
      onClick={() => combobox.toggleDropdown()}
    >
      {selectedLabel || "Pick one"}
    </InputBase>
  </div>
</Combobox.Target>


        <Combobox.Dropdown>
          <Combobox.Options>
            {data.map((item) => (
              <ComboboxOption key={item.value} value={item.value}>
                <div className={styles.option}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {item.color && (
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: item.color,
                        }}
                      />
                    )}
                    {item.emoji} {item.label}
                  </span>
                  <span className={styles.actions}>
                    <IconPencil size={16} onClick={(e) => { e.stopPropagation(); onEdit(item.value); }} className={styles.actionIcon} />
                    <IconTrash size={16} onClick={(e) => { e.stopPropagation(); onDelete(item.value); }} className={styles.actionIcon} />
                  </span>
                </div>
              </ComboboxOption>
            ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      {/* Add button + popover */}
      <Popover
        opened={addOpen}
        onChange={setAddOpen}
        position="bottom-end"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <IconCirclePlus
            size={28}
            style={{ cursor: "pointer", color: "#228be6" }}
            onClick={() => setAddOpen((v) => !v)}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <TextInput
            label="Nowa kategoria"
            value={newLabel}
            onChange={(e) => setNewLabel(e.currentTarget.value)}
            placeholder="np. Studia"
            radius="sm"
          />
          <Group mt="sm" justify="space-between">
            <ColorInput
              format="hex"
              value={newColor}
              onChange={setNewColor}
              radius="sm"
              size="xs"
              style={{ flex: 1 }}
            />
            <Button size="xs" radius="sm" style={{ flex: 2 }} onClick={handleAdd}>
              Dodaj
            </Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}
