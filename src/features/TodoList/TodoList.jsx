// src/features/TodoList/TodoList.jsx - TodoList component with CSS Module
import styles from './TodoList.module.css';
import TodoListItem from './TodoListItem';

function TodoList({ todos, onUpdateTodo, onDeleteTodo }) {
    if (!todos || todos.length === 0) {
        return (
            <div className={styles.todoListContainer}>
                <div className={styles.emptyState}>
                    No todos yet. Add one above to get started!
                </div>
            </div>
        );
    }

    return (
        <div className={styles.todoListContainer}>
            <div className={styles.listHeader}>
                <h3>Your Tasks</h3>
                <span className={styles.todoCount}>
          {todos.filter(t => !t.completed).length} of {todos.length} remaining
        </span>
            </div>
            <ul className={styles.todoList}>
                {todos.map(todo => (
                    <TodoListItem
                        key={todo.id}
                        todo={todo}
                        onUpdate={onUpdateTodo}
                        onDelete={onDeleteTodo}
                    />
                ))}
            </ul>
        </div>
    );
}

export default TodoList;