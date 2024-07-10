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

const WinCondition = () => {
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
        //repeat current winConditions list but with bingoCard.bools added
        setWinConditionsList([...winConditionsList, newWinCondition]);
        //toggle confirmation, cancel, and add button (!add == confirmation)
        toggleAddWinConditionsDisplay();

        alert(newWinCondition);
        //updateWinConditions
    }

    const toggleAddWinConditionsDisplay = () => {
        setShowWinConditionsField(!showWinConditionsField);
    }

    //5x5 array of bool buttons
    return (
        <div className="bingoCardContainer">
            <div className="winConditionsDisplay" >
                <h2>Win Conditions:</h2>
                {winConditionsList.map((condition, index) => (
                <div key={`win-condition-${index}`} className="win-condition">
                    <div className="bingo-card">
                    {condition.map((row, rowIndex) => (
                        <div key={`win-row-${rowIndex}`} className="card-column">
                        {row.map((cell, colIndex) => (
                            <div
                            key={`win-${rowIndex}-${colIndex}`}
                            className={`card-cell ${cell ? "marked" : ""}`}
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
                    {bingoCard.getCardBools().map((row, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="card-column">
                            {
                                row.map((num, colIndex) => (
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