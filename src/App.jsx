 // src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";

// ENV → .env.local (in project root):
// VITE_PAT=your_airtable_token
// VITE_BASE_ID=your_base_id
// VITE_TABLE_NAME=Todos
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);     // loading indicator
  const [isSaving, setIsSaving] = useState(false);       // “Saving…” on add button
  const [errorMessage, setErrorMessage] = useState("");  // error banner

  // Load todos from Airtable (pessimistic)
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = { method: "GET", headers: { Authorization: token } };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) throw new Error(resp.statusText);

        const { records } = await resp.json();
        const fetched = records.map((r) => {
          const todo = { id: r.id, ...r.fields };
          if (!todo.isCompleted) todo.isCompleted = false; // Airtable omits falsey fields
          return todo;
        });
        setTodoList(fetched);
      } catch (err) {
        setErrorMessage(err.message || "Failed to load todos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Add todo (pessimistic: wait for server, show “Saving…”)
  async function addTodo(title) {
    const payload = {
      records: [{ fields: { title, isCompleted: false } }],
    };
    const options = {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);

      const { records } = await resp.json();
      const saved = { id: records[0].id, ...records[0].fields };
      if (!saved.isCompleted) saved.isCompleted = false;
      setTodoList((prev) => [...prev, saved]);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Failed to save todo.");
    } finally {
      setIsSaving(false);
    }
  }

  // Update todo (optimistic: update first, revert on error)
  async function updateTodo(editedTodo) {
    const original = todoList.find((t) => t.id === editedTodo.id);
    setTodoList((prev) => prev.map((t) => (t.id === editedTodo.id ? editedTodo : t)));

    const payload = {
      records: [{ id: editedTodo.id, fields: {
        title: editedTodo.title,
        isCompleted: editedTodo.isCompleted,
      }}],
    };
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);
    } catch (err) {
      console.error(err);
      setErrorMessage(`${err.message || "Failed to update todo"}. Reverting todo...`);
      setTodoList((prev) => prev.map((t) => (t.id === original.id ? original : t)));
    }
  }

  // Complete todo (optimistic toggle; revert on error)
  async function completeTodo(id) {
    const current = todoList.find((t) => t.id === id);
    if (!current) return;

    const toggled = { ...current, isCompleted: !current.isCompleted };
    setTodoList((prev) => prev.map((t) => (t.id === id ? toggled : t)));

    const payload = {
      records: [{ id, fields: { title: toggled.title, isCompleted: toggled.isCompleted } }],
    };
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);
    } catch (err) {
      console.error(err);
      setErrorMessage(`${err.message || "Failed to complete todo"}. Reverting todo...`);
      setTodoList((prev) => prev.map((t) => (t.id === current.id ? current : t)));
    }
  }

  return (
    <div>
      <h1>Todo List</h1>

      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        isLoading={isLoading}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;






