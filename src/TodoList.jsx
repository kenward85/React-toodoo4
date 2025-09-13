// src/features/TodoList/TodoList.jsx
import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todoList, isLoading, onCompleteTodo, onUpdateTodo }) {
  if (isLoading) {
    return <p>Todo list loading...</p>;
  }

  if (todoList.length === 0) {
    return <p>Add todo above to get started</p>;
  }

  // Keep filtering if you want completed items hidden:
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    <ul>
      {filteredTodoList.map((todo) => (
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
