import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import VerifyEmail from './components/Verification.js';
import Tips from './components/Tips.js';
import './App.scss';

function App() {
    return (
        <Router>
            <div className="App">
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/verify/:token" element={<VerifyEmail />} />
                    <Route path="/tips" element={<Tips />} /> {/* New Tips Route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
