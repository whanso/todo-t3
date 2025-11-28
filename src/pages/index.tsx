import Head from "next/head";
import { type FormEvent, useMemo, useState } from "react";

import { IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";

import {
  ActionIcon,
  Button,
  Group,
  List,
  Text,
  TextInput,
} from "@mantine/core";

import { useTodos } from "~/hooks/useTodos";

export default function Home() {
  const [title, setTitle] = useState("");

  const handleOnCreateTodo = () => {
    setTitle("");
  };

  const {
    todos,
    createTodo,
    removeTodo,
    toggleTodo,
    isLoading,
    isFetching,
    pending,
  } = useTodos(handleOnCreateTodo);

  const hint = useMemo(() => {
    if (pending) return "Saving changes…";
    if (isFetching) return "Refreshing list…";
    if (!todos?.length) return "No tasks yet. Add your first one!";
    const remaining = todos.filter((todo) => !todo.completed).length;
    return remaining
      ? `${remaining} task${remaining === 1 ? "" : "s"} left`
      : "All tasks done 🎉";
  }, [isFetching, todos, pending]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    createTodo.mutate({ title: trimmed });
  };

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta
          name="description"
          content="Manage your tasks with a tiny todo list."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <header>
            <h1>{`What's on your mind today?`}</h1>
            <p>{hint}</p>
          </header>

          <section>
            <form onSubmit={handleSubmit}>
              <Group align="flex-end">
                <TextInput
                  label="Add todo"
                  id="todo-input"
                  placeholder="Add a new task and hit Enter"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={createTodo.isPending}
                />
                <Button
                  type="submit"
                  disabled={createTodo.isPending || !title.trim()}
                >
                  {createTodo.isPending ? "Adding…" : "Add task"}
                </Button>
              </Group>
            </form>

            <div>
              {isLoading ? (
                <p>Loading your tasks…</p>
              ) : !todos?.length ? (
                <p>
                  No todos yet. Start by adding something you need to get done.
                </p>
              ) : (
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
                          disabled={toggleTodo.isPending}
                          aria-pressed={todo.completed}
                          onClick={() =>
                            toggleTodo.mutate({
                              id: todo.id,
                              completed: !todo.completed,
                            })
                          }
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
                          onClick={() => removeTodo.mutate({ id: todo.id })}
                          disabled={removeTodo.isPending}
                        >
                          Remove
                        </Button>
                      </Group>
                    </List.Item>
                  ))}
                </List>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
