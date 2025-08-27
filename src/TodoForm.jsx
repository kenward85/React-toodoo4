import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel.jsx";

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
      <TextInputWithLabel
        elementId="newTodoTitle"
        label="Todo"
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        placeholder="Type a new todo"
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;



