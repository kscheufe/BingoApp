/*
    - create a list of win conditions in a local file/db/backend
    - display win conditions from file below
    - update the win conditions on new submit
    - start app with confirm win condition invisible, make visible if 
        "add win condition" is pressed. ?Possible with current componenet?
*/
import React, {useState} from "react";
import BingoCard from "../objects/BingoCard";
import './AddWinCondition.css';

const WinCondition = ({ onWinConditionsUpdate }) => {
    const [bingoCard, setBingoCard] = useState(new BingoCard());//inside the useState is the default value for it to take
    const [winConditionsList, setWinConditionsList] = useState([]);//list of confirmed win conditions, empty by default (winning impossible)
    const [showWinConditionsField, setShowWinConditionsField] = useState(false);//false by default until the add button is pressed

    //toggle button in the addWinCondition field
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
        //update winConditions List (repeat current winConditions list but with bingoCard.bools added)
        const updatedWinConditionsList = [...winConditionsList, newWinCondition];
        //set the win Conditions List
        setWinConditionsList(updatedWinConditionsList);
        //send the win conditions list back to the parent (app.js)
        onWinConditionsUpdate(updatedWinConditionsList);
        //toggle confirmation, cancel, and add button (!add == confirmation)
        toggleAddWinConditionsDisplay();


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
                {winConditionsList.map((condition, index) => (
                <div key={`win-condition-${index}`} className="win-condition">
                    <div className="bingo-card">
                    {Array.from({ length: 5 }).map((_, colIndex) => (
                        <div key={`win-col-${colIndex}`} className="card-column">
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <div
                            key={`win-${rowIndex}-${colIndex}`}
                            className={`card-cell ${condition[rowIndex][colIndex] ? "marked" : ""}`}
                            ></div>
                        ))}
                        </div>
                    ))}
                    </div>
                </div>
                ))}
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