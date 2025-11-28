import { Button, Group, TextInput } from "@mantine/core";
import { useState, type FormEvent } from "react";

interface Props {
  onSubmit: (title: string) => void;
  createPending: boolean;
}

export default function TodoForm({ onSubmit, createPending }: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Group align="flex-end">
        <TextInput
          label="Add todo"
          id="todo-input"
          placeholder="Add a new task and hit Enter"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={createPending}
        />
        <Button type="submit" disabled={createPending || !title.trim()}>
          {createPending ? "Adding…" : "Add task"}
        </Button>
      </Group>
    </form>
  );
}
