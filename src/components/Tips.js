import React from 'react';
import './Tips.scss';

const Tips = () => {
    return (
        <div className="tips">
            <div className="header">
                <h1>Tips on Cold Contact</h1>
                <p>Reach out effectively and professionally!</p>
            </div>

            <div className="content">
                <ul>
                    <li><strong>Do Your Research:</strong> Learn about the person or organization you're contacting.</li>
                    <li><strong>Personalize Your Message:</strong> Tailor your message to their work.</li>
                    <li><strong>Be Concise:</strong> Keep your email or message short and to the point.</li>
                    <li><strong>State Your Purpose Clearly:</strong> Explain why you're reaching out in the first two sentences.</li>
                    <li><strong>Be Professional:</strong> Use proper grammar and avoid casual language.</li>
                    <li><strong>Follow Up:</strong> Send a polite follow-up if you don't hear back after a week.</li>
                </ul>
                <p>Respect their time and show genuine interest in their work!</p>
                <button
                    className="back-button"
                    onClick={() => window.history.back()}
                    style={{ color: "white"}}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Tips;
