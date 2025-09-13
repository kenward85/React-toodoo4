import { useRef, useState } from "react";


function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef(null);

  async function handleAddTodo(event) {
    event.preventDefault();
console.log("event", event)
    const title = workingTodoTitle.trim();
    if (!title) {
      todoTitleInput.current?.focus();
      console.log("event", event)
      return;
    }

   
    await onAddTodo(title);

    setWorkingTodoTitle("");            // reset controlled input
    todoTitleInput.current?.focus();    // keep focus for quick entry
  }

  return (
    <form onSubmit={handleAddTodo}>
      <input 
        elementId="newTodoTitle"
        label="Todo"
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




