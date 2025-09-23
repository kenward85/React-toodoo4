import { useRef, useState } from "react";

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef(null);

  async function handleAddTodo(e) {
    e.preventDefault();
    const title = workingTodoTitle.trim();
    if (!title) {
      todoTitleInput.current?.focus();
      return;
    }
    await onAddTodo(title);
    setWorkingTodoTitle("");
    todoTitleInput.current?.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="newTodoTitle">Todo</label>{" "}
      <input
        id="newTodoTitle"
        type="text"
        ref={todoTitleInput}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        placeholder="Type a new todo"
      />
      <button type="submit" disabled={workingTodoTitle.trim() === "" || isSaving}>
        {isSaving ? "Saving..." : "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;




