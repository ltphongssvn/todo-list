// src/reducers/todos.reducer.js - Reducer for managing todo application state

// Actions object defining all possible state transitions
const actions = {
    // actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    // found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    // actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    // found in helper functions
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    // reverts todos when requests fail
    revertTodo: 'revertTodo',
    // action on Dismiss Error button
    clearError: 'clearError',
};

// Initial state combining all the individual states from App component
const initialState = {
    todoList: [],        // from useState([])
    isLoading: true,     // from useState(true) - true because we fetch on mount
    isSaving: false,     // from useState(false)
    errorMessage: ''     // from useState('') or useState(null)
};

// Reducer function to handle all state transitions
function reducer(state = initialState, action) {
    switch (action.type) {
        // Pessimistic UI: useEffect loading todos
        case actions.fetchTodos:
            return {
                ...state,
                isLoading: true
            };

        case actions.loadTodos:
            // Map Airtable records to todo format
            const todos = action.records.map((record) => ({
                id: record.id,
                title: record.fields.title || "",
                completed: record.fields.isCompleted || false,
                createdTime: record.createdTime
            }));
            return {
                ...state,
                todoList: todos,
                isLoading: false
            };

        case actions.setLoadError:
            return {
                ...state,
                errorMessage: action.error.message,
                isLoading: false,
                isSaving: false
            };

        // Pessimistic UI: addTodo actions
        case actions.startRequest:
            return {
                ...state,
                isSaving: true
            };

        case actions.addTodo:
            // Create savedTodo from the record, adding isCompleted if Airtable omits it
            const savedTodo = {
                id: action.records[0].id,
                title: action.records[0].fields.title,
                completed: action.records[0].fields.isCompleted || false,
                createdTime: action.records[0].createdTime
            };
            return {
                ...state,
                todoList: [...state.todoList, savedTodo],
                isSaving: false
            };

        case actions.endRequest:
            return {
                ...state,
                isLoading: false,
                isSaving: false
            };

        // Optimistic UI: updateTodo with fall-through to revertTodo
        case actions.revertTodo:
        // Falls through to updateTodo logic
        case actions.updateTodo:
            // Find and update the specific todo
            const updatedTodos = state.todoList.map(todo =>
                todo.id === action.editedTodo.id
                    ? { ...todo, ...action.editedTodo }
                    : todo
            );

            // Create the updated state
            const updatedState = {
                ...state,
                todoList: updatedTodos
            };

            // If there's an error (from revertTodo), add error message
            if (action.error) {
                updatedState.errorMessage = action.error.message;
            }

            return updatedState;

        // Optimistic UI: completeTodo
        case actions.completeTodo:
            // Filter out the completed todo (remove it from the list)
            const filteredTodos = state.todoList.filter(todo => todo.id !== action.id);
            return {
                ...state,
                todoList: filteredTodos
            };

        // Clear error message (Dismiss Error button)
        case actions.clearError:
            return {
                ...state,
                errorMessage: ''
            };

        default:
            return state;
    }
}

// Named exports for use in App component
export { reducer, actions, initialState };