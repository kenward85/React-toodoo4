// App.jsx
import { useEffect, useCallback, useReducer, useState } from "react";
import { useLocation, useSearchParams, Routes,Route } from "react-router-dom";
import "./App.css";


import Header from "./shared/Header.jsx";
import TodosPage from "./TodosPage.jsx";
import About from "./About.jsx";
import NotFound from "./NotFound.jsx";
import {
  reducer as todosReducer,
  initialState as initialTodosState,
  actions as todoActions,
} from "./reducers/todos.reducer";


const baseId = import.meta.env.VITE_BASE_ID;
const table = encodeURIComponent(import.meta.env.VITE_TABLE_NAME || "Todos");
const baseUrl = `https://api.airtable.com/v0/${baseId}/${table}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  // Router location → header title
  const location = useLocation();
  const [title, setTitle] = useState("Todo List");

  // useReducer todo state
  const [todoListState, dispatch] = useReducer(todosReducer, initialTodosState);

  // View controls
  const [sortField, setSortField] = useState("createdTime"); // 'title' | 'createdTime'
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc' | 'desc'
  const [queryString, setQueryString] = useState("");

  // --- Pagination (via URL: ?page=) ---
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;

  // Compute header title based on route
  useEffect(() => {
    if (location.pathname === "/") setTitle("Todo List");
    else if (location.pathname === "/about") setTitle("About");
    else setTitle("Not Found");
  }, [location]);

  // Build Airtable URL with sorting + optional search filter
  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString && queryString.trim() !== "") {
      const safe = queryString.replace(/"/g, '\\"');
      const formula = `SEARCH("${safe}", title)`;
      searchQuery = `&filterByFormula=${encodeURIComponent(formula)}`;
    }
    return `${baseUrl}?${sortQuery}${searchQuery}`;
  }, [sortField, sortDirection, queryString]);

  // Load todos (pessimistic)
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

  // Add todo (pessimistic)
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

  // Update todo (optimistic + revert)
  async function updateTodo(editedTodo) {
    const original = todoListState.todoList.find((t) => t.id === editedTodo.id);
    dispatch({ type: todoActions.updateTodo, editedTodo });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
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
      // no-op on success
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo, // reducer should fall through to updateTodo
        editedTodo: original ?? editedTodo,
        error,
      });
    }
  }

  // Complete todo (optimistic + revert)
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
      // no-op on success
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: original,
        error,
      });
    }
  }

  // Derived lists for pagination
  const filteredTodoList = todoListState.todoList; // apply client-side filters here if needed
  const totalPages = Math.ceil(Math.max(filteredTodoList.length, 1) / itemsPerPage);
  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  // Clear error
  const clearError = () => dispatch({ type: todoActions.clearError });

  // When search/filter changes, reset to page 1 (preserving other params)
  const handleSetQueryString = (val) => {
    setQueryString(val);
    if (currentPage !== 1) {
      const next = new URLSearchParams(searchParams);
      next.set("page", "1");
      setSearchParams(next);
    }
  };

  return (
    <div>
      <Header title={title} />
      <Routes>
      
      <Route path = "/" element = { <TodosPage
        // actions
        onAddTodo={addTodo}
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
        // todo state (paginated list)
        isSaving={todoListState.isSaving}
        isLoading={todoListState.isLoading}
        todoList={currentTodos}
        // view state + setters
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={handleSetQueryString}
        // pagination props for controls inside TodosPage
        currentPage={currentPage}
        totalPages={totalPages}
      
      /> 
      } />
     <Route path ="/about" element = {<About/>} />

      {todoListState.errorMessage && (
        <div>
          <hr />
          <p>{todoListState.errorMessage}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
      <Route path="*" element={<NotFound/>}/>
      </Routes>
    
    </div>
  );
}

export default App;
