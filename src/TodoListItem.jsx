import { useEffect, useState } from "react";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  // keep local title in sync if todo changes after save
  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleUpdate(e) {
    e.preventDefault();
    if (!isEditing) return;
    const trimmed = workingTitle.trim();
    if (!trimmed) return;
    onUpdateTodo({ ...todo, title: trimmed });
    setIsEditing(false);
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <label htmlFor={`edit-${todo.id}`} style={{ display: "none" }}>
              Edit Todo
            </label>
            <input
              id={`edit-${todo.id}`}
              type="text"
              value={workingTitle}
              onChange={(e) => setWorkingTitle(e.target.value)}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit">Update</button>
            </div>
          </>
        ) : (
          <>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
              aria-label={`Complete ${todo.title}`}
            />
            <span
              style={{ marginLeft: "0.5rem", cursor: "pointer" }}
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;





