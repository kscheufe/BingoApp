import './App.css';
import React, {useState, useRef} from 'react';
//requirement for importing components (green text), usually kept in src/components
import BingoCardComponent from './components/BingoCard';
import WinCondition from './components/WinCondition';


function App() {//starting point for the app
  const [inputValue, setInputValue] = useState('');
  const bingoCardComponentRef = useRef(null);
  const handleInputFieldChange = (event) => {
      setInputValue(event.target.value);
  }

  //handle called numbers
  const handleInputFieldSubmit = (event) => {
    event.preventDefault();//prevents default behaviour    
    if (!inputValue.trim()) return; //prevents empty submissions
    const numberToCall = parseInt(inputValue);//ensures it's an int

    //call the handleNumerCall function in BingoCardComponent.js for 
    //this component
    if (!isNaN(numberToCall) && bingoCardComponentRef.current) {
      bingoCardComponentRef.current.handleNumberCall(numberToCall);
    }
    //reset the input value
    setInputValue('');
  } 

  return (
    <div className="App">
      <header className="App-header">
        <h1> React Input Field Example</h1>
        <form onSubmit={handleInputFieldSubmit}>
            <label>
                Enter Number:
                <input type='number' min="1" max ="75" value={inputValue} onChange={handleInputFieldChange} />
            </label>
            <button type = "submit">Submit</button>
        </form>
        <BingoCardComponent ref={bingoCardComponentRef}/>
        <WinCondition />
      </header>
    </div>
  );
}

export default App;
