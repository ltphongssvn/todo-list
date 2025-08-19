// /home/lenovo/code/ltphongssvn/kiwi/todo-list/src/features/TodoForm.jsx
import { useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel'

function TodoForm({ onAddTodo, isSaving }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState('')

    function handleAddTodo(event) {
        event.preventDefault()
        onAddTodo(workingTodoTitle)
        setWorkingTodoTitle('')
    }

    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                elementId="todoTitle"
                label="Todo"
                value={workingTodoTitle}
                onChange={(e) => setWorkingTodoTitle(e.target.value)}
            />
            <button type="submit" disabled={workingTodoTitle === '' || isSaving}>
                  {isSaving ? 'Saving...' : 'Add Todo'}
              </button>
        </form>
    );
}

export default TodoForm;
