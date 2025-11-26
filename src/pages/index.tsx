import Head from "next/head";
import { type FormEvent, useMemo, useState } from "react";

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
        <title>tRPC Todo List</title>
        <meta
          name="description"
          content="Manage your tasks with a tiny tRPC-powered todo list."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
              Tasks
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              What&apos;s on your mind today?
            </h1>
            <p className="text-base text-slate-400">{hint}</p>
          </header>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor="todo-input">
                Add todo
              </label>
              <input
                id="todo-input"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-base text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                placeholder="Add a new task and hit Enter"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={createTodo.isPending}
              />
              <button
                type="submit"
                disabled={createTodo.isPending || !title.trim()}
                className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {createTodo.isPending ? "Adding…" : "Add task"}
              </button>
            </form>

            <div className="mt-6">
              {isLoading ? (
                <p className="text-center text-sm text-slate-400">
                  Loading your tasks…
                </p>
              ) : !todos?.length ? (
                <p className="text-center text-sm text-slate-500">
                  No todos yet. Start by adding something you need to get done.
                </p>
              ) : (
                <ul className="space-y-3">
                  {todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleTodo.mutate({
                            id: todo.id,
                            completed: !todo.completed,
                          })
                        }
                        className="flex flex-1 items-center gap-3 text-left"
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
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTodo.mutate({ id: todo.id })}
                        className="ml-3 rounded-lg border border-transparent px-3 py-1 text-sm text-slate-400 transition hover:border-red-500 hover:text-red-400"
                        disabled={removeTodo.isPending}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
