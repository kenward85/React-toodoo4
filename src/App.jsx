// App.jsx
import { useEffect, useCallback, useReducer, useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";
import TodosViewForm from "./TodosViewForm.jsx";

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

const baseId = import.meta.env.VITE_BASE_ID;
const table = encodeURIComponent(import.meta.env.VITE_TABLE_NAME || "Todos");
const baseUrl = `https://api.airtable.com/v0/${baseId}/${table}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  // ✅ useReducer with the requested state name
  const [todoListState, dispatch] = useReducer(todosReducer, initialTodosState);

  // view controls (unchanged)
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString && queryString.trim() !== "") {
      const safe = queryString.replace(/"/g, '\\"');
      searchQuery = `&filterByFormula=SEARCH("${safe}",+title)`;
    }
    return encodeURI(`${baseUrl}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  // useEffect → dispatch-based pessimistic load
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const url = encodeUrl();
      const options = { method: "GET", headers: { Authorization: token } };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) throw new Error(resp.statusText);
        const { records } = await resp.json();

        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [encodeUrl]);

  // addTodo → dispatch-based pessimistic flow
  async function addTodo(title) {
    dispatch({ type: todoActions.startRequest });

    const payload = { records: [{ fields: { title, isCompleted: false } }] };
    const url = encodeUrl();
    const options = {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, record: records[0] });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  // updateTodo → optimistic + revert
  async function updateTodo(editedTodo) {
    dispatch({ type: todoActions.updateTodo, editedTodo });

    const payload = {
      records: [{ id: editedTodo.id, fields: {
        title: editedTodo.title, isCompleted: editedTodo.isCompleted,
      }}],
    };
    const url = encodeUrl();
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);
    } catch (error) {
      // revert with original (you can pass the original alongside editedTodo if you keep it)
      dispatch({ type: todoActions.revertTodo, editedTodo, error });
    }
  }

  // completeTodo → optimistic + revert
  async function completeTodo(id) {
    const original = todoListState.todoList.find((t) => t.id === id);
    if (!original) return;

    dispatch({ type: todoActions.completeTodo, id });

    const payload = {
      records: [{ id, fields: { title: original.title, isCompleted: true } }],
    };
    const url = encodeUrl();
    const options = {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) throw new Error(resp.statusText);
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, editedTodo: original, error });
    }
  }

  return (
    <div>
      <h1>Todo List</h1>

      {/* ✅ uses todoListState */}
      <TodoForm onAddTodo={addTodo} isSaving={todoListState.isSaving} />

      <TodoList
        todoList={todoListState.todoList}
        isLoading={todoListState.isLoading}
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

      {todoListState.errorMessage && (
        <div>
          <hr />
          <p>{todoListState.errorMessage}</p>

          {/* ✅ dispatch clearError instead of setErrorMessage("") */}
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
