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

  api.todo.onTodoAction.useSubscription(undefined, {
    onData: ({ data: payload }) => {
      switch (payload.type) {
        case "add": {
          utils.todo.list.setData(undefined, (old) => {
            if (!old) return [payload.data];
            return [payload.data, ...old];
          });
          break;
        }
        case "remove": {
          utils.todo.list.setData(undefined, (old) => {
            if (!old) return [];
            return old.filter((todo) => todo.id !== payload.data);
          });
          break;
        }
        case "toggle": {
          utils.todo.list.setData(undefined, (old) => {
            if (!old) return [];
            return old.map((todo) =>
              todo.id === payload.data.id
                ? { ...todo, completed: payload.data.completed }
                : todo,
            );
          });
          break;
        }
      }
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
