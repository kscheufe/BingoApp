/**
    - Update handleSubmit button to handle submissions for each card
    - still will likely need to create something to store all the cards, BingoCardList, with many BingoCards
    - then can call for each BingoCard in List, card.handleNumberCalled
 */
//this is a file describing a basic inputField, for entering the number drawn and manual number entry
import React, {useState} from 'react';

function InputField() {
    /////basic react requirements
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const getInputValue = () => {
        return inputValue;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //for each card
        //card.handleNumberCalled(inputValue)
        alert(`Input Value: ${inputValue}`);//change me when bingo cards are added to the app, send to a "DB" of all numbers
        
    }
    /////

    /////custom details for input
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter Text:
                <input type='number' min="1" max ="75" value={inputValue} onChange={handleChange} />
            </label>
            <button type = "submit">Submit</button>
        </form>
    )
}

export default InputField;