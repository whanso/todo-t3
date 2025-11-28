import { useCallback, useMemo, type JSX } from "react";
import { useTodos } from "~/hooks/useTodos";
import TodoList from "./TodoList";

interface Props {
  form: JSX.Element;
}

export default function Todos({ form }: Props) {
  const { todos, removeTodo, toggleTodo, isLoading, isFetching, pending } =
    useTodos();

  const hint = useMemo(() => {
    if (pending) return "Saving changes…";
    if (isFetching) return "Refreshing list…";
    if (!todos?.length) return "No tasks yet. Add your first one!";
    const remaining = todos.filter((todo) => !todo.completed).length;
    return remaining
      ? `${remaining} task${remaining === 1 ? "" : "s"} left`
      : "All tasks done 🎉";
  }, [isFetching, todos, pending]);

  const handleRemoveTodo = useCallback(
    (id: number) => {
      removeTodo.mutate({ id });
    },
    [removeTodo],
  );

  const handleToggleTodo = useCallback(
    (id: number, completed: boolean) => {
      toggleTodo.mutate({ id, completed });
    },
    [toggleTodo],
  );
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <header>
        <h1>{`What's on your mind today?`}</h1>
        <p>{hint}</p>
      </header>

      <section>
        {form}
        <div>
          {isLoading ? (
            <p>Loading your tasks…</p>
          ) : !todos?.length ? (
            <p>No todos yet. Start by adding something you need to get done.</p>
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
  );
}
