import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.scss';

const Dashboard = () => {
    const [fieldOfInterest, setFieldOfInterest] = useState('');
    const [fieldOptions, setFieldOptions] = useState([]);
    const [major, setMajor] = useState('');
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(false);
    const [allResults, setAllResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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
        setAllResults([]);
        setFilteredResults([]);
        setCurrentPage(1);
        setError('');
        setDirectoryVisible(false);

        try {
            const response = await fetch('http://localhost:5001/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ major, interests: fieldOfInterest ? [fieldOfInterest] : [], page: 1 }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.fieldsOfInterest?.length > 0) {
                setFieldOptions(data.fieldsOfInterest);
            }
            else {
                setFieldOptions([]);
            }

            if (data.results?.length === 0) {
                setError('No results found. Try adjusting your preferences.');
            } else {
                setAllResults(data.results);
                setFilteredResults(data.results);
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
        setAllResults([]);
        setError('');
    };

    const handleFilters = (e) => {
        const selectedField = e.target.value;
        setFieldOfInterest(selectedField);

        if (selectedField) {
            const filtered = allResults.filter((result) =>
                Array.isArray(result.fields) && result.fields.includes(selectedField)
            );
            setFilteredResults(filtered);
        }
        else {
            setFilteredResults(allResults);
        }
    }

    const showMoreResults = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ major, interests: fieldOfInterest ? [fieldOfInterest] : [], page: currentPage + 1 }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.results?.length > 0) {
                setAllResults((prevResults) => [...prevResults, ...data.results]);
                setFilteredResults((prevResults) => [...prevResults, ...data.results]);
                setCurrentPage((prevPage) => prevPage + 1);
            }
        }
        catch (error) {
            console.error('Error fetching suggestions:', error);
            setError('An error occurred while fetching suggestions. Please try again.');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="dashboard">
            <div className="header">
                <h1>Welcome to ResearchGator!</h1>
                <p>Explore opportunities tailored for you</p>
            </div>

            <div className="suggestion-engine">
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
                        <label>Field of Interest:</label>
                        <select
                            value={fieldOfInterest}
                            onChange={handleFilters}
                            // disabled={fieldOptions.length === 0}
                        >
                            <option value="">Select a field</option>
                            {fieldOptions.map((field) => (
                                <option key={field.id} value={field.name}>
                                    {field.name}
                                </option>
                            ))}
                        </select>
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

            {filteredResults.length > 0 && (
                <div className="results-section" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                    <h2>Results</h2>
                    <ul className="compact-results">
                        {filteredResults.map((result, index) => (
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
                    <button style={{ color: "white"}} onClick={showMoreResults} disabled={loading} className="directory-button">
                        {loading ? 'Loading...' : 'View More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
