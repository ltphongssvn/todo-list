// src/shared/TextInputWithLabel.jsx - TextInputWithLabel with styled-components
import { forwardRef } from 'react';
import styled from 'styled-components';

// Styled components for the input and label
const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* Small padding for spacing as required */
  padding: 0.25rem 0;
`;

const StyledLabel = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  color: #2d3748;
  transition: all 0.2s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:hover:not(:focus) {
    border-color: #cbd5e0;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

// Using forwardRef to properly handle ref forwarding to the input element
const TextInputWithLabel = forwardRef(function TextInputWithLabel(
    { elementId, label, onChange, value, placeholder },
    ref
) {
    return (
        <StyledInputWrapper>
            {label && <StyledLabel htmlFor={elementId}>{label}</StyledLabel>}
            <StyledInput
                type="text"
                id={elementId}
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </StyledInputWrapper>
    );
});

export default TextInputWithLabel;