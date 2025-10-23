import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem; /* ✅ small spacing */
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
`;

function TextInputWithLabel({ id, label, value, onChange }) {
  return (
    <StyledWrapper>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
      <StyledInput id={id} value={value} onChange={onChange} />
    </StyledWrapper>
  );
}

export default TextInputWithLabel;

