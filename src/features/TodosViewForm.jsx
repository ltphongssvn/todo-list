// src/features/TodosViewForm.jsx - TodosViewForm component with styled-components
import styled from 'styled-components';
import TextInputWithLabel from '../shared/TextInputWithLabel';

// Styled components for the view form
const StyledViewForm = styled.div`
  /* Adding padding to form items as required */
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  align-items: flex-end;
`;

const StyledFormGroup = styled.div`
  /* Small padding for spacing as required */
  padding: 0.25rem 0;
  flex: 1;
`;

const StyledLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:hover {
    border-color: #cbd5e0;
  }
`;

const StyledSearchWrapper = styled.div`
  flex: 2;
  /* Small padding for spacing as required */
  padding: 0.25rem 0;
`;

function TodosViewForm({ filterOption, sortOption, onFilterChange, onSortChange, searchTerm, onSearchChange }) {
    return (
        <StyledViewForm>
            {onSearchChange && (
                <StyledSearchWrapper>
                    <TextInputWithLabel
                        elementId="search-todos"
                        label="Search Todos"
                        value={searchTerm || ''}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </StyledSearchWrapper>
            )}

            <StyledFormGroup>
                <StyledLabel htmlFor="filter-select">Filter By</StyledLabel>
                <StyledSelect
                    id="filter-select"
                    value={filterOption}
                    onChange={(e) => onFilterChange(e.target.value)}
                >
                    <option value="all">All Todos</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </StyledSelect>
            </StyledFormGroup>

            <StyledFormGroup>
                <StyledLabel htmlFor="sort-select">Sort By</StyledLabel>
                <StyledSelect
                    id="sort-select"
                    value={sortOption}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="createdDate">Date Created</option>
                    <option value="title">Title</option>
                    <option value="completed">Status</option>
                </StyledSelect>
            </StyledFormGroup>
        </StyledViewForm>
    );
}

export default TodosViewForm;