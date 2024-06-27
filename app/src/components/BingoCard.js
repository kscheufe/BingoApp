/**
 *  - HandleNumberCall needs to be called by the input field component for entering called numbers
*/
//this is a file describing a BingoCard component
import React, {useState} from 'react';
import BingoCard from '../objects/BingoCard';
import './BingoCardComponent.css'; // For styling the card

const BingoCardComponent = () => {
    const [bingoCard] = useState(new BingoCard());

    const handleNumberCall = (calledNumber) => {
        const num = parseInt(calledNumber);
        if (isNaN(num)) return;//shouldn't be able to get here due to input restriction
        bingoCard.markNumber(num);//method in bingoCard object, needs to be called from main app, not each bingo card component
    };

    return (
        <div className='bingo-card'>
            {bingoCard.getCardNumbers().map((row, rowIndex) =>
            row.map((num, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`}
                     className={`card-cell ${bingoCard.getCardMarks()[rowIndex][colIndex] ? 'marked' : ''}`}
                >
                    {num}
                </div>
            )))};
        </div>
    )
}

export default BingoCardComponent;