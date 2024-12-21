import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.scss';

const Dashboard = () => {
    const [fieldOfInterest, setFieldOfInterest] = useState('');
    const [major, setMajor] = useState(''); // Decorative field
    const [skills, setSkills] = useState(''); // Decorative field
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [directoryVisible, setDirectoryVisible] = useState(false);

    const departments = [
        {
            name: "The Herbert Wertheim UF Scripps Institute for Biomedical Innovation & Technology",
            link: "https://wertheim.scripps.ufl.edu/departments/faculty-directory/",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults([]);
        setError('');
        setDirectoryVisible(false);

        try {
            const response = await fetch('http://localhost:5001/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ major: fieldOfInterest }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                setError('No results found. Try adjusting your preferences.');
            } else {
                setResults(data);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setError('An error occurred while fetching suggestions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFullDirectory = () => {
        setDirectoryVisible(true);
        setResults([]);
        setError('');
    };

    return (
        <div className="dashboard">
            <div className="header">
                <h1>Welcome to ResearchGator!</h1>
                <p>Explore opportunities tailored for you</p>
            </div>

            <div className="suggestion-engine">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Field of Interest:</label>
                        <input
                            type="text"
                            placeholder="e.g., Computer Science"
                            value={fieldOfInterest}
                            onChange={(e) => setFieldOfInterest(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Major:</label>
                        <input
                            type="text"
                            placeholder="e.g., Medicine"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Skills:</label>
                        <input
                            type="text"
                            placeholder="e.g., Machine Learning, AI"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="get-suggestions">
                        {loading ? 'Loading...' : 'Get Suggestions'}
                    </button>
                    <button
                        type="button"
                        className="directory-button"
                        onClick={handleFullDirectory}
                    >
                        View Full Directory
                    </button>
                    <Link to="/tips">
                        <button className="contact-button">
                            How to Cold Contact
                        </button>
                    </Link>
                </form>
            </div>

            {directoryVisible && (
                <div className="directory-section">
                    <h2>Departments</h2>
                    <ul className="directory-list">
                        {departments.map((dept, index) => (
                            <li key={index}>
                                <a
                                    href={dept.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {dept.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <div className="results-section"><p className="no-results">{error}</p></div>}

            {results.length > 0 && (
                <div className="results-section" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                    <h2>Results</h2>
                    <ul className="compact-results">
                        {results.map((result, index) => (
                            <li key={index}>
                                <strong>{result.title}</strong>
                                <br />
                                <small>
                                    {result.authors.map((author, i) => (
                                        <span key={i}>
                                            <a
                                                href={`https://www.google.com/search?q=${encodeURIComponent(
                                                    `${author} UF`
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {author}
                                            </a>
                                            {i < result.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
