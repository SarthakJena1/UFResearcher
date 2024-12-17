import React, { useState } from 'react';
import './Dashboard.scss';

const Dashboard = () => {
    const [major, setMajor] = useState('');
    const [interests, setInterests] = useState('');
    const [skills, setSkills] = useState('');
    const [options, setOptions] = useState({
        machineLearning: false,
        medicine: false,
    });



    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`
        Suggestions based on:
        Major: ${major}
        Interests: ${interests}
        Skills: ${skills}
        Preferences: ${JSON.stringify(options, null, 2)}
        `);
    };

    return (
        <div className="dashboard">
            <div className="header">
                <h1>Welcome to ResearchGator!</h1>
                <p>Explore opportunities tailored for you</p>
            </div>

            <div className="trending">
                <h2>Trending Searches</h2>
                <ul>
                    <li>Machine Learning in Healthcare</li>
                    <li>AI-powered Biology Projects</li>
                    <li>Writing Skills for Research Proposals</li>
                </ul>
            </div>

            <div className="suggestion-engine">
                <h2>Get Personalized Suggestions</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Major:</label>
                        <input
                            type="text"
                            placeholder="e.g., Computer Science"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Interests:</label>
                        <select
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        >
                            <option value="">Select an Interest</option>
                            <option value="Machine Learning">Machine Learning</option>
                            <option value="Artificial Intelligence">Artificial Intelligence</option>
                            <option value="Medicine">Medicine</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Skills Interested In:</label>
                        <select
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        >
                            <option value="">Select a Skill</option>
                            <option value="Python">Python</option>
                            <option value="Biochemistry">Biochemistry</option>
                            <option value="Writing">Writing</option>
                        </select>
                    </div>

                    <button type="submit">
                        Get Suggestions
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
