import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    //const [newCondition, setNewCondition] = useState('');

    useEffect(() => {
        fetchWinConditions(); //fetch conditions when component mounts
    }, []);

    const fetchWinConditions = () => {
        axios.get('/api/winConditions/')
        .then(response => {
            setWinConditions(response.data);//update state with fetched win conditions
        })
        .catch(error => console.error("Error fetching win conditions - winCondition component", error));
    };

    const startEditing = () => {
        //setCurrentCondition(defaultWinCondition);//init to default
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
        if (!currentCondition.trim()) return; //prevent empty submission, shouldn't happen
        
        axios.post('/api/winConditions/add', {condition: currentCondition })
        .then(response => {
            console.log("Added win condition: ", response.data);
            fetchWinConditions();
            setIsEditing(false);
            setCurrentCondition(defaultWinCondition);//reset condition to default after submission
        })
        .catch(error => console.error('Error deleting win condition ${conditionId}: ', error));
    };

return (
    <div className='win-conditions-component'>
        <h2>Win Conditions</h2>

        {/* Button to start adding a new win condition */}
        <button onClick={startEditing}>{isEditing ? "Cancel" : "Add Win Condition"}</button>

        {/* If editing, show the grid for user to configure the new condition */}
        {isEditing && (
            <div className='condition-editing'>
                <h3>Edit Win Condition</h3>
                <div className='condition-grid'>
                    {currentCondition.map((row, rowIndex) => (
                        <div key = {rowIndex} className = "condition-row">
                            {row.map((value, colIndex) => (
                                <span
                                    key={colIndex}
                                    className={`condition-cell ${value ? 'true' : 'false'}`}
                                    onClick={() => handleToggleCell(rowIndex, colIndex)} //toggle on click
                                    style={{cursor: 'pointer'}}//change cursor for interactivity
                                >
                                    {value ? 'T' : 'F'} {/* Display t or f */}
                                </span>
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
            {winConditions.length >0 ? (
                winConditions.map((condition, index) => {
                    <li key={index}>
                        <div className='condition-grid'>
                            {condition.map((row, rowIndex) => (
                                <div key={rowIndex} className='condition-row'>
                                    {row.map((value, colIndex) => (
                                        <span key={colIndex} className={`condition-cell ${value ? 'true' : 'false'}`}>
                                            {value ? 'T' : 'F'}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </li>
                })
            ) : (
                <p>No win conditions added yet</p>
            )}
        </ul>
    </div>
)}

export default WinConditionsComponent;