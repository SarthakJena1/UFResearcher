import React, { useState } from 'react';
import './Dashboard.scss';

const Dashboard = () => {
    const [major, setMajor] = useState('');
    const [interests, setInterests] = useState('');
    const [skills, setSkills] = useState('');
    const [options, setOptions] = useState({
        machineLearning: false,
        ai: false,
        medicine: false,
    });

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setOptions((prevOptions) => ({ ...prevOptions, [name]: checked }));
    };

    const handleSubmit = () => {
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

            {/* Options Buttons */}
            <div className="options">
                <button onClick={() => alert("Show full Research Directory")}>
                    View Research Opportunities
                </button>
                <button onClick={() => alert("Show Professors Directory")}>
                    View Professors Directory
                </button>
            </div>

            {/* Trending Searches */}
            <div className="trending">
                <h2>Trending Searches</h2>
                <ul>
                    <li>Machine Learning in Healthcare</li>
                    <li>AI-powered Biology Projects</li>
                    <li>Writing Skills for Research Proposals</li>
                </ul>
            </div>

            {/* Suggestion Engine */}
            <div className="suggestion-engine">
                <h2>Get Personalized Suggestions</h2>
                <form onSubmit={(e) => e.preventDefault()}>
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
                        <input
                            type="text"
                            placeholder="e.g., Artificial Intelligence"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                        />
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

                    {/* Checkboxes */}
                    <div className="form-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="machineLearning"
                                checked={options.machineLearning}
                                onChange={handleCheckboxChange}
                            />
                            Machine Learning
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="ai"
                                checked={options.ai}
                                onChange={handleCheckboxChange}
                            />
                            Artificial Intelligence
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="medicine"
                                checked={options.medicine}
                                onChange={handleCheckboxChange}
                            />
                            Medicine
                        </label>
                    </div>

                    <button type="submit" onClick={handleSubmit}>
                        Get Suggestions
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
