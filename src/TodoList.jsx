// src/TodoList.jsx
import TodoListItem from './TodoListItem';

function TodoList() {
    const todos = [
        { id: 1, title: "Learn React" },
        { id: 2, title: "Build a Todo App" }
    ];
    return (
        <div>
            <ul>
                {todos.map(todo => (
                    <TodoListItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </div>
    );
}
export default TodoList;