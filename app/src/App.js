import './App.css';
import React, {useEffect, useState, useRef} from 'react';
import BingoCardComponent from './components/BingoCard';
import NumbersCalledComponent from './components/NumbersCalled';
import WinConditionsComponent from './components/WinConditions';
//import AddWinCondition from './components/AddWinCondition'; needed in a sub-component now
import axios from 'axios';

function App() {//starting point for the app
  const [inputValue, setInputValue] = useState('');
  const [activeComponent, setActiveComponent] = useState('bingo');//currently active component
  const [recentNumbers, setRecentNumbers] = useState([]);//for the list of three recently called numbers
  //const [allNumbers, setAllNumbers] = useState([]); //not sure if actually needed in this component
  const numbersCalledRef = useRef(null);

  
  useEffect(() => {
    fetchRecentNumbers();//fetchRecentNumbers when component mounts, likely unnecessary but could prevent some user use-case errors
  }, []);
  

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
        fetchRecentNumbers();
        if (numbersCalledRef.current) {
          numbersCalledRef.current.refreshNumbers();//trigger refresh in NumbersCalledComponent
        }
        //redraw cards
        fetchCards();

      })
      .catch(error => {
        if (error.response && error.response.status == 409) {
          alert(`${error.response.data.num} already called`);
        }
        //else {
          console.error("error calling number - app.js: ", error)//}
      });
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
  const fetchRecentNumbers = () => {
    axios.get(`/api/numbers-called/`)
    .then(response => {
      const sortedNumbers = [...response.data].sort((a, b) => b.id - a.id);
      setRecentNumbers(sortedNumbers.slice(0, 3));//sets most recent three numbers
      //any other methods here - none yet*****
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

  //for scrolling through component scrollbar
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  }

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'bingo':
        return <BingoCardComponent />
      case 'numbersCalled':
        return <NumbersCalledComponent 
          ref={numbersCalledRef}
          fetchRecentNumbers={fetchRecentNumbers}//pass method as a prop to child
          //recentNumbers={recentNumbers}
        />
      case 'winConditions':
        return <WinConditionsComponent />
      default:
        return null;
    }
  }

  const getButtonClass = (component) => {
    return activeComponent === component ? 'active-component-button' : '';
  }

  //add a numbers called component
  return (
    <div className="App">
      <header className="App-header">
        {/* Input for submitting a called number */}
        <form onSubmit={handleInputFieldSubmit}>
            <label>
                Enter Number:
                <input type='number' min="1" max ="75" value={inputValue} onChange={handleInputFieldChange} />
            </label>
            <button type = "submit">Submit</button>
        </form>

        {/* Display most recent numbers */}
        <div className="recent-numbers">
          <h3>Recent Numbers:</h3>
          {recentNumbers.length > 0 ? (
            <p>
              {recentNumbers.map((number) => (
                <span key={number.id} className="recent-number">
                  {number.number + " "}
                </span>
              ))}
            </p>
          ): (
            <p>No numbers called yet.</p>
          )}

        </div>

        {/* Scrollable naviagtion for components (will be swipeable in app) */}
        <div className="navigation">
          <button className= {getButtonClass('numbersCalled')} onClick={() => handleComponentChange('numbersCalled')}>Numbers Called</button>
          <button className= {getButtonClass('bingo')} onClick={() => handleComponentChange('bingo')}>Bingo Cards</button>
          <button className= {getButtonClass('winConditions')} onClick={() => handleComponentChange('winConditions')}>Win Conditions</button>
        </div>
      </header>

      {/* Main content area, display selected component */}
      <main>
        {renderActiveComponent()}  
      </main>
    
    </div>
  );
}

export default App;
