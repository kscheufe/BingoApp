import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import BingoCard from '../objects/BingoCard';
import "./BingoCard.css";
import axios from 'axios';

//win notifications
//toggle view on numbers called?
//finish styling everything like phone - arecipe
//carousel tab selection

const BingoCardComponent = forwardRef((props, ref) => {
    
    const [bingoCard, setBingoCard] = useState(new BingoCard());
    const [bingoCardList, setBingoCardList] = useState([]);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchBingoCards(); //fetch cards when component mounts
    }, []);

    useImperativeHandle(ref, () => ({
        refreshCards() {//name of method to call in parent (app.js)
            fetchBingoCards();
        }
    }))

    const toggleAdding = () =>
    {
        console.log(adding? 'cancel' : 'add');
        setAdding(!adding);
        //open addCard Area/conditionally render
    }

    const handleToggleCard = (id) => {
        axios.post(`/api/bingo-cards/toggle/${id}`)
        .then(response => {
            console.log("toggled card " + id);
            fetchBingoCards();
        })
        .catch(error => console.error(`Error toggling card ${id}`, error))
    }

    const handleDeleteCard = (id) => {
        axios.delete(`/api/bingo-cards/deleteOne/${id}`)
        .then(response => {
            console.log(`deleted card ${id}`)
            fetchBingoCards();
        })
        .catch(error => console.error(`Error deleting card ${id}`, error))
    }

    const handleDeleteAllCards = () => {
        axios.delete(`/api/bingo-cards/deleteAll`)
        .then(response => {
            console.log(`deleted all cards`)
            fetchBingoCards();
        })
        .catch(error => console.error(`Error deleting all cards`, error))
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
                        const cardData = JSON.parse(card.card);
                        const id = card.id;
                        const is_active = card.is_active;
                    return (
                        <li key={index}>
                            <div className={`bingo-card ${is_active ? 'active' : 'inactive'}`}>
                            <div className="card-header">
                                <button 
                                    className={`toggle-button`}
                                    onClick={() => handleToggleCard(id)}
                                >
                                    {is_active ? "🔓" : "🔒"}
                                </button>
                                <span className='card-id'>Card {id}</span>
                                <button 
                                    className='delete-button'
                                    onClick={() => handleDeleteCard(id)}
                                >🗑️</button>
                            </div>

                            <div className='bingo-header'>
                                {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                                    <div key={`header-${index}`} className='header-cell'>
                                        {letter}    
                                    </div>
                                ))}
                            </div>

                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <div key={`row-${rowIndex}`} className="card-row">
                                    {Array.from({ length: 5 }).map((_, colIndex) => {
                                        const num = cardData.numbers[rowIndex][colIndex];
                                        return (
                                            <div 
                                                key={`${rowIndex}-${colIndex}`}
                                                className={`card-cell ${cardData.bools[rowIndex][colIndex] == true ? 'called' : ''}`}
                                            >
                                                {num == 0 ? 'Free' : num}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </li>
                    )})
                ) : (<p>No Cards Added Yet</p>)}
            </ul>
            {/* Delete all cards button */}
            {bingoCardList.length > 0 ? (
                <div className='clear-button-container'>
                    <button onClick={handleDeleteAllCards} className='delete-all-cards-button'>
                        Clear Cards
                    </button>
                </div>
            ) : (null)}
        </div>
    )
});

export default BingoCardComponent;