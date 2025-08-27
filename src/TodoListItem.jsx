import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleEdit(e) {
    setWorkingTitle(e.target.value);
  }

  function handleCancel() {
    setWorkingTitle(todo.title); // reset to original
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
            <TextInputWithLabel
              elementId={`edit-${todo.id}`}
              label="Todo"
              value={workingTitle}
              onChange={handleEdit}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
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



