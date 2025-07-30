// src/App.jsx
import { useState } from 'react';
import './App.css';
import TodoForm from './TodoForm';

function App() {
  const [newTodo, setNewTodo] = useState("My first todo");

  const todos = [
    { id: 1, title: "review resources" },
    { id: 2, title: "take notes" },
    { id: 3, title: "code out app" },
  ];

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />

      {/* ✅ Input field to update newTodo */}
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Type a new todo"
      />

      {/* ✅ Display the current newTodo */}
      <p>{newTodo}</p>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;





