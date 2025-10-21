import { useState } from "react"
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.5rem;
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;

  &:disabled {
    font-style: italic;
    opacity: 0.6;
  }
`;

function TodosForm({ onAddTodo, isSaving }) {
  const [title, setTitle] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if(!trimmed) return;
    await onAddTodo(trimmed)
    setTitle ("");
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput onChange = {(e) => setTitle(e.target.value) } value = {title} type="text" placeholder="New todo..." />
      <StyledButton type="submit" disabled={isSaving||title.trim().length==0}>
        Add
      </StyledButton>
    </StyledForm>
  );
}

export default TodosForm;





