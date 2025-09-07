// /home/lenovo/code/ltphongssvn/kiwi/todo-list/src/App.jsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

function App() {
    const [count, setCount] = useState(0)
    const [todoList, setTodoList] = useState([])

    const addTodo = (title) => {
        const newTodo = {
            title: title,
            id: Date.now(),
            isCompleted: false
        }
        setTodoList([...todoList, newTodo])
    }

    const completeTodo = (id) => {
        const updatedTodos = todoList.map((todo) => {
            if (todo.id === id) {
                return { ...todo, isCompleted: true };
            }
            return todo;
        });
        setTodoList(updatedTodos);
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
            <TodoForm onAddTodo={addTodo} />
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
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