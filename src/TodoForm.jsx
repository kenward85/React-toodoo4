import { useRef, useState } from "react";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef(null);

  function handleAddTodo(event) {
    event.preventDefault();

    const title = workingTodoTitle.trim();
    if (!title) {
      todoTitleInput.current?.focus();
      return;
    }

    onAddTodo(title);
    setWorkingTodoTitle("");            // reset controlled input
    todoTitleInput.current?.focus();    // keep focus for quick entry
  }

  return (
    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        name="title"
        ref={todoTitleInput}
        placeholder="Type a new todo"
        value={workingTodoTitle}                         // controlled
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;


