// src/pages/TodosPage.jsx - Main page component for todo list functionality
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import styles from '../App.module.css';

function TodosPage({
                       todoState,
                       addTodo,
                       updateTodo,
                       completeTodo,
                       deleteTodo,
                       dispatch,
                       todoActions,
                       filterOption,
                       setFilterOption,
                       sortOption,
                       setSortOption
                   }) {
    // Pagination setup using URL search parameters
    const [searchParams, setSearchParams] = useSearchParams();
    const itemsPerPage = 15;

    // Get current page from URL params, default to 1
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    // Apply filtering and sorting to todos
    const filteredAndSortedTodos = useMemo(() => {
        let filtered = todoState.todoList;

        // Apply filter
        if (filterOption === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        } else if (filterOption === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        }

        // Apply sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortOption === 'title') {
                return sortOption === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            } else if (sortOption === 'createdDate') {
                return new Date(b.createdTime) - new Date(a.createdTime);
            }
            return 0;
        });

        return sorted;
    }, [todoState.todoList, filterOption, sortOption]);

    // Calculate pagination values
    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
    const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
    const currentTodos = filteredAndSortedTodos.slice(indexOfFirstTodo, indexOfLastTodo);
    const totalPages = Math.ceil(filteredAndSortedTodos.length / itemsPerPage);

    // Pagination handlers
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setSearchParams({ page: String(currentPage - 1) });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setSearchParams({ page: String(currentPage + 1) });
        }
    };

    // Validate and correct invalid page parameters
    useMemo(() => {
        // Only validate if we have todos (totalPages > 0)
        if (totalPages > 0) {
            // Check if currentPage is invalid
            if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
                // Reset to page 1
                setSearchParams({});
            }
        }
    }, [currentPage, totalPages, setSearchParams]);

    return (
        <div className={styles.todosContainer}>
            {/* Error message display */}
            {todoState.errorMessage && (
                <div className={styles.error}>
                    <span>{todoState.errorMessage}</span>
                    <button
                        onClick={() => dispatch({ type: todoActions.clearError })}
                        className={styles.dismissButton}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Todo Form */}
            <TodoForm
                onAddTodo={addTodo}
                isSaving={todoState.isSaving}
            />

            {/* Filter and Sort Controls */}
            <TodosViewForm
                filterOption={filterOption}
                onFilterChange={setFilterOption}
                sortOption={sortOption}
                onSortChange={setSortOption}
            />

            {/* Todo List with pagination */}
            {todoState.isLoading ? (
                <div className={styles.loading}>Loading todos...</div>
            ) : (
                <>
                    <TodoList
                        todos={currentTodos}
                        onUpdateTodo={updateTodo}
                        onCompleteTodo={completeTodo}
                        onDeleteTodo={deleteTodo}
                    />

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className={styles.paginationControls}>
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={styles.paginationButton}
                            >
                                Previous
                            </button>

                            <span className={styles.paginationInfo}>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={styles.paginationButton}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default TodosPage;