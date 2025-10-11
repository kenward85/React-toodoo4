// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";
import TodosViewForm from "./TodosViewForm.jsx"; // 👈 NEW

// ENV → .env.local
// VITE_PAT=your_airtable_token
// VITE_BASE_ID=your_base_id
// VITE_TABLE_NAME=Todos
const baseId = import.meta.env.VITE_BASE_ID;
const table = encodeURIComponent(import.meta.env.VITE_TABLE_NAME || "Todos");
const baseUrl = `https://api.airtable.com/v0/${baseId}/${table}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

// Helper builds a URL with sort & (optional) search
const encodeUrl = ({ sortField, sortDirection, queryString }) => {
  const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = "";
  if (queryString && queryString.trim() !== "") {
    const safe = queryString.replace(/"/g, '\\"'); // escape quotes
    searchQuery = `&filterByFormula=${encodeURIComponent(`SEARCH("${safe}", title)`)}`;
  }
  // keep [] intact for Airtable’s parsing
  return encodeURI(`${baseUrl}?${sortQuery}${searchQuery}`);
};

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Week 8 view state
  const [sortField, setSortField] = useState("createdTime"); // 'title' | 'createdTime'
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc' | 'desc'
  const [queryString, setQueryString] = useState("");

  // Load todos (pessimistic) with sort & search
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const url = encodeUrl({ sortField, sortDirection, queryString });
      const options = { method: "GET", headers: { Authorization: token } };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) throw new Error(resp.statusText);

        const { records } = await resp.json();
        const fetched = records.map((r) => {
          const todo = { id: r.id, ...r.fields };
          if (!todo.isCompleted) todo.isCompleted = false;
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
  }, [sortField, sortDirection, queryString]);

  // Add todo (pessimistic) — include createdTime field so sorting works
  async function addTodo(title) {
    const payload = {
      records: [
        { fields: { title, isCompleted: false, createdTime: new Date().toISOString() } },
      ],
    };
    const url = encodeUrl({ sortField, sortDirection, queryString });
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

  // Update todo (optimistic)
  async function updateTodo(editedTodo) {
    const original = todoList.find((t) => t.id === editedTodo.id);
    setTodoList((prev) => prev.map((t) => (t.id === editedTodo.id ? editedTodo : t)));

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
            createdTime: editedTodo.createdTime, // keep field if present
          },
        },
      ],
    };
    const url = encodeUrl({ sortField, sortDirection, queryString });
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

  // Complete todo (optimistic toggle)
  async function completeTodo(id) {
    const current = todoList.find((t) => t.id === id);
    if (!current) return;

    const toggled = { ...current, isCompleted: !current.isCompleted };
    setTodoList((prev) => prev.map((t) => (t.id === id ? toggled : t)));

    const payload = {
      records: [
        {
          id,
          fields: {
            title: toggled.title,
            isCompleted: toggled.isCompleted,
            createdTime: toggled.createdTime,
          },
        },
      ],
    };
    const url = encodeUrl({ sortField, sortDirection, queryString });
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

      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
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




