import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todoList, isLoading, onCompleteTodo, onUpdateTodo }) {
  if (isLoading) return <p>Todo list loading...</p>;
  if (!isLoading && todoList.length === 0)
    return <p>Add todo above to get started</p>;

  // hide completed items (per earlier assignment behavior)
  const filtered = todoList.filter((t) => !t.isCompleted);

  return (
    <ul>
      {filtered.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;

