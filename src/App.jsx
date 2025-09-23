// src/App.jsx - Main App component refactored to use reducer pattern
import { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import styles from './App.module.css';
import { ErrorIcon } from './shared/Icons';
import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';

// Import reducer, actions, and initial state with aliases to avoid naming conflicts
import {
    reducer as todosReducer,
    actions as todoActions,
    initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
    // Replace multiple useState calls with single useReducer
    // todoState now contains: { todoList, isLoading, isSaving, errorMessage }
    const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

    // Keep filter and sort state separate (not in reducer yet)
    const [filterOption, setFilterOption] = useState('all');
    const [sortOption, setSortOption] = useState('createdDate');

    // Fetch todos on mount - now using dispatch instead of direct state setters
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                // Dispatch fetchTodos action to set isLoading to true
                dispatch({ type: todoActions.fetchTodos });

                const response = await fetch(`${import.meta.env.VITE_API_URL}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${import.meta.env.VITE_PAT}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch todos: ${response.status}`);
                }

                const data = await response.json();

                // Dispatch loadTodos with records - reducer handles the mapping
                dispatch({
                    type: todoActions.loadTodos,
                    records: data.records
                });

            } catch (err) {
                // Dispatch setLoadError with error object
                dispatch({
                    type: todoActions.setLoadError,
                    error: err
                });
            }
            // Note: no finally block needed - reducer handles setting isLoading to false
        };

        fetchTodos();
    }, []);

    // Add new todo - pessimistic UI pattern
    const addTodo = useCallback(async (title) => {
        try {
            // Dispatch startRequest to set isSaving to true
            dispatch({ type: todoActions.startRequest });

            const response = await fetch(`${import.meta.env.VITE_API_URL}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_PAT}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fields: {
                        title: title,
                        isCompleted: false
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const data = await response.json();

            // Dispatch addTodo with the new record
            dispatch({
                type: todoActions.addTodo,
                records: [data]
            });

        } catch (err) {
            // Dispatch setLoadError to show error and reset loading states
            dispatch({
                type: todoActions.setLoadError,
                error: err
            });
        }
        // Note: endRequest action would be dispatched here if needed separately
    }, []);

    // Update todo - optimistic UI pattern
    const updateTodo = useCallback(async (id, updates) => {
        // Store original todo for potential revert
        const originalTodo = todoState.todoList.find(todo => todo.id === id);

        // Optimistically update the todo immediately
        dispatch({
            type: todoActions.updateTodo,
            editedTodo: { id, ...updates }
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_PAT}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fields: updates
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            // Success - optimistic update stands (no action needed)

        } catch (err) {
            // Revert to original todo on error
            dispatch({
                type: todoActions.revertTodo,
                editedTodo: originalTodo,
                error: err
            });
        }
    }, [todoState.todoList]);

    // Complete/Delete todo - optimistic UI pattern
    const completeTodo = useCallback(async (id) => {
        // Store original todo for potential revert
        const originalTodo = todoState.todoList.find(todo => todo.id === id);

        // Optimistically remove the todo
        dispatch({
            type: todoActions.completeTodo,
            id: id
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_PAT}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fields: {
                        isCompleted: true
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete todo');
            }

            // Success - optimistic removal stands

        } catch (err) {
            // Revert by adding the todo back
            dispatch({
                type: todoActions.revertTodo,
                editedTodo: originalTodo,
                error: err
            });
        }
    }, [todoState.todoList]);

    // Delete todo (if you have a separate delete function)
    const deleteTodo = useCallback(async (id) => {
        // Store original todo for potential revert
        const originalTodo = todoState.todoList.find(todo => todo.id === id);

        // Optimistically remove the todo
        dispatch({
            type: todoActions.completeTodo,
            id: id
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_PAT}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

        } catch (err) {
            // Revert by adding the todo back
            dispatch({
                type: todoActions.revertTodo,
                editedTodo: originalTodo,
                error: err
            });
        }
    }, [todoState.todoList]);

    // Memoized filtered and sorted todos
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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Todo List</h1>
            </header>

            {/* Error message with dismiss button */}
            {todoState.errorMessage && (
                <div className={styles.error}>
                    <ErrorIcon />
                    <span>{todoState.errorMessage}</span>
                    <button
                        onClick={() => dispatch({ type: todoActions.clearError })}
                        className={styles.dismissButton}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Todo Form - pass isSaving from todoState */}
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

            {/* Todo List - pass isLoading and todoList from todoState */}
            {todoState.isLoading ? (
                <div className={styles.loading}>Loading todos...</div>
            ) : (
                <TodoList
                    todos={filteredAndSortedTodos}
                    onUpdateTodo={updateTodo}
                    onCompleteTodo={completeTodo}
                    onDeleteTodo={deleteTodo}
                />
            )}
        </div>
    );
}

export default App;