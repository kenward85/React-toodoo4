import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* ✅ spacing between items */
  margin-top: 1rem;
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.5rem;
`;

const StyledSelect = styled.select`
  padding: 0.25rem 0.5rem;
`;

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    setLocalQueryString(queryString);
  }, [queryString]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  return (
    <StyledForm onSubmit={(e) => e.preventDefault()}>
      <StyledRow>
        <label htmlFor="search">Search: </label>
        <StyledInput
          id="search"
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button type="button" onClick={() => setLocalQueryString("")}>
          Clear
        </button>
      </StyledRow>

      <StyledRow>
        <label htmlFor="sortBy">Sort by:</label>
        <StyledSelect
          id="sortBy"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>

        <label htmlFor="direction">Direction:</label>
        <StyledSelect
          id="direction"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </StyledRow>
    </StyledForm>
  );
}

export default TodosViewForm;
