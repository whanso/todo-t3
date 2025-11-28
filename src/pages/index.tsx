import Head from "next/head";
import { useMemo } from "react";

import { useTodos } from "~/hooks/useTodos";
import TodoForm from "~/components/TodoForm";
import TodoList from "~/components/TodoList";

export default function Home() {
  const {
    todos,
    createTodo,
    removeTodo,
    toggleTodo,
    isLoading,
    isFetching,
    pending,
  } = useTodos();

  const hint = useMemo(() => {
    if (pending) return "Saving changes…";
    if (isFetching) return "Refreshing list…";
    if (!todos?.length) return "No tasks yet. Add your first one!";
    const remaining = todos.filter((todo) => !todo.completed).length;
    return remaining
      ? `${remaining} task${remaining === 1 ? "" : "s"} left`
      : "All tasks done 🎉";
  }, [isFetching, todos, pending]);

  const handleSubmit = (title: string) => {
    createTodo.mutate({ title });
  };

  const handleRemoveTodo = (id: number) => {
    removeTodo.mutate({ id });
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleTodo.mutate({ id, completed });
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
            <TodoForm
              createPending={createTodo.isPending}
              onSubmit={handleSubmit}
            />

            <div>
              {isLoading ? (
                <p>Loading your tasks…</p>
              ) : !todos?.length ? (
                <p>
                  No todos yet. Start by adding something you need to get done.
                </p>
              ) : (
                <TodoList
                  todos={todos}
                  onToggleTodo={handleToggleTodo}
                  onRemoveTodo={handleRemoveTodo}
                  removePending={removeTodo.isPending}
                  togglePending={toggleTodo.isPending}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
