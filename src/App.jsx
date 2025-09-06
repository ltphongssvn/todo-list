// /home/lenovo/code/ltphongssvn/kiwi/todo-list/src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'
import TodoForm from './features/TodoForm'
import TodoList from './features/TodoList/TodoList'
import TodosViewForm from './features/TodosViewForm'

const encodeUrl = ({ sortField, sortDirection, queryString }) => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = "";
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",title)`;
  }
  return encodeURI(`https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}?${sortQuery}${searchQuery}`);
};

function App() {
    const [todoList, setTodoList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Sorting state
    const [sortField, setSortField] = useState("createdTime")
    const [sortDirection, setSortDirection] = useState("desc")
    const [queryString, setQueryString] = useState("")


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
                  const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
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
    }, [url, token, sortField, sortDirection, queryString])
    const addTodo = async (title) => {
        const payload = {
              records: [{
                  fields: {
                      title: title,
                      createdTime: new Date().toISOString(),
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
              const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
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
              const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
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
              const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
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

    const deleteTodo = async (id) => {
        const originalTodoList = [...todoList];
        const updatedTodos = todoList.filter((todo) => todo.id !== id);
        setTodoList(updatedTodos);
        
        const options = {
            method: "DELETE",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        };
        
        try {
            const resp = await fetch(`${url}/${id}`, options);
            if (!resp.ok) {
                throw new Error(resp.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(`${error.message}. Restoring todo...`);
            setTodoList(originalTodoList);
        }
    }

    return (
        <>
            <h1>Todo List</h1>
            <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} onDeleteTodo={deleteTodo} isLoading={isLoading} />
            <hr />
            <TodosViewForm 
              sortDirection={sortDirection} 
              setSortDirection={setSortDirection} 
              sortField={sortField} 
              setSortField={setSortField} 
                queryString={queryString}
                setQueryString={setQueryString}
            />
            {errorMessage && (
                  <div>
                      <hr />
                      <p>{errorMessage}</p>
                      <button onClick={() => setErrorMessage("")}>Dismiss</button>
                  </div>
              )}
        </>
    )
}

export default App
