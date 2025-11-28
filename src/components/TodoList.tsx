import { ActionIcon, Button, Group, List, Text } from "@mantine/core";
import { IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";
import type { Todo } from "generated/prisma";

interface Props {
  todos: Todo[];
  onRemoveTodo: (id: number) => void;
  onToggleTodo: (id: number, completed: boolean) => void;
  removePending: boolean;
  togglePending: boolean;
}

export default function TodoList({
  todos,
  onRemoveTodo,
  onToggleTodo,
  removePending,
  togglePending,
}: Props) {
  return (
    <List>
      {todos.map((todo) => (
        <List.Item
          style={{ marginTop: "0.25rem" }}
          key={todo.id}
          icon={
            <ActionIcon
              type="button"
              color={todo.completed ? "teal" : "grey"}
              size={24}
              radius="xl"
              disabled={togglePending}
              aria-pressed={todo.completed}
              onClick={() => onToggleTodo(todo.id, !todo.completed)}
            >
              {todo.completed ? (
                <IconCircleCheck size="1rem" />
              ) : (
                <IconCircleDashed size="1rem" />
              )}
            </ActionIcon>
          }
        >
          <Group>
            <Text
              style={{
                textOverflow: "ellipsis",
                width: "120px",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {todo.title}
            </Text>
            <Button
              type="button"
              onClick={() => onRemoveTodo(todo.id)}
              disabled={removePending}
            >
              Remove
            </Button>
          </Group>
        </List.Item>
      ))}
    </List>
  );
}
