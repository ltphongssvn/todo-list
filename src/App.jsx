// src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'
import TodoForm from './features/TodoForm'
import TodoList from './features/TodoList/TodoList'

function App() {
    const [todoList, setTodoList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Airtable configuration using environment variables
    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    // Fetch todos from Airtable when component mounts
    useEffect(() => {
        const fetchTodos = async () => {
            setIsLoading(true);
            const options = {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            };

            try {
                const resp = await fetch(url, options);
                if (!resp.ok) {
                    throw new Error(resp.message);
                }

                const { records } = await resp.json();
                const fetchedTodos = records.map((record) => {
                    const todo = {
                        id: record.id,
                        ...record.fields
                    };
                    // Airtable doesn't return false values, so we set them explicitly
                    if (!todo.isCompleted) {
                        todo.isCompleted = false;
                    }
                    return todo;
                });
                setTodoList(fetchedTodos);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTodos();
    }, [url, token])

    // Add new todo with pessimistic update (wait for API confirmation)
    const addTodo = async (title) => {
        const payload = {
            records: [{
                fields: {
                    title: title,
                    isCompleted: false
                }
            }]
        };

        const options = {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        };

        try {
            setIsSaving(true);
            const resp = await fetch(url, options);
            if (!resp.ok) {
                throw new Error(resp.message);
            }

            const { records } = await resp.json();
            const savedTodo = {
                id: records[0].id,
                ...records[0].fields
            };
            if (!savedTodo.isCompleted) {
                savedTodo.isCompleted = false;
            }
            setTodoList([...todoList, savedTodo]);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    // Complete todo with optimistic update (update UI immediately, revert on error)
    const completeTodo = async (id) => {
        const originalTodo = todoList.find((todo) => todo.id === id);

        // Optimistically update the UI
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === id) {
                return { ...todo, isCompleted: true };
            }
            return todo;
        });
        setTodoList(updatedTodos);

        // Prepare payload for Airtable
        const payload = {
            records: [{
                id: id,
                fields: {
                    title: originalTodo.title,
                    isCompleted: true
                }
            }]
        };

        const options = {
            method: "PATCH",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        };

        try {
            const resp = await fetch(url, options);
            if (!resp.ok) {
                throw new Error(resp.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(`${error.message}. Reverting todo...`);
            // Revert the optimistic update on error
            const revertedTodos = todoList.map((todo) => {
                if (todo.id === id) {
                    return originalTodo;
                }
                return todo;
            });
            setTodoList(revertedTodos);
        } finally {
            setIsSaving(false);
        }
    }

    // Update todo with optimistic update
    const updateTodo = async (editedTodo) => {
        const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

        // Optimistically update the UI
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === editedTodo.id) {
                return editedTodo;
            }
            return todo;
        });
        setTodoList(updatedTodos);

        // Prepare payload for Airtable
        const payload = {
            records: [{
                id: editedTodo.id,
                fields: {
                    title: editedTodo.title,
                    isCompleted: editedTodo.isCompleted
                }
            }]
        };

        const options = {
            method: "PATCH",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        };

        try {
            const resp = await fetch(url, options);
            if (!resp.ok) {
                throw new Error(resp.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(`${error.message}. Reverting todo...`);
            // Revert the optimistic update on error
            const revertedTodos = todoList.map((todo) => {
                if (todo.id === originalTodo.id) {
                    return originalTodo;
                }
                return todo;
            });
            setTodoList(revertedTodos);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div>
            <h1>Todo List</h1>
            <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
            <TodoList
                todoList={todoList}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                isLoading={isLoading}
            />
            {errorMessage && (
                <div>
                    <hr />
                    <p>{errorMessage}</p>
                    <button onClick={() => setErrorMessage("")}>
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    )
}

export default App