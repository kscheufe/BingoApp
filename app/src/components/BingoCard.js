import React, { useState } from 'react';
import BingoCard from '../objects/BingoCard';
import "./BingoCard.css";

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
                        </div>
                    ))}
                </div>
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