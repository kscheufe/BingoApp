import React, { useState, useEffect } from 'react';
import BingoCard from '../objects/BingoCard';
import "./BingoCard.css";
import axios from 'axios';

const BingoCardComponent = () => {
    
    const [bingoCard, setBingoCard] = useState(new BingoCard());
    const [bingoCardList, setBingoCardList] = useState([]);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchBingoCards(); //fetch cards when component mounts
    }, []);

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

    const fetchBingoCards = () => {
        axios.get('/api/bingo-cards')
        .then(response => {
            setBingoCardList(response.data);
        })
        .catch(error => console.error("Error fetching bingo cards - BC component", error));
    }

    const submitCard = (event) => {
        event.preventDefault();
        //validate form
        let valid = true;
        let numbers = [];
        bingoCard.numbers.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const minValue = colIndex * 15 + 1;
                const maxValue = (colIndex + 1) * 15;

                //check for invalid cells
                if (
                    !(rowIndex == 2 && colIndex == 2) && //skip middle cell
                    (
                        value == null || //check null
                        value < minValue || //check number fits range
                        value > maxValue ||
                        numbers.includes(value) //check number is unique
                    )
                ) {
                    valid = false;
                    alert("invalid bingo card entry");
                    console.log("invalid bingo card entry");
                    return;
                }
                else 
                {
                    numbers.push(value);
                }
            })
        })

        //submit actions
        if (valid)
        {
            let card = JSON.stringify(bingoCard);
            axios.post('/api/bingo-cards/', {card, is_active: true})
            .then(response => {
                console.log('added');
                fetchBingoCards();
                setBingoCard(new BingoCard());
                setAdding(false);
            })
            .catch(error => console.error("error adding card - BC component", error))
            console.log("submit filed");
            
        }
    }

    return (
        <div className="bingoCardContainer">
            <div className='addCancelButton'>
                <button onClick={toggleAdding}>{adding ? "Cancel" :"Add"}</button>
                {adding ? (<button onClick={submitCard}>Submit</button>) : (null) }
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
                        console.log(cardData);
                        //console.log(card);
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