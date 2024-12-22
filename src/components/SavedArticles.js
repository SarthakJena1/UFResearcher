import React, { useEffect, useState} from "react";
import "./SavedArticles.scss";
const SavedArticles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const loggedUser = localStorage.getItem("username");
                console.log("fetching saved articles for:", loggedUser);
                const response = await fetch(`http://localhost:5001/saved-articles?username=${loggedUser}`);
                const data = await response.json();
                if (response.ok) {
                    setArticles(data);
                }
                else {
                    console.log("Error from server:", data.message);
                    alert(data.message)
                }
            }
            catch (error) {
                console.error("Error fetching saved articles:", error.message);
                alert("Error fetching saved articles");
            }
        }
        fetchArticles();
    }, []);

    const unsaveArticle = async (articleTitle) => {
        const loggedUser = localStorage.getItem("username");
        if (!loggedUser) {
            alert("User not logged in");
            return;
        }
        try {
            const response = await fetch("http://localhost:5001/unsave-article", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: loggedUser, articleTitle }),
            });
            const data = await response.json();
            if (response.ok) {
                setArticles((prevArticles) => prevArticles.filter((article) => article.title !== articleTitle));
                alert(data.message);
            }
            else {
                console.log("Error from server:", data.message);
                alert(data.message);
            }
        }
        catch (error) {
            console.error("Error unsaving article:", error.message);
            alert("Error unsaving article");
        }
    }

return (
        <div className="saved-articles">
            <h1>Saved Articles</h1>
            {articles.length > 0 ? (
                <div className="articles-list">
                    {articles.map((article, index) => (
                        <div key={index} className="article-item">
                            <strong className="article-title">{article.title}</strong>
                            <br />
                            <span className="article-details">
                                <strong>Fields:</strong> {article.fields?.length > 0 ? article.fields.join(", ") : "N/A"}
                            </span>
                            <br />
                            <span className="article-details">
                                <strong>Departments:</strong> {article.departments?.length > 0 ? article.departments.join(", ") : "N/A"}
                            </span>
                            <br />
                            <span className="article-details">
                                <strong>Authors:</strong>{" "}
                                {article.authors.map((author, i) => (
                                    <a
                                        key={i}
                                        href={`https://www.google.com/search?q=${encodeURIComponent(author)} UF`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="author-link"
                                    >
                                        {author}
                                    </a>
                                ))}
                            </span>
                            <br />
                            <span
                                className="ribbon unsave"
                                onClick={() => unsaveArticle(article.title)}
                                title="Unsave Article"
                            >
                                Unsave ✖
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No saved articles found.</p>
            )}
            <button
                className="back-button"
                onClick={() => window.history.back()}
                style={{ color: "white" }}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default SavedArticles;
