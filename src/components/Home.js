import React from 'react';

const Home = () => {
    return (
        <div style={{textAlign: 'center', padding: '50px'}}>
            <h1>Welcome to ResearchGator!</h1>
            <p>ResearchGator is a platform for you to find research opportunities here at UF!</p>
            <button onClick={() => alert('Coming soon!')}>Get Started</button>
        </div>
    )
}

export default Home;