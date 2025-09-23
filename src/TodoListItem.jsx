import { useEffect, useState } from "react";
import styles from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  
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
    <li className={styles.item}>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label htmlFor={`edit-${todo.id}`} className={styles.visuallyHidden}>
            Edit Todo
          </label>
          <input
            id={`edit-${todo.id}`}
            type="text"
            value={workingTitle}
            onChange={(e) => setWorkingTitle(e.target.value)}
          />
          <div className={styles.buttons}>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Update</button>
          </div>
        </form>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
            aria-label={`Complete ${todo.title}`}
          />
          <span
            className={`${styles.title} ${
              todo.isCompleted ? styles.done : ""
            }`}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {todo.title}
          </span>
        </>
      )}
    </li>
  );
}

export default TodoListItem;





