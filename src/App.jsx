// src/App.jsx - Main App component with CSS Module implementation
import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './App.module.css';
import { ErrorIcon } from './shared/Icons';
import './App.css'; // Foundation styles
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';

function App() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOption, setFilterOption] = useState('all');
    const [sortOption, setSortOption] = useState('createdDate');

    // Fetch todos on mount
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setIsLoading(true);
                setError(null);
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
                const todos = data.records.map(record => ({
                    id: record.id,
                    title: record.fields.title || "",
                    completed: record.fields.isCompleted || false
                }));
                setTodos(todos);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
    }, []);

    // Add new todo
    const addTodo = useCallback(async (title) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, completed: false }),
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const newTodo = await response.json();
            setTodos(prevTodos => [...prevTodos, newTodo]);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    // Update todo
    const updateTodo = useCallback(async (id, updates) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            setTodos(prevTodos =>
                prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
            );
        } catch (err) {
            setError(err.message);
        }
    }, []);

    // Delete todo
    const deleteTodo = useCallback(async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        } catch (err) {
            setError(err.message);
        }
    }, []);

    // Filter and sort todos
    const processedTodos = useMemo(() => {
        let filtered = [...todos];

        // Apply filter
        if (filterOption === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        } else if (filterOption === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        }

        // Apply sort
        filtered.sort((a, b) => {
            if (sortOption === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortOption === 'completed') {
                return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
            }
            // Default: sort by creation date
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return filtered;
    }, [todos, filterOption, sortOption]);

    return (
        <div className={styles.appContainer}>
            <div className={styles.headerSection}>
                <h1>My Todo List</h1>
            </div>

            {error && (
                <div className={styles.errorContainer}>
                    <ErrorIcon className={styles.errorIcon} />
                    <span className={styles.errorMessage}>{error}</span>
                </div>
            )}

            <div className={styles.mainContent}>
                <TodoForm onAddTodo={addTodo} />

                <TodosViewForm
                    filterOption={filterOption}
                    sortOption={sortOption}
                    onFilterChange={setFilterOption}
                    onSortChange={setSortOption}
                />

                {isLoading ? (
                    <div className={styles.loadingContainer}>
                        <span>Loading todos...</span>
                    </div>
                ) : (
                    <TodoList
                        todos={processedTodos}
                        onUpdateTodo={updateTodo}
                        onDeleteTodo={deleteTodo}
                    />
                )}
            </div>
        </div>
    );
}

export default App;