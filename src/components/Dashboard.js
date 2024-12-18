import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.scss';

const Dashboard = () => {
    const [major, setMajor] = useState('');
    const [interests, setInterests] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const interestsRef = useRef(null);
    const skillsRef = useRef(null);

    const [showInterestsDropdown, setShowInterestsDropdown] = useState(false);
    const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

    const handleInterestChange = (interest) => {
        setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
    };

    const handleSkillChange = (skill) => {
        setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    };

    const handleOutsideClick = (e) => {
        if (interestsRef.current && !interestsRef.current.contains(e.target)) {
            setShowInterestsDropdown(false);
        }
        if (skillsRef.current && !skillsRef.current.contains(e.target)) {
            setShowSkillsDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ major, interests, skills }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
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
                    <div className="form-group" ref={interestsRef}>
                        <label onClick={() => setShowInterestsDropdown(!showInterestsDropdown)}>Interests:</label>
                        {showInterestsDropdown && (
                            <div className="dropdown-content">
                                {["Machine Learning", "Artificial Intelligence", "Biotechnology", "Environmental Science", "Quantum Computing", "Cybersecurity", "Public Health", "Economics", "Astrophysics", "Psychology", "Digital Arts", "Philosophy", "Aerospace", "Music Technology", "Educational Technology", "Political Science", "Sports Science", "Entrepreneurship", "Marketing", "Robotics"].map(interest => (
                                    <div key={interest} onClick={() => handleInterestChange(interest)}>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={interests.includes(interest)}
                                            />
                                            {interest}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="form-group" ref={skillsRef}>
                        <label onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}>Skills Interested In:</label>
                        {showSkillsDropdown && (
                            <div className="dropdown-content">
                                {["Programming", "Statistical Analysis", "Machine Learning", "Web Development", "Project Management", "Clinical Research", "Electrical Engineering", "3D Modeling", "Quantitative Analysis", "Public Speaking"].map(skill => (
                                    <div key={skill} onClick={() => handleSkillChange(skill)}>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={skills.includes(skill)}
                                            />
                                            {skill}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="get-suggestions">{loading ? 'Loading...' : 'Get Suggestions'}</button>
                </form>
                <button className="directory-button">View Full Directory</button>
            </div>

            {results.length > 0 && (
                <div className="results-section">
                    <h2>Results</h2>
                    {results.map((result, index) => (
                        <div key={index} className="result-item">
                            <h3>{result.title}</h3>
                            <p>Authors: {result.authors.join(", ")}</p>
                            <p>Departments: {result.departments.join(", ")}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
