import React, { useState } from 'react';
import './Dashboard.scss';

const Dashboard = () => {
    const [major, setMajor] = useState('');
    const [interests, setInterests] = useState('');
    const [skills, setSkills] = useState('');
    const [options, setOptions] = useState({
        machineLearning: false,
        medicine: false,
        artificialIntelligence: false,
    });
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults([]);
        try {
            // request
            const response = await fetch('http://localhost:5001/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ major, interests, skills }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setResults(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
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
                        {loading ? 'Loading...' : 'Get Suggestions'}
                    </button>
                </form>
                {/* Display results here */}
                <div className="results" style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc'}}>
                    {results.length > 0 && (
                        <div>
                            <h3>Results:</h3>
                            <ul>
                                {results.map((result, index) => (
                                    <li key={index} style={{marginBottom: '15px', lineHeight: '1.6'}}>
                                        <strong>Title: </strong> {result.title} <br />
                                        <strong>Authors: </strong> {Array.isArray(result.authors) ? result.authors.join(', ') : 'No Authors Found'} <br />
                                        <strong>Departments: </strong> {Array.isArray(result.departments) ? result.departments.join(', ') : 'No Departments Found'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
