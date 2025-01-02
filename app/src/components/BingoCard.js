import React, { useState } from 'react';
import BingoCard from '../objects/BingoCard';
import "./BingoCard.css";

/*


*/



//soon just a file for displaying bingo cards and adding new ones
//___--------------------------------------------


//special declaration for forward reference from the app.js parent
const BingoCardComponent = () => {
    //import winConditionsList as a prop
    
    const [bingoCard, setBingoCard] = useState(new BingoCard());
    const [bingoCardList, setBingoCardList] = useState(bingoCard);
    const [adding, setAdding] = useState(false);


    const toggleAdding = () =>
    {
        console.log(adding? 'cancel' : 'add');
        setAdding(!adding);
        //open addCard Area/conditionally render
    }

    const handleToggleCard = (id) => {
        console.log('toggle ' + id)
    }

    const handleDeleteCard = (id) => {
        console.log('delete ' + id)
    }

    const handleInputChange = (rowIndex, colIndex, newValue) => {
        const updatedNumbers = [...bingoCard.numbers];
        updatedNumbers[rowIndex][colIndex] = newValue ? parseInt(newValue, 10) : null;
        setBingoCard({ ...bingoCard, numbers: updatedNumbers });
    }

    return (
        <div className="bingoCardContainer">
            <div className='addCancelButton'>
                <button onClick={toggleAdding}>{adding ? "Cancel" :"Add"}</button>
            </div>

            {adding && (
                <div >
                    <div className='bingo-card'>
                    <h3>Enter Numbers</h3>    
                    {bingoCard.numbers.map((row, rowIndex) => (
                        <div key = {rowIndex} className = "card-row">
                            {row.map((value, colIndex) => (
                                <input
                                    key={`${rowIndex}-${colIndex}`}
                                    type="number"
                                    className={`number-field`}
                                    //onClick={() => handleToggleCell(rowIndex, colIndex)} //toggle on click
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        textAlign: 'center',
                                        fontSize: '16px',
                                        cursor: 'pointer'

                                    }}//change cursor for interactivity
                                    value = {value || ''}
                                    //{(rowIndex != 2 || colIndex != 2)}
                                    min={(colIndex * 15 + 1)}
                                    max={(colIndex+1)*15}
                                    onChange={
                                        rowIndex === 2 && colIndex === 2 
                                        ? null 
                                        : (e) => handleInputChange(rowIndex, colIndex, e.target.value)
                                    }
                                    readOnly={rowIndex === 2 && colIndex === 2}
                                />
                            ))}
                        </div>
                    ))}
                    </div>
                </div>
            )}
            
            <ul>
                {bingoCardList.length > 0 ? (
                    bingoCardList.map((card, index) => {
                        //card is a placeholder name for row (from DB)
                        //data must be parsed from text, other two available immediately
                        const cardData = JSON.parse(card.card);
                        const id = card.id; //card.___ is db names
                        const is_active = card.is_active;
                    return (
                    
                    <li>
                        <div>Card Label</div>
                        <div className='bingo-card'>
                        <button 
                            className={"toggle-button"}
                            onClick={() => handleToggleCard(id)}
                        >
                            {is_active ? "🔓" : "🔒"}
                        </button>
                        <span className='win-condition-id'>WC {id}</span>
                        <button 
                            className='delete-button'
                            onClick={() => handleDeleteCard(id)}
                        >🗑️</button>

                        <div className='bingo-header'>
                            {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                                <div key={`header-${index}`} className='header-cell'>
                                    {letter}    
                                </div>
                            ))}
                        </div>

                        {/** will need to be replicated for each card in cardsList */}

                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="card-row">
                                {Array.from({ length: 5 }).map((_, colIndex) => {
                                    const num = bingoCard.getCardNumbers()[colIndex][rowIndex];
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
                        )
                        )}
                        </div>
                    </li>
                    )})
                ) : ( <p>No Cards Added Yet</p>) }
            </ul>
        </div>
    )
};

export default BingoCardComponent;