import logo from './logo.svg';
import './App.css';
//requirement for importing InputField component, usually kept in src/components
import InputField from './components/InputField';

function App() {//starting point for the app
  return (
    <div className="App">
      <header className="App-header">
        <h1> React Input Field Example</h1>
        <InputField />
      </header>
    </div>
  );
}

export default App;
