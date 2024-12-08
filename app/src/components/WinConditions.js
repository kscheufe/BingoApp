import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./WinConditions.css";
/*
    Need to add:
        - styling
        - It also appears to be getting called many many times, look into that
            - Tested - Because of React Strict Mode, won't be an issue in prod
*/

const defaultWinCondition = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
];

const WinConditionsComponent = () => {
    const [winConditions, setWinConditions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCondition, setCurrentCondition] = useState(defaultWinCondition);

    useEffect(() => {
        fetchWinConditions(); //fetch conditions when component mounts
    }, []);

    const fetchWinConditions = () => {
        axios.get('/api/win-conditions/')
        .then(response => {
            setWinConditions(response.data);//update state with fetched win conditions
        })
        .catch(error => console.error("Error fetching win conditions - winCondition component", error));
    };

    //also used to cancel editing
    const startEditing = () => {
        //setCurrentCondition(defaultWinCondition);//init to default
        //might not want to default to default every time, only for sure after one is submitted
        setIsEditing(!isEditing);//show editing grid
    }

    const handleToggleCell = (row, col) => {
        const updatedCondition = currentCondition.map((r, rowIndex) => 
            r.map((cell, colIndex) => (
                rowIndex === row && colIndex === col ? !cell : cell ))
        )
        setCurrentCondition(updatedCondition);
    }

    const handleAddCondition = (event) => {
        event.preventDefault();
        //don't need to prevent empty submission, not possible
        const condition = JSON.stringify(currentCondition);//serialize it for db

        axios.post('/api/win-conditions/add', {condition})
        .then(response => {
            console.log("Added win condition: ", response.data);
            fetchWinConditions();
            setIsEditing(false);
            setCurrentCondition(defaultWinCondition);//reset condition to default after submission
        })
        .catch(error => 
        {
            if (error.response && error.response.status === 409) {
                // Check if error is a 409 (Conflict) for duplicate entry
                alert("Win Condition Already Exists");
            }
            console.error(`Error adding win condition - WinConditions.js `, error);
        });
    };

    const handleToggleCondition = (id) => {
        axios.post(`/api/win-conditions/toggle/${id}`)
        .then(response => {
            console.log("WinCondition.js-Toggled win condition, id: ", id)
            fetchWinConditions();
        })
        .catch(error => console.error(`Error toggling win condition, id: ${id}`, error))
    }

    const handleDeleteCondition = (id) => {
        axios.delete(`/api/win-conditions/delete/${id}`)
        .then(response => {
            console.log("WinCondition.js-Deleted win condition, id: ", id);
            fetchWinConditions();
        })
        .catch(error => console.error(`Error deleting winCondition, id: ${id}`, error));
    }

return (
    <div className='win-conditions-component'>
        <h2>Win Conditions</h2>

        {/* Button to start adding a new win condition */}
        <button onClick={startEditing}>{isEditing ? "Cancel" : "Add Win Condition"}</button>

        {/* If editing, show the grid for user to configure the new condition */}
        {isEditing && (
            <div >
                <h3>Edit Win Condition</h3>
                <div className='bingo-card'>
                    {currentCondition.map((row, rowIndex) => (
                        <div key = {rowIndex} className = "card-row">
                            {row.map((value, colIndex) => (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`condition-button ${value ? 'marked' : ''}`}
                                    onClick={() => handleToggleCell(rowIndex, colIndex)} //toggle on click
                                    style={{cursor: 'pointer'}}//change cursor for interactivity
                                >
                                    {value ? '' : ''} {/* Display t or f */}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
                <button onClick={handleAddCondition}>Submit</button>
            </div>
        )}

        {/* List of win conditions */}
        <h3>Existing Win Conditions</h3>
        <ul>
            {winConditions.length > 0 ? (
                winConditions.map((conditionData, index) => {
                    //conditionData is a placeholder name for row (from DB)
                    //condition must be parsed from text, other two available immediately
                    const condition = JSON.parse(conditionData.condition);
                    const id = conditionData.id;
                    const is_active = conditionData.is_active;
                    console.log(id)
                                        
                    return (
                        <li key={index}>
                            <div className={`condition-grid ${is_active ? '' : 'inactive'}`}>
                                {//console.log(condition)
                                    //id = condition.id;
                                    //condition = condition.condition
                                    //status = condition.isActive
                                    //console.log(JSON.parse(condition.condition))
                                }
                                {condition.map((row, rowIndex) => (
                                    <div key={rowIndex} className='condition-row'>
                                        {row.map((value, colIndex) => (
                                            <div 
                                                key={colIndex} 
                                                className={`card-cell ${value ? 'marked' : ''}`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleToggleCondition(id)}>
                                {is_active ? "Deativate" : "Activate"}
                            </button>
                            <button onClick={() => handleDeleteCondition(id)}>Delete</button>
                        </li>
                    )
                })
            ) : (
                <p>No win conditions added yet</p>
            )}
        </ul>
    </div>
)}

export default WinConditionsComponent;