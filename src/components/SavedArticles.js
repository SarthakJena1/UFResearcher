import React, { useEffect, useState} from "react";

const SavedArticles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const loggedUser = localStorage.getItem("username");
                const response = await fetch(`/saved-articles?username=${loggedUser}`);
                const data = await response.json();
                if (response.ok) {
                    setArticles(data);
                }
                else {
                    alert(data.message)
                }
            }
            catch (error) {
                alert("Error fetching saved articles");
            }
        }
        fetchArticles();
    }, []);

    return (
        <div>
            <h1>Saved Articles</h1>
            {articles.length > 0 ? (
                <ul>
                    {articles.map((article, index) => (
                        <li key={index}>
                            <strong>{article.title}</strong>
                            <br />
                            <small>Fields: {article.fields.join(', ')}</small>
                            <br />
                            <small>Authors: {article.authors.join(', ')}</small>
                            <br />
                            <small>Departments: {article.departments.join(', ')}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No saved articles found.</p>
            )}
            <button
                className="back-button"
                onClick={() => window.history.back()}
                style={{ color: "white"}}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default SavedArticles;
