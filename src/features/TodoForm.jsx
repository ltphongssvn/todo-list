// src/features/TodoForm.jsx - TodoForm component with styled-components
import { useState, useRef } from 'react';
import styled from 'styled-components';
import TextInputWithLabel from '../shared/TextInputWithLabel';

// Styled components for the form
const StyledForm = styled.form`
  /* Adding padding to form items as required */
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const StyledInputWrapper = styled.div`
  flex: 1;
  /* Small padding for spacing as required */
  padding: 0.25rem 0;
`;

const StyledButton = styled.button`
  align-self: flex-end;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  /* Make font italic when disabled as required */
  &:disabled {
    font-style: italic;
    opacity: 0.5;
    cursor: not-allowed;
    background: #cbd5e0;
  }
`;

function TodoForm({ onAddTodo }) {
    const [todoTitle, setTodoTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!todoTitle.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onAddTodo(todoTitle.trim());
            setTodoTitle('');
            inputRef.current?.focus();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StyledForm onSubmit={handleSubmit}>
            <StyledInputWrapper>
                <TextInputWithLabel
                    elementId="new-todo-input"
                    label="Add New Todo"
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    ref={inputRef}
                />
            </StyledInputWrapper>
            <StyledButton type="submit" disabled={!todoTitle.trim() || isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Todo'}
            </StyledButton>
        </StyledForm>
    );
}

export default TodoForm;