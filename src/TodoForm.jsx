// /home/lenovo/code/ltphongssvn/kiwi/todo-list/src/TodoForm.jsx
import { useState } from 'react'

function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState('')

    function handleAddTodo(event) {
        event.preventDefault()
        onAddTodo(workingTodoTitle)
        setWorkingTodoTitle('')
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input
                id="todoTitle"
                name="title"
                type="text"
                value={workingTodoTitle}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
            />
            <button type="submit" disabled={workingTodoTitle === ''}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;