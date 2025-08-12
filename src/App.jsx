import { useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function App() {
  const [todoList, setTodoList] = useState([]);

  // Add a new todo with isCompleted = false
  function addTodo(title) {
    const newTodo = { id: Date.now(), title, isCompleted: false };
    setTodoList(prev => [...prev, newTodo]);
  }

  // Mark a todo as completed
  function completeTodo(id) {
    const updatedTodos = todoList.map(todo =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;




