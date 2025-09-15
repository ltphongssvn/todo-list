// src/features/TodoList/TodoListItem.jsx - TodoListItem component with CSS Module
import { useState, useRef, useEffect } from 'react';
import styles from './TodoListItem.module.css';
import { EditIcon, TrashIcon, CheckIcon } from "../../shared/Icons";
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(todo.title);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleToggleComplete = () => {
        onUpdate(todo.id, { ...todo, completed: !todo.completed });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditValue(todo.title);
    };

    const handleSave = () => {
        if (editValue.trim()) {
            onUpdate(todo.id, { ...todo, title: editValue.trim() });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditValue(todo.title);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(todo.id);
    };

    if (isEditing) {
        return (
            <li className={styles.todoItem}>
                <div className={styles.editForm}>
                    <TextInputWithLabel
                        elementId={`edit-todo-${todo.id}`}
                        label=""
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        ref={inputRef}
                    />
                    <button className={styles.saveButton} onClick={handleSave}>
                        <CheckIcon className={styles.buttonIcon} />Save
                    </button>
                    <button className={styles.cancelButton} onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </li>
        );
    }

    return (
        <li className={styles.todoItem}>
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={todo.completed}
                onChange={handleToggleComplete}
            />
            <div className={styles.todoContent}>
        <span className={`${styles.todoText} ${todo.completed ? styles.todoTextCompleted : ''}`}>
          {todo.title}
        </span>
            </div>
            <div className={styles.todoActions}>
                <button className={styles.editButton} onClick={handleEdit}>
                    <EditIcon className={styles.buttonIcon} />Edit
                </button>
                <button className={styles.deleteButton} onClick={handleDelete}>
                    <TrashIcon className={styles.buttonIcon} />Delete
                </button>
            </div>
        </li>
    );
}

export default TodoListItem;