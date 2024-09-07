import React, {forwardRef, useState, useImperativeHandle} from 'react';
import BingoCard from '../objects/BingoCard';
import "./BingoCard.css";

//soon just a file for displaying bingo cards and adding new ones
//___--------------------------------------------

//special declaration for forward reference from the app.js parent
const BingoCardComponent = forwardRef((props, ref) => {
    //import winConditionsList as a prop
    const { winConditionsList } = props;
    const [bingoCard, setBingoCard] = useState(new BingoCard());

    // Expose handleNumberCall to parent (app.js) via ref
    useImperativeHandle(ref, () => ({
        handleNumberCall: handleNumberCall//first is the property passed to parent, second is the method in this script
    }));

    const handleNumberCall = (calledNumber) => {
        const num = parseInt(calledNumber);
        if (isNaN(num)) return;//shouldn't be able to get here due to input restriction, but an extra layer of sanitization
        bingoCard.markNumber(num);//method in bingoCard object, call originates from app.js and propagates through (App.js -> BingoCard (component) -> BingoCard (class))
        setBingoCard(bingoCard);//re render
        //check the win conditions
        checkWinConditions();
        //check for wins
        //winCheck() {}
        //win conditions Y, T, X, Line, O, arrow, 
        //just do custom win conditions?
        //check wins using position-wise AND when comparing the two elements?
    };

    const checkWinConditions = () => {
        const currentBools = bingoCard.getCardBools();
        winConditionsList.forEach((winCondition, index) => {
            let win = true;
            for (let i = 0; i < winCondition.length; i++) {//for each win conditions
                for (let j = 0; j <= winCondition[i].length; j++)//for each cell of each win conditions
                {
                    if (winCondition[i][j] && !currentBools[i][j])
                    {
                        win = false;
                        break;    
                    }
                }
                if (!win) break;
            }
            if (win) {
                alert(`Win Condition ${index + 1} met!`);
            }
            

        })
    }

    return (
        <div className="bingoCardContainer">
            <div>Card Label</div>
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
                        {Array.from({ length: 5 }).map((_, rowIndex) => {
                            const num = bingoCard.getCardNumbers()[rowIndex][colIndex];
                            return (
                                <div 
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`card-cell ${bingoCard.getCardBools()[rowIndex][colIndex] ? 'marked' : ''}`}
                                >
                                    {num}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
});

export default BingoCardComponent;