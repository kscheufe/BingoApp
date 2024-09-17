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

    axios.post(`/api/numbers-called/${numberToCall}`)
      .then(response => {
        console.log('Number called: ', response.data);
        //update list of called numbers, DOESN'T EXIST in frontend YET
        fetchNumbers();
        //redraw cards
        fetchCards();

      })
      .catch(error => console.error("error calling number - app.js: ", error));
    //reset the input value
    setInputValue('');
  } 

  const fetchCards = () => {
    axios.get(`/api/bingo-cards`)
    .then(response => {
      console.log("Get bingo cards response: "+ response.data);
      //other methods here, none yet
      //need to rerender bingo cards in bingoCard component, use props?
    })
    .catch(error => console.error("Error fetching bingo cards - app.js", error));
  };
  const fetchNumbers = () => {
    axios.get(`/api/numbers-called/`)
    .then(response => {
      console.log("Get numbers called response: " + response.data);
      //any other methods here - none yet*****
        //eventually need to display most recent 3-5 at the top for easy correction, and display all 
        //also trigger a rerender of the called numbers in the called numbers tab, will have to use props or some other method to notice the change most likely, unless it can dynamically databind like angular
    })
    .catch(error => console.error("Error fetching called numbers - app.js ", error));
  };
  const fetchWinConditions = () => {
    axios.get(`/api/win-conditions/`)
    .then(response => {
      console.log("Get win conditions response: " + response.data);
      //any other methods here - none yet****
      //rerender winConditions section
    })
  };

  //add a numbers called component
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
        <header>Recent Numbers (Component)</header>
        <BingoCardComponent />
        <AddWinCondition />
      </header>
    </div>
  );
}

export default App;
