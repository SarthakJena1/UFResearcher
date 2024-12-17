import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.js';
import Login from './components/Login.js';

function App() {
    return (
        <Router>
            <div className="App">

                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;