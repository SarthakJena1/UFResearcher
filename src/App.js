import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.js';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import './App.scss';

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
                    <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
