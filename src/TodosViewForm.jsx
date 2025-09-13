// src/TodosViewForm.jsx
function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const preventRefresh = (e) => e.preventDefault();

  return (
    <form onSubmit={preventRefresh}>
      <div style={{ marginBottom: "0.75rem" }}>
        <label htmlFor="search">Search todos: </label>
        <input
          id="search"
          type="text"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          placeholder="Search titles…"
        />
        <button type="button" onClick={() => setQueryString("")} style={{ marginLeft: "0.5rem" }}>
          Clear
        </button>
      </div>

      <div>
        <label htmlFor="sortBy">Sort by </label>
        <select
          id="sortBy"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <label htmlFor="direction" style={{ marginLeft: "1rem" }}>
          Direction
        </label>
        <select
          id="direction"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
