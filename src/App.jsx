import { useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function App() {
  
  const [todoList, setTodoList] = useState([]);

  
  function addTodo(title) {
    const newTodo = { id: Date.now(), title }; 
    setTodoList(prev => [...prev, newTodo]);  
  }

 
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />        {/* pass handler */}
      <TodoList todoList={todoList} />        {/* render from state */}
    </div>
  );
}

export default App;





