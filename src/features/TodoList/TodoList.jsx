// /home/lenovo/code/ltphongssvn/kiwi/todo-list/src/features/TodoList/TodoList.jsx
import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, onDeleteTodo, isLoading }) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);

    return (
          isLoading ? (
              <p>Todo list loading...</p>
          ) : filteredTodoList.length === 0 ? (
              <p>Add todo above to get started</p>
          ) : (
            <ul>
                {filteredTodoList.map(todo => (
                    <TodoListItem
                        key={todo.id}
                        todo={todo}
                        onCompleteTodo={onCompleteTodo}
                        onUpdateTodo={onUpdateTodo}
                        onDeleteTodo={onDeleteTodo}
                    />
                ))}
            </ul>
        )
    );
}
export default TodoList;
