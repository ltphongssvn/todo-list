// /home/lenovo/code/ltphongssvn/kiwi/todo-list/src/features/TodoList/TodoListItem.jsx
import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    useEffect(() => {
          setWorkingTitle(todo.title);
      }, [todo]);

    const handleCancel = () => {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    };

    const handleEdit = (event) => {
        setWorkingTitle(event.target.value);
    };

    const handleUpdate = (event) => {
        if (!isEditing) return;

        event.preventDefault();
        onUpdateTodo({
            ...todo,
            title: workingTitle
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            onDeleteTodo(todo.id);
        }
    };

    return (
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel
                            elementId={`edit-${todo.id}`}
                            label=""
                            value={workingTitle}
                            onChange={handleEdit}
                        />
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="button" onClick={handleUpdate}>
                            Update
                        </button>
                    </>
                ) : (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                        <button type="button" onClick={handleDelete} style={{marginLeft: '10px'}}>
                            Delete
                        </button>
                    </>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;
