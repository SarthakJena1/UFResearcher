import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup} from "react-transition-group";
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import VerifyEmail from './components/Verification.js';
import Tips from './components/Tips.js';
import SavedArticles from './components/SavedArticles.js';
import FeedbackButton from "./FeedbackButton.js";
import './App.scss';
import './Transitions.scss';



const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}>
                <Routes location={location}>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/verify/:token" element={<VerifyEmail />} />
                    <Route path="/tips" element={<Tips />} />
                    <Route path="/saved-articles" element={<SavedArticles />} />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <FeedbackButton />
                <AnimatedRoutes />
            </div>
        </Router>
    );
}

export default App;
