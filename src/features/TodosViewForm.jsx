// src/features/TodosViewForm.jsx
import { useState, useEffect } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel'

const TodosViewForm = ({ queryString, setQueryString, sortDirection, toggleSortDirection }) => {
    // Week 9: Local state for debouncing the search input
    // This holds the immediate value as the user types
    const [localQueryString, setLocalQueryString] = useState(queryString);

    // Week 9: Debouncing implementation with useEffect
    // This effect watches localQueryString and delays updating the parent's queryString
    // until the user stops typing for 500ms
    useEffect(() => {
        // Create a timeout that will fire after 500ms of no typing
        const debounce = setTimeout(() => {
            // After 500ms of no changes, update the parent component's state
            // This triggers the actual API call in App.jsx
            setQueryString(localQueryString);
        }, 500); // 500ms delay - balances responsiveness with API efficiency

        // Cleanup function: This runs before the effect runs again
        // If the user types again within 500ms, this cancels the previous timeout
        // preventing the API call from happening
        return () => {
            clearTimeout(debounce);
        };
    }, [localQueryString, setQueryString]); // Re-run this effect whenever localQueryString changes

    // Handle the Clear button click
    const handleClear = () => {
        // Clear both the local state and the parent's state immediately
        setLocalQueryString("");
        setQueryString(""); // For Clear button, we update immediately without debouncing
    };

    return (
        <div>
            <div>
                {/* Week 9: Search input now uses local state for immediate UI updates */}
                <TextInputWithLabel
                    id="search"
                    label="Search"
                    name="search"
                    type="text"
                    value={localQueryString}
                    onChange={(e) => setLocalQueryString(e.target.value)}
                    placeholder="Search todos..."
                />
                <button onClick={handleClear}>Clear</button>
            </div>
            <div>
                <button onClick={toggleSortDirection}>
                    Sort {sortDirection === "asc" ? "↑" : "↓"}
                </button>
            </div>
        </div>
    );
};

export default TodosViewForm;