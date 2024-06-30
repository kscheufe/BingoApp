/**
*/
//this is a file describing a BingoCard component
import React, {forwardRef, useState, useImperativeHandle} from 'react';
import BingoCard from '../objects/BingoCard';
import './BingoCard.css'; // For styling the card

//special declaration for forward reference from the app.js parent
const BingoCardComponent = forwardRef((props, ref) => {
    const [bingoCard, setBingoCard] = useState(new BingoCard());

    const handleNumberCall = (calledNumber) => {
        const num = parseInt(calledNumber);
        if (isNaN(num)) return;//shouldn't be able to get here due to input restriction, but an extra layer of sanitization
        bingoCard.markNumber(num);//method in bingoCard object, call originates from app.js and propagates through (App.js -> BingoCard (component) -> BingoCard (class))
        setBingoCard(bingoCard);//re render
    };

    // Expose handleNumberCall to parent (app.js) via ref
    useImperativeHandle(ref, () => ({
        handleNumberCall: handleNumberCall
    }));

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
                {bingoCard.getCardNumbers().map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="card-column">
                        {
                            row.map((num, colIndex) => (
                                <div 
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`card-cell ${bingoCard.getCardBools()[rowIndex][colIndex] ? 'marked' : ''}`}
                                >
                                    {num}
                                </div>
                            ))
                        }
                    </div>
                ))}
            </div>
        </div>
    )
});

export default BingoCardComponent;