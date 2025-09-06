// src/App.jsx
import { useState, useEffect, useCallback } from 'react'
import './App.css'
import TodoForm from './features/TodoForm'
import TodoList from './features/TodoList/TodoList'
import TodosViewForm from './features/TodosViewForm'

function App() {
    const [todoList, setTodoList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Sorting state
    const [sortField, setSortField] = useState("createdTime")
    const [sortDirection, setSortDirection] = useState("desc")
    const [queryString, setQueryString] = useState("")

    // Week 9: useCallback implementation for encodeUrl
    // This function is memoized to prevent recreation on every render
    // It directly accesses sortField, sortDirection, and queryString from the component's state
    const encodeUrl = useCallback(() => {
        let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
        let searchQuery = "";
        if (queryString) {
            searchQuery = `&filterByFormula=SEARCH("${queryString}",title)`;
        }
        return encodeURI(`https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}?${sortQuery}${searchQuery}`);
    }, [sortField, sortDirection, queryString]); // Dependencies array - function recreates only when these change

    const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
    const token = `Bearer ${import.meta.env.VITE_PAT}`;

    useEffect(() => {
        const fetchTodos = async () => {
            setIsLoading(true);
            const options = {
                method: 'GET',
                headers: {
                    Authorization: token
                }
            };

            try {
                // Week 9: Call encodeUrl without arguments - it accesses state directly
                const resp = await fetch(encodeUrl(), options);
                if(!resp.ok){
                    const message = `Error has ocurred: ${resp.status}`;
                    throw new Error(message);
                }
                const output = await resp.json();
                const todos = output.records.map(({id, fields}) => ({
                    id: id,
                    title: fields.title
                }));
                setTodoList(todos);
                setIsLoading(false);
            } catch(error) {
                setErrorMessage(error.message);
                setIsLoading(false)
            }
        };
        fetchTodos();
    }, [sortField, sortDirection, queryString, token]);

    const addTodoOnSave = async (id, inputValue) => {
        setIsSaving(true);
        const airtableObject = {
            "records" : [
                {
                    "id": id,
                    "fields": {
                        "title": inputValue
                    }
                }
            ]
        };
        const options = {
            method: 'PATCH',
            headers: {
                "Content-Type": 'application/json',
                Authorization: token
            },
            body: JSON.stringify(airtableObject)
        };

        try {
            // Week 9: Call encodeUrl without arguments
            const resp = await fetch(encodeUrl(), options);
            if(!resp.ok){
                const message = `Error has ocurred: ${resp.status}`;
                throw new Error(message);
            }
            const output = await resp.json();
            const updatedItem = {
                id: output.records[0].id,
                title: output.records[0].fields.title
            };
            const updatedList = todoList.map(item => {
                return item.id === id ? updatedItem : item;
            });
            setTodoList(updatedList);
            setIsSaving(false);
        } catch(error) {
            setErrorMessage(error.message);
            setIsSaving(false);
        }
    };

    const addTodo = async (inputValue) => {
        setIsSaving(true);
        const airtableObject = {
            "records" : [
                {
                    "fields": {
                        "title": inputValue
                    }
                }
            ]
        };
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                Authorization: token
            },
            body: JSON.stringify(airtableObject)
        };

        try {
            // Week 9: Call encodeUrl without arguments
            const resp = await fetch(encodeUrl(), options);
            if(!resp.ok){
                const message = `Error has ocurred: ${resp.status}`;
                throw new Error(message);
            }
            const output = await resp.json();
            const todo = {
                id: output.records[0].id,
                title: output.records[0].fields.title
            };
            const updatedList = [...todoList, todo];
            setTodoList(updatedList);
            setIsSaving(false);
        } catch(error) {
            setErrorMessage(error.message);
            setIsSaving(false);
        }
    };

    const deleteTodo = async (id) => {
        const options = {
            method: 'DELETE',
            headers: {
                Authorization: token
            }
        };
        const urlDelete = `${url}/${id}`;

        try {
            const resp = await fetch(urlDelete, options);
            if(!resp.ok){
                const message = `Error has ocurred: ${resp.status}`;
                throw new Error(message);
            }
            const modifiedList = todoList.filter(item => id !== item.id);
            setTodoList(modifiedList);
        } catch(error) {
            setErrorMessage(error.message);
        }
    };

    const cancelEdit = async (id) => {
        const options = {
            method: 'GET',
            headers: {
                Authorization: token
            }
        };
        const urlWithRecord = `${url}/${id}`;

        try {
            // Week 9: Call encodeUrl without arguments
            const resp = await fetch(encodeUrl(), options);
            if(!resp.ok){
                const message = `Error has ocurred: ${resp.status}`;
                throw new Error(message);
            }
            const output = await resp.json();
            const originalItem = {
                id: output.id,
                title: output.fields.title
            };
            const updatedList = todoList.map(item => {
                return item.id === id ? originalItem : item;
            });
            setTodoList(updatedList);
        } catch(error) {
            setErrorMessage(error.message);
        }
    };

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    };

    return (
        <>
            <h1>Todo List</h1>
            {isLoading && <h2>Loading...</h2>}
            {isSaving && <h2>Saving...</h2>}
            {errorMessage && <h2>{errorMessage}</h2>}
            <TodosViewForm
                queryString={queryString}
                setQueryString={setQueryString}
                sortDirection={sortDirection}
                toggleSortDirection={toggleSortDirection}
            />
            <TodoForm addTodo={addTodo} isSaving={isSaving} />
            <TodoList
                todoList={todoList}
                addTodoOnSave={addTodoOnSave}
                deleteTodo={deleteTodo}
                cancelEdit={cancelEdit}
                isSaving={isSaving}
            />
        </>
    );
}

export default App