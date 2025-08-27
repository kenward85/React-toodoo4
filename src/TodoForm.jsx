import { useRef } from "react";

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef("");

  function handleAddTodo(event) {
    event.preventDefault();
    // For the learning step you can inspect:
    // console.dir(event.target);
    // console.dir(event.target.title);

    const title = event.target.title.value.trim();
    if (!title) {
      todoTitleInput.current.focus();
      return;
    }

    onAddTodo(title);

    // clear and refocus
    event.target.title.value = "";
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        name="title"                 // ← required for event.target.title
        ref={todoTitleInput}         // ← ref for re-focus
        placeholder="Type a new todo"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;

