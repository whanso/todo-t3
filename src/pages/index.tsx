import Head from "next/head";
import { type FormEvent, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Group,
  List,
  TextInput,
  ThemeIcon,
} from "@mantine/core";

import { api } from "~/utils/api";

export default function Home() {
  const utils = api.useUtils();
  const [title, setTitle] = useState("");

  const {
    data: todos,
    isLoading,
    isFetching,
  } = api.todo.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      setTitle("");
      await utils.todo.list.invalidate();
    },
  });

  const toggleTodo = api.todo.toggle.useMutation({
    onSuccess: async () => {
      await utils.todo.list.invalidate();
    },
  });

  const removeTodo = api.todo.remove.useMutation({
    onSuccess: async () => {
      await utils.todo.list.invalidate();
    },
  });

  const pending =
    createTodo.isPending || toggleTodo.isPending || removeTodo.isPending;

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
      <main>
        <div>
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
                      key={todo.id}
                      icon={
                        <ThemeIcon color="teal" size={24} radius="xl">
                          {/* <IconCircleCheck size="1rem" /> */}
                        </ThemeIcon>
                      }
                    >
                      <Group>
                        <Button
                          type="button"
                          onClick={() =>
                            toggleTodo.mutate({
                              id: todo.id,
                              completed: !todo.completed,
                            })
                          }
                          disabled={toggleTodo.isPending}
                          aria-pressed={todo.completed}
                        >
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                              todo.completed
                                ? "border-indigo-400 bg-indigo-500 text-white"
                                : "border-slate-700 text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                          <span
                            className={`text-base ${
                              todo.completed
                                ? "text-slate-500 line-through"
                                : "text-white"
                            }`}
                          >
                            {todo.title}
                          </span>
                        </Button>
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
