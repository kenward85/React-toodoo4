
import { useState } from "react";
import "./App.css";
import TodoForm from "./features/TodoForm.jsx";
import TodoList from "./features/TodoList/TodoList.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);

  
  function addTodo(title) {
    const newTodo = { id: Date.now(), title, isCompleted: false };
    setTodoList(prev => [...prev, newTodo]);
  }

  
  function completeTodo(id) {
    setTodoList(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  }

  
  function updateTodo(editedTodo) {
    setTodoList(prev =>
      prev.map(todo => (todo.id === editedTodo.id ? { ...editedTodo } : todo))
    );
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;





