import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to ResearchGator!</h1>
            <p>ResearchGator is a platform for you to find research opportunities here at UF!</p>
            {/* Link Button to Login Page */}
            <Link to="/login">
                <button>Get Started</button>
            </Link>
        </div>
    );
};

export default Home;
