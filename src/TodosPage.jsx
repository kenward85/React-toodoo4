import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";
import TodosViewForm from "./TodosViewForm.jsx";
import { useSearchParams } from "react-router-dom";
import "./TodosPage.css";

export default function TodosPage({
  onAddTodo,
  onUpdateTodo,
  onCompleteTodo,
  isSaving,
  isLoading,
  todoList,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
  totalPages,
  currentPage,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- Pagination handlers (preserve other params) ---
  const handlePreviousPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(newPage));
    setSearchParams(nextParams);
  };

  const handleNextPage = () => {
    const newPage = Math.min(currentPage + 1, Math.max(totalPages, 1));
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(newPage));
    setSearchParams(nextParams);
  };

  // Derived disables
  const prevDisabled = currentPage <= 1 || totalPages <= 1;
  const nextDisabled = currentPage >= Math.max(totalPages, 1) || totalPages <= 1;

  return (
    <>
      <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        isLoading={isLoading}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={onUpdateTodo}
      />

      {/* Pagination Controls (below the list) */}
      <div className="paginationControls" aria-label="Pagination controls">
        <button onClick={handlePreviousPage} disabled={prevDisabled} type="button">
          Previous
        </button>

        <span>
          Page {Math.max(currentPage, 1)} of {Math.max(totalPages, 1)}
        </span>

        <button onClick={handleNextPage} disabled={nextDisabled} type="button">
          Next
        </button>
      </div>

      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />
    </>
  );
}

