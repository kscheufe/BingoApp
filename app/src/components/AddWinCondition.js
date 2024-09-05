/*
    - create a list of win conditions in a local file/db/backend
    - display win conditions from file below
    - update the win conditions on new submit
    - start app with confirm win condition invisible, make visible if 
      "add win condition" is pressed. ?Possible with current componenet?
*/
import React, {useEffect, useState} from "react";
import BingoCard from "../objects/BingoCard";
import './AddWinCondition.css';
import axios from 'axios';

const WinCondition = ({ onWinConditionsUpdate }) => {
    const [bingoCard, setBingoCard] = useState(new BingoCard());//inside the useState is the default value for it to take
    const [winConditionsList, setWinConditionsList] = useState([]);//list of confirmed win conditions, empty by default (winning impossible)
    const [showWinConditionsField, setShowWinConditionsField] = useState(false);//false by default until the add button is pressed

    //fetch initial win conditions from the backend when the component mounts
    useEffect(() => {
        axios.get('/api/win-conditions')
            .then(response => {
                setWinConditionsList(response.data);
                onWinConditionsUpdate(response.data);//send win conditions to the parent (app.js)
            })
            .catch(error => {
                console.error("Error fetching win conditions: ", error);
            });
    }, [onWinConditionsUpdate]);

    //toggle cell (button) in the addWinCondition field
    const toggleButton = (rowIndex, colIndex) => {
        //make a new bingo card
        const updatedBingoCard = new BingoCard();
        //get the card bools from current bingo card's selections
        updatedBingoCard.bools = bingoCard.getCardBools().map((row, rIndex) => 
            row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? !cell : cell))
        );

        //rerender
        setBingoCard(updatedBingoCard);
    };

    const winConditionSubmit = () => {
        //deep copy of boolean array
        const newWinCondition = bingoCard.getCardBools().map(row => row.slice());
        
        //*********console.log(JSON.stringify(newWinCondition));
        //post new win condition to the backend
        axios.post('/api/win-conditions', {
            condition: JSON.stringify(newWinCondition), 
            is_active: true //make new conditions activeby default
        })
        .then(response => {
            //append the new win condition to the state upon successful addition
            console.log(response.data);
            const updatedWinConditionsList = [...winConditionsList, response.data];
            //set the win Conditions List
            setWinConditionsList(updatedWinConditionsList);
            //send the win conditions list back to the parent (app.js)
            onWinConditionsUpdate(updatedWinConditionsList);
            //toggle confirmation, cancel, and add button (!add == confirmation)
            toggleAddWinConditionsDisplay();
        })
        .catch(error => {
            console.error("Error adding win condition: " + error);
        });

        //alert(newWinCondition);
    }

    const toggleAddWinConditionsDisplay = () => {
        setShowWinConditionsField(!showWinConditionsField);
    }

    //5x5 array of bool buttons
    return (
        <div className="bingoCardContainer">
            <div className="winConditionsDisplay" >
                <h2>Win Conditions:</h2>
                <div></div>
                {winConditionsList.map((conditionFromDB, index) => {
                    //parse the condition from JSON string back to 2d array
                    const parsedCondition = JSON.parse(conditionFromDB.condition);

                    return (
                        <div key={`win-condition-${index}`} className="win-condition">
                            <div className="bingo-card">
                            {Array.from({ length: 5 }).map((_, colIndex) => (
                                <div key={`win-col-${colIndex}`} className="card-column">
                                {Array.from({ length: 5 }).map((_, rowIndex) => (
                                    <div
                                    key={`win-${rowIndex}-${colIndex}`}
                                    className={`card-cell ${parsedCondition[rowIndex][colIndex] ? "marked" : ""}`}
                                    ></div>
                                ))}
                                </div>
                            ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="toggleDisplayButton">
                <button onClick={toggleAddWinConditionsDisplay}>
                    {showWinConditionsField ? "Cancel Addition" : "Add Win Condition"}
                </button>
                {showWinConditionsField && (
                    <button onClick={winConditionSubmit}>Confirm Win Condition</button>
                )}
            </div>
            {showWinConditionsField && (
            <div>
                <div className='bingo-header'>
                    {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                        <div key={`header-${index}`} className='header-cell'>
                            {letter}    
                        </div>
                    ))}
                </div>
                <div className='bingo-card'>
                    {Array.from({ length: 5 }).map((_, colIndex) => (
                        <div key={`col-${colIndex}`} className="card-column">
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                    <div 
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`card-cell ${bingoCard.getCardBools()[rowIndex][colIndex] ? 'marked' : ''}`}
                                    >
                                        <button 
                                            onClick={() => toggleButton(rowIndex, colIndex)}
                                            className={`cell-button ${bingoCard.getCardBools()[rowIndex][colIndex] ? 'marked' : ''}`}
                                        >
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    ))}
                </div>
            </div>
            )}
        </div>
    )
}

export default WinCondition;