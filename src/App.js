import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.js';

function App() {
    return (
        <Router>
            <div className="App">
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>

                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
