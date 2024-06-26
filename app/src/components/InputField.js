//this is a file describing a basic inputField, for entering the number drawn and manual number entry
import React, {useState} from 'react';

function InputField() {
    /////basic react requirements
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Input Value: ${inputValue}`);//change me when bingo cards are added to the app, send to a "DB" of all numbers
    }
    /////

    /////custom details for input
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter Text:
                <input type='number' min="1" value={inputValue} onChange={handleChange} />
            </label>
            <button type = "submit">Submit</button>
        </form>
    )
}

export default InputField;