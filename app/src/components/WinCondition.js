import React, {useState} from "react";
import BingoCard from "../objects/BingoCard";

const WinCondition = () => {
    const [bingoCard, setBingoCard] = useState(new BingoCard());//inside the useState is the default value for it to take
    const [winCondition, setWinCondition] = useState(bingoCard.getCardBools());
    
    const toggleButton = (rowIndex, colIndex) => {
        //update bool
        bingoCard.bools[rowIndex][colIndex] = !bingoCard.bools[rowIndex][colIndex];

        //rerender
        const newBingoCard = new BingoCard();
        newBingoCard.bools = bingoCard.getCardBools();
        setBingoCard(newBingoCard);
    }

    const winConditionSubmit = () => {
        //set the win condition to the current bingoCard.bools when submit is pressed
        setWinCondition(bingoCard.bools);
        alert(winCondition);
    }

    //5x5 array of bool buttons
    return (
        <div className="bingoCardContainer">
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
            <div className="submitField">
                <button onClick={() => winConditionSubmit()}
                >Confirm Win Condition</button>
            </div>
        </div>
    )
}

export default WinCondition;