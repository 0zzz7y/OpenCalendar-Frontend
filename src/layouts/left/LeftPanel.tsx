import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Text,
} from "@mantine/core";
import CustomSelector from "../../components/selector/CustomSelector";
import styles from "./LeftPanel.module.css";

const LeftPanel = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState([
    { value: "work", label: "Work", emoji: "🧠" },
    { value: "groceries", label: "Groceries", emoji: "🛒" },
    { value: "fun", label: "Fun", emoji: "🎉" },
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentEditValue, setCurrentEditValue] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const handleEdit = (value: string) => {
    const item = options.find((opt) => opt.value === value);
    if (item) {
      setCurrentEditValue(value);
      setNewLabel(item.label);
      setEditModalOpen(true);
    }
  };

  const handleDelete = (value: string) => {
    setCurrentEditValue(value);
    setDeleteModalOpen(true);
  };

  const confirmEdit = () => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.value === currentEditValue ? { ...opt, label: newLabel } : opt
      )
    );
    setEditModalOpen(false);
  };

  const confirmDelete = () => {
    setOptions((prev) =>
      prev.filter((opt) => opt.value !== currentEditValue)
    );
    if (selected === currentEditValue) setSelected(null);
    setDeleteModalOpen(false);
  };
  const handleAdd = (newOption: Option) => {
    setOptions((prev) => [...prev, newOption]);
  };
  
  return (
    <div className={styles.panel}>
      <CustomSelector
        data={options}
        value={selected}
        onChange={setSelected}
        onEdit={handleEdit}
        onDelete={handleDelete} onAdd={handleAdd}
        />

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit category name"
        centered
      >
        <TextInput
          label="New label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.currentTarget.value)}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmEdit}>Save</Button>
        </Group>
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm deletion"
        centered
      >
        <Text>
          Are you sure you want to delete this category?
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default LeftPanel;
