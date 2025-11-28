import { api } from "~/utils/api";

export function useTodos(onCreateTodo: () => void) {
  const utils = api.useUtils();
  const {
    data: todos,
    isLoading,
    isFetching,
  } = api.todo.list.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  api.todo.onTodoAdd.useSubscription(undefined, {
    onData: (todo) => {
      utils.todo.list.setData(undefined, (old) => {
        if (!old) return [todo.data];
        return [todo.data, ...old];
      });
    },
  });

  api.todo.onTodoRemove.useSubscription(undefined, {
    onData: (todoId) => {
      utils.todo.list.setData(undefined, (old) => {
        if (!old) return [];
        return old.filter((todo) => todo.id !== todoId.data);
      });
    },
  });

  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      onCreateTodo();
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

  return {
    pending,
    createTodo,
    toggleTodo,
    removeTodo,
    todos,
    isLoading,
    isFetching,
  };
}
