// /home/lenovo/code/ltphongssvn/kiwi/todo-list/src/App.jsx
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TodoForm from './features/TodoForm'
import TodoList from './features/TodoList/TodoList'

function App() {
    const [count, setCount] = useState(0)
    const [todoList, setTodoList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)


    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

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
    }, [])
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

    const completeTodo = async (id) => {
          const originalTodo = todoList.find((todo) => todo.id === id);
          const updatedTodos = todoList.map((todo) => {
              if (todo.id === id) {
                  return { ...todo, isCompleted: true };
              }
              return todo;
          });
          setTodoList(updatedTodos);
          
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

    const updateTodo = async (editedTodo) => {
          const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
          const updatedTodos = todoList.map((todo) => {
              if (todo.id === editedTodo.id) {
                  return editedTodo;
              }
              return todo;
          });
          setTodoList(updatedTodos);
          
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
              const revertedTodos = todoList.map((todo) => {
                  if (todo.id === editedTodo.id) {
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
        <>
            <div>
                <a href="https://vite.dev" target="_blank" rel="noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} isLoading={isLoading} />
            {errorMessage && (
                  <div>
                      <hr />
                      <p>{errorMessage}</p>
                      <button onClick={() => setErrorMessage("")}>Dismiss</button>
                  </div>
              )}
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
