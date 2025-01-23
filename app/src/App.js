import './App.css';
import React, {useEffect, useState, useRef} from 'react';
import BingoCardComponent from './components/BingoCard';
import NumbersCalledComponent from './components/NumbersCalled';
import WinConditionsComponent from './components/WinConditions';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function App() {
  const [inputValue, setInputValue] = useState('');
  const [activeComponent, setActiveComponent] = useState('bingo');//currently active component
  const [recentNumbers, setRecentNumbers] = useState([]);//for the list of three recently called numbers
  const numbersCalledRef = useRef(null);
  const bingoCardsRef = useRef(null);

  
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
        fetchRecentNumbers();
        if (numbersCalledRef.current) {
          numbersCalledRef.current.refreshNumbers();//trigger refresh in NumbersCalledComponent
        }
        if (bingoCardsRef.current) {
          bingoCardsRef.current.refreshCards();//trigger refresh in BingoCardComponent
        }
        if (response.data.winFound != -1) handleWinFound(response.data.winFound);
      })
      .catch(error => {
        if (error.response && error.response.status == 409) {
          alert(`${error.response.data.num} already called`);
        }
        console.error("error calling number - app.js: ", error)
      });
    setInputValue(''); //reset the input value
  } 

  //for optional card display in header in future
  const fetchCards = () => {
    axios.get(`/api/bingo-cards`)
    .then(response => {
      console.log("Get bingo cards response: "+ response.data);
      //other methods here, none yet
    })
    .catch(error => console.error("Error fetching bingo cards - app.js", error));
  };

  const fetchRecentNumbers = () => {
    axios.get(`/api/numbers-called/`)
    .then(response => {
      const sortedNumbers = [...response.data].sort((a, b) => b.id - a.id);
      setRecentNumbers(sortedNumbers.slice(0, 3));//sets most recent three numbers
    })
    .catch(error => console.error("Error fetching called numbers - app.js ", error));
  };

  //for optional WC display in header in future
  const fetchWinConditions = () => {
    axios.get(`/api/win-conditions/`)
    .then(response => {
      console.log("Get win conditions response: " + response.data);
    })
  };

  //for scrolling through component scrollbar
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  }

  const handleWinFound = (winFound) => {
    alert("Win Found in Card " + winFound);
  }

  //maybe make faster by always rendering all 3 components and using html to dynamically hide 2
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'bingo':
        return <BingoCardComponent 
          ref={bingoCardsRef}
          handleWinFound={handleWinFound}
        />
      case 'numbersCalled':
        return <NumbersCalledComponent 
          ref={numbersCalledRef}
          fetchRecentNumbers={fetchRecentNumbers}//pass method as a prop to child
          handleWinFound={handleWinFound}
        />
      case 'winConditions':
        return <WinConditionsComponent 
        handleWinFound={handleWinFound}
        />
      default:
        return null;
    }
  }

  const getButtonClass = (component) => {
    return activeComponent === component ? 'active-component-button' : '';
  }

  //settings for nav carousel (react-slick)
  const sliderSettings = {
    initialSlide: 1,
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    focusOnSelect: true,
    cssEase: 'ease-in-out',
    beforeChange: (oldIndex, newIndex) => {//handles sliding
      console.log(oldIndex, newIndex)
      const components = ['numbersCalled', 'bingo', 'winConditions'];
      setActiveComponent(components[(newIndex)%3]);
    },
  };

  //add a numbers called component
  return (
    <div className="App">
      <header className="App-header">
        {/* Input for submitting a called number */}
        <form className="numberEntry" onSubmit={handleInputFieldSubmit}>
            <label>
                Enter Number:
                <input className="numberInputField" type='number' min="1" max ="75" value={inputValue} onChange={handleInputFieldChange} />
            </label>
            <button type = "submit">Submit</button>
        </form>

        {/* Display most recent numbers */}
        <div className="recent-numbers-label">
          <div>Recent Numbers:</div>
          {recentNumbers.length > 0 ? (
            <div className='recent-numbers-data'>
              {recentNumbers.map((number) => (
                <span key={number.id} className="recent-number">
                  {number.number + " "}
                </span>
              ))}
            </div>
          ): (
            <span className='recent-number'>_</span>
          )}

        </div>

        {/* Scrollable naviagtion carousel */}
        <Slider {...sliderSettings} className="navigation">
          <button
            className={`navButton ${getButtonClass('numbersCalled')}`}
            onClick={() => handleComponentChange('numbersCalled')}
          >
            Numbers <br/> Called
          </button>
          <button
            className={`navButton ${getButtonClass('bingo')}`}
            onClick={() => handleComponentChange('bingo')}
          >
            Bingo <br/> Cards
          </button>
          <button
            className={`navButton ${getButtonClass('winConditions')}`}
            onClick={() => handleComponentChange('winConditions')}
          >
            Win <br/> Conditions
          </button>
          <button //Idk why, but adding duplicate slides fixed all of the unresolved react-slick issues
            className={`navButton ${getButtonClass('numbersCalled')}`}
            onClick={() => handleComponentChange('numbersCalled')}
          >
            Numbers <br/> Called
          </button>
          <button
            className={`navButton ${getButtonClass('bingo')}`}
            onClick={() => handleComponentChange('bingo')}
          >
            Bingo <br/> Cards
          </button>
          <button
            className={`navButton ${getButtonClass('winConditions')}`}
            onClick={() => handleComponentChange('winConditions')}
          >
            Win <br/> Conditions
          </button>
        </Slider>
      </header>

      {/* Main content area, display selected component */}
      <main>
        {renderActiveComponent()}  
      </main>
    </div>
  );
}

export default App;
