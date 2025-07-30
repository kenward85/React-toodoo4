// src/App.jsx
import './App.css'
import TodoForm from './TodoForm' // <-- ✅ Import TodoForm

function App() {
  const todos = [
    { id: 1, title: "review resources" },
    { id: 2, title: "take notes" },
    { id: 3, title: "code out app" },
  ]

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm /> {/* <-- ✅ Add form here */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App


