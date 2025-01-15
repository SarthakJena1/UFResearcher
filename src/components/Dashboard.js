import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.scss';


const Dashboard = () => {
    const [fieldOfInterest, setFieldOfInterest] = useState('');
    const [fieldOptions, setFieldOptions] = useState([]);
    const [major, setMajor] = useState('');
    // const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(false);
    const [allResults, setAllResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [directoryVisible, setDirectoryVisible] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const departments = [
    {
        name: "Accounting",
        link: "https://warrington.ufl.edu/about/fisher/",
    },
    {
        name: "Advertising",
        link: "https://www.jou.ufl.edu/current-students/current-undergraduate/current-academics/current-advertising/",
    },
    {
        name: "African Studies",
        link: "https://africa.ufl.edu/",
    },
    {
        name: "Agricultural and Biological Engineering",
        link: "https://abe.ufl.edu/",
    },
    {
        name: "Agricultural Education and Communication",
        link: "https://aec.ifas.ufl.edu/",
    },
    {
        name: "Agronomy",
        link: "https://agronomy.ifas.ufl.edu/",
    },
    {
        name: "Animal Sciences",
        link: "https://animal.ifas.ufl.edu/",
    },
    {
        name: "Anthropology",
        link: "https://anthro.ufl.edu/about-us/department-subfields/",
    },
    {
        name: "Applied Physiology and Kinesiology",
        link: "http://hhp.ufl.edu/about/departments/apk/",
    },
    {
        name: "Architecture",
        link: "https://dcp.ufl.edu/architecture/",
    },
    {
        name: "Art + Art History",
        link: "https://arts.ufl.edu/academics/art-and-art-history/",
    },
    {
        name: "Astronomy",
        link: "https://www.astro.ufl.edu/",
    },
    {
        name: "Biology",
        link: "https://biology.ufl.edu/",
    },
    {
        name: "Biomedical Engineering",
        link: "https://www.bme.ufl.edu/",
    },
    {
        name: "Chemical Engineering",
        link: "https://www.che.ufl.edu/",
    },
    {
        name: "Chemistry",
        link: "https://www.chem.ufl.edu/",
    },
    {
        name: "Civil and Coastal Engineering",
        link: "https://www.essie.ufl.edu/civil-coastal-engineering/",
    },
    {
        name: "Computer & Information Science & Engineering",
        link: "https://www.cise.ufl.edu/",
    },
    {
        name: "Construction Management",
        link: "https://dcp.ufl.edu/rinker/",
    },
    {
        name: "Digital Worlds Institute",
        link: "https://digitalworlds.ufl.edu/",
    },
    {
        name: "Economics",
        link: "https://economics.clas.ufl.edu/",
    },
    {
        name: "Electrical and Computer Engineering",
        link: "https://www.ece.ufl.edu/",
    },
    {
        name: "Environmental Engineering Sciences",
        link: "https://www.essie.ufl.edu/environmental-engineering-sciences/",
    },
    {
        name: "Family, Youth, and Community Sciences",
        link: "https://fycs.ifas.ufl.edu/",
    },
    {
        name: "Food and Resource Economics",
        link: "https://fred.ifas.ufl.edu/",
    },
    {
        name: "Food Science and Human Nutrition",
        link: "https://fshn.ifas.ufl.edu/",
    },
    {
        name: "Forest, Fisheries, and Geomatics Sciences",
        link: "http://sfrc.ufl.edu/",
    },
    {
        name: "Gender, Sexuality, and Women’s Studies",
        link: "http://wst.ufl.edu/",
    },
    {
        name: "Geography",
        link: "https://geog.ufl.edu/",
    },
    {
        name: "Geological Sciences",
        link: "http://geology.ufl.edu/",
    },
];

    useEffect(() => {
        if (filteredResults.length > 0) {
            setFadeIn(true);
            const timer = setTimeout(() => setFadeIn(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [filteredResults]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!major.trim()) {
            setError('Please enter a major.');
            return;
        }
        setLoading(true);
        setAllResults([]);
        setFilteredResults([]);
        setCurrentPage(1);
        setError('');
        setDirectoryVisible(false);
        setFadeIn(false);

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
            let page = currentPage + 1;
            let foundResults = false;
            const maxPage = 30
            while (!foundResults && page <= maxPage) {
                const response = await fetch('http://localhost:5001/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        major,
                        interests: fieldOfInterest ? [fieldOfInterest] : [],
                        page: currentPage + 1
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.results?.length > 0) {
                    const newResults = data.results;
                    const filteredNewResults = fieldOfInterest
                        ? newResults.filter((result) =>
                            Array.isArray(result.fields) && result.fields.includes(fieldOfInterest)
                        )
                        : newResults;

                    if (filteredNewResults.length > 0) {
                        setAllResults([...allResults, ...newResults]);
                        setFilteredResults([...filteredResults, ...filteredNewResults]);
                        setCurrentPage(page);
                        foundResults = true;
                    } else {
                        page++;
                    }
                } else {
                    page++;
                }
            }
            if (!foundResults) {
                setError('No more results found.');
            }
            if (page > maxPage) {
                setError('Reached maximum number of pages. No more results.');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setError('An error occurred while fetching suggestions. Please try again.');
            }
        finally {
            setLoading(false);
            }
        }
    const saveArticles = async (article) => {
        try {
            const loggedUser = localStorage.getItem("username");
            console.log("logged in user", loggedUser);
            if (!loggedUser) {
                alert("Please login to save articles");
                return;
            }
            const response = await fetch('http://localhost:5001/save-article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: loggedUser, article}),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Article saved successfully");
            }
            else {
                alert(data.message);
            }
        } catch (error) {
            alert("Error saving article");
        }
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
                            disabled={fieldOptions.length === 0}
                        >
                            <option value="">Select a field</option>
                            {fieldOptions.map((field) => (
                                <option key={field.id} value={field.name}>
                                    {field.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/*<div className="form-group">*/}
                    {/*    <label>Skills:</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        placeholder="e.g., Machine Learning, AI"*/}
                    {/*        value={skills}*/}
                    {/*        onChange={(e) => setSkills(e.target.value)}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <button type="submit" className="get-suggestions">
                        {loading ? 'Loading...' : 'Get Suggestions'}
                    </button>

                    <button
                        type="button"
                        className="directory-button"
                        onClick={() => setDirectoryVisible(!directoryVisible)}
                    >
                        {directoryVisible ? 'Hide Departments' : 'Full Department Directory'}
                    </button>
                    <Link to="/tips">
                        <button className="contact-button">
                            How to Cold Contact
                        </button>
                    </Link>
                    <Link to="/saved-articles">
                        <button className="contact-button">
                            Saved Articles
                        </button>
                    </Link>
                </form>
            </div>

            {directoryVisible && (
                <div
                    className={`directory-section ${directoryVisible ? 'visible' : ''}`}
                    style={{overflowY: 'scroll'}}
                >
                    <h2>Departments</h2>
                    <ul className="directory-list">
                        {departments.map((dept, index) => (
                            <li key={index}>
                                <a
                                    href={dept.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="directory-link"
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
                <div className={`results-section ${fadeIn ? 'fade-in' : ''}`} style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                    <h2>Results</h2>
                    <ul className="compact-results">
                        {filteredResults.map((result, index) => (
                            <li key={index}>
                                <strong>
                                    <a
                                        href={`https://www.google.com/search?q=${result.title}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {result.title}
                                    </a>
                                    </strong>
                                <br/>
                                <small>
                                    <small style={{fontWeight: 'bold'}}>Date Published:</small> {result.date}
                                </small>
                                <br/>
                                <small>
                                    <small style={{fontWeight: 'bold'}}>Fields:</small>  {result.fields?.length > 0 ? result.fields.join(', ') : 'N/A'}
                                </small>
                                <br/>
                                <small>
                                    <small style={{fontWeight: 'bold'}}>Departments:</small> {result.fields?.length > 0 ? result.departments.join(', ') : 'N/A'}
                                </small>
                                <br/>
                                <small style={{fontWeight: 'bold'}}>Authors: </small>
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
                                <br/>
                                <span
                                    className="ribbon save"
                                    onClick={() => saveArticles(result)}
                                    title="Save Article"
                                >
                                    Save <span>&#128278;</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <button style={{color: "white"}} onClick={showMoreResults} disabled={loading} className="directory-button">
                        {loading ? 'Searching pages...' : 'View More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
