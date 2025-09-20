// src/App.jsx - Main App component with React Router implementation
import { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import styles from './App.module.css';
import './App.css';

// Import Header component
import Header from './shared/Header';

// Import page components
import TodosPage from './pages/TodosPage';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Import reducer, actions, and initial state
import {
    reducer as todosReducer,
    actions as todoActions,
    initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
    // Reducer for todo state management
    const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

    // Filter and sort state (not in reducer yet - could be stretch goal)
    const [filterOption, setFilterOption] = useState('all');
    const [sortOption, setSortOption] = useState('createdDate');

    // Dynamic title based on current route
    const location = useLocation();
    const [title, setTitle] = useState('Todo List');

    // Update title based on current path
    useEffect(() => {
        switch (location.pathname) {
            case '/':
                setTitle('Todo List');
                break;
            case '/about':
                setTitle('About');
                break;
            default:
                setTitle('Not Found');
                break;
        }
    }, [location]);

    // Fetch todos on mount
    useEffect(() => {
        const fetchTodos = async () => {
            try {
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

                dispatch({
                    type: todoActions.loadTodos,
                    records: data.records
                });

            } catch (err) {
                dispatch({
                    type: todoActions.setLoadError,
                    error: err
                });
            }
        };

        fetchTodos();
    }, []);

    // Add new todo - pessimistic UI pattern
    const addTodo = useCallback(async (title) => {
        try {
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

            dispatch({
                type: todoActions.addTodo,
                records: [data]
            });

        } catch (err) {
            dispatch({
                type: todoActions.setLoadError,
                error: err
            });
        }
    }, []);

    // Update todo - optimistic UI pattern
    const updateTodo = useCallback(async (id, updates) => {
        const originalTodo = todoState.todoList.find(todo => todo.id === id);

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

        } catch (err) {
            dispatch({
                type: todoActions.revertTodo,
                editedTodo: originalTodo,
                error: err
            });
        }
    }, [todoState.todoList]);

    // Complete todo - optimistic UI pattern
    const completeTodo = useCallback(async (id) => {
        const originalTodo = todoState.todoList.find(todo => todo.id === id);

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

        } catch (err) {
            dispatch({
                type: todoActions.revertTodo,
                editedTodo: originalTodo,
                error: err
            });
        }
    }, [todoState.todoList]);

    // Delete todo
    const deleteTodo = useCallback(async (id) => {
        const originalTodo = todoState.todoList.find(todo => todo.id === id);

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
            dispatch({
                type: todoActions.revertTodo,
                editedTodo: originalTodo,
                error: err
            });
        }
    }, [todoState.todoList]);

    return (
        <div className={styles.container}>
            {/* Header with dynamic title and navigation */}
            <Header title={title} />

            {/* Main content area with routing */}
            <main className={styles.main}>
                <Routes>
                    {/* Home route - Todo List */}
                    <Route
                        path="/"
                        element={
                            <TodosPage
                                todoState={todoState}
                                addTodo={addTodo}
                                updateTodo={updateTodo}
                                completeTodo={completeTodo}
                                deleteTodo={deleteTodo}
                                dispatch={dispatch}
                                todoActions={todoActions}
                                filterOption={filterOption}
                                setFilterOption={setFilterOption}
                                sortOption={sortOption}
                                setSortOption={setSortOption}
                            />
                        }
                    />

                    {/* About route */}
                    <Route
                        path="/about"
                        element={<About />}
                    />

                    {/* Catch-all route for 404 */}
                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;