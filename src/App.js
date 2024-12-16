import './App.scss';
import Home from './components/Home.js';

function App() {
  return (
    <div className="App">
      {/* styling */}
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      {/* home page */}
      <Home />        
    </div>
  );
}

export default App;
