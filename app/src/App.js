import './App.css';
import React, {useState} from 'react';
import BingoCardComponent from './components/BingoCard';
import AddWinCondition from './components/AddWinCondition';
import axios from 'axios';

function App() {//starting point for the app
  const [inputValue, setInputValue] = useState('');

  const handleInputFieldChange = (event) => {
      setInputValue(event.target.value);
  }

  //handle called numbers
  const handleInputFieldSubmit = (event) => {
    event.preventDefault();//prevents default behaviour    
    if (!inputValue.trim()) return; //prevents empty submissions
    const numberToCall = parseInt(inputValue);//ensures it's an int

    //FRONTEND
    axios.post(`/api/numbers-called/${numberToCall}`)
      .then(response => {
        console.log('Number called: ', response.data);
        //update list of called numbers, DOESN'T EXIST YET
        fetchUpdatedNumbers();
        //redraw cards
        fetchUpdatedCards();

      })
      .catch(error => console.error("error calling number - app.js: ", error));
    //BACKEND
    //check win conditions against each card

    //reset the input value
    setInputValue('');
  } 

  const fetchUpdatedCards = () => {};
  const fetchUpdatedNumbers = () => {};
  const fetchUpdatedWinConditions = () => {};

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleInputFieldSubmit}>
            <label>
                Enter Number:
                <input type='number' min="1" max ="75" value={inputValue} onChange={handleInputFieldChange} />
            </label>
            <button type = "submit">Submit</button>
        </form>
        <BingoCardComponent />
        <AddWinCondition />
      </header>
    </div>
  );
}

export default App;
