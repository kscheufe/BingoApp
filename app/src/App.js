import logo from './logo.svg';
import './App.css';
//requirement for importing InputField component, usually kept in src/components
import InputField from './components/InputField';
import BingoCardComponent from './components/BingoCard';

function App() {//starting point for the app
  return (
    <div className="App">
      <header className="App-header">
        <h1> React Input Field Example</h1>
        <InputField />
        <BingoCardComponent />
      </header>
    </div>
  );
}

export default App;
