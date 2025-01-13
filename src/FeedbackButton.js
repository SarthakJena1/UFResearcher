import React, { useState } from "react";
import "./FeedbackButton.scss";

const FeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleToggle = () => setIsOpen(!isOpen);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) {
            alert("Please enter your feedback.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5001/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feedback }),
            });
            if (response.ok) {
                alert("Thank you for your feedback!");
                setFeedback("");
                setIsOpen(false);
            } else {
                alert("Error sending feedback.");
            }
        } catch (error) {
            alert("Error sending feedback.");
            console.error(error);
        }
    };

    return (
        <div className="feedback-button-container">
            <button className="feedback-button" onClick={handleToggle}>
                Feedback
            </button>
            {isOpen && (
                <div className="feedback-modal">
                    <form onSubmit={handleSubmit}>
                        <h2>Give us your anonymous feedback here!</h2>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Write your feedback here..."
                        ></textarea>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={handleToggle}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FeedbackButton;
