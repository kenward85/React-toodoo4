import { useState } from "react";
import "./App.css";
import TodoForm from "./features/TodoForm.jsx";
import TodoList from "./features/TodoList/TodoList.jsx";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [title, setTitle] = useState("");

 
  function addTodo(newTitle) {
    const newTodo = { id: Date.now(), title: newTitle, isCompleted: false };
    setTodoList(prev => [...prev, newTodo]);
  }

 
  function completeTodo(id) {
    const updatedTodos = todoList.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodoList(updatedTodos);
  }

  
  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map(todo =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} title={title} setTitle={setTitle} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;




