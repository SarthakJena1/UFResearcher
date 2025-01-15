import React, { useState, useEffect } from 'react';
import './Tips.scss';

const Tips = () => {
    const [professorName, setProfessorName] = useState('');
    const [researchTopic, setResearchTopic] = useState('');
    const [backgroundInfo, setBackgroundInfo] = useState('');
    const [generatedEmail, setGeneratedEmail] = useState('');

    const generateEmail = () => {
        if (professorName.trim() && researchTopic.trim()) {
            const email = `Dear Professor ${professorName},

I hope this email finds you well. My name is [Your Name], and I am a [Your Year, e.g., sophomore] majoring in [Your Major] at [Your University]. I have a strong interest in ${researchTopic}, and I have been particularly impressed by your work in this area, especially [mention a specific paper, project, or accomplishment if known].

I am reaching out to express my enthusiasm for the opportunity to contribute to your research. ${backgroundInfo ? backgroundInfo + ' ' : ''}I believe my background in [mention relevant skills or coursework] aligns well with the objectives of your research.

I have attached my resume for your reference. Please feel free to reach out if you need any additional information or have further questions. I would greatly appreciate the opportunity to discuss how I could contribute to your work. Please let me know if you are available for a brief meeting or if there is a specific process to apply for research opportunities in your lab.

Thank you for your time and consideration. I look forward to the possibility of working with you.

Best regards,
[Your Full Name]
[Your Contact Information]
[Optional: LinkedIn Profile or Portfolio Link]`;
            setGeneratedEmail(email);
        } else {
            setGeneratedEmail("Please fill in both the professor's name and the research topic to generate an email.");
        }
    };

    useEffect(() => {
        const scrollButton = document.getElementById("scroll-to-top");
        const handleScroll = () => {
            if (window.scrollY > 200) {
                scrollButton.style.display = "block";
            } else {
                scrollButton.style.display = "none";
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="tips" style={{ height: '100vh', overflow: 'auto' }}>
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

                <div className="email-generator">
                    <h2>Email Template Generator</h2>
                    <div className="form-group">
                        <label>Professor's Name:</label>
                        <input
                            type="text"
                            value={professorName}
                            onChange={(e) => setProfessorName(e.target.value)}
                            placeholder="Enter professor's name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Research Topic of Interest:</label>
                        <input
                            type="text"
                            value={researchTopic}
                            onChange={(e) => setResearchTopic(e.target.value)}
                            placeholder="Enter research topic"
                        />
                    </div>

                    <div className="form-group">
                        <label>Background Information:</label>
                        <textarea
                            value={backgroundInfo}
                            onChange={(e) => setBackgroundInfo(e.target.value)}
                            placeholder="Enter any background information you'd like to include"
                        />
                    </div>

                    <button onClick={generateEmail} className="generate-button">Generate Email</button>

                    {generatedEmail && (
                        <div className="generated-email">
                            <h3>Generated Email:</h3>
                            <textarea readOnly value={generatedEmail} rows={10} style={{ width: '100%' }} />
                        </div>
                    )}
                </div>

                <button
                    className="back-button"
                    onClick={() => window.history.back()}
                    style={{ color: "white" }}
                >
                    Back to Dashboard
                </button>
            </div>

            <button
                id="scroll-to-top"
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    display: "none",
                    padding: "10px 20px",
                    backgroundColor: "#FF6600",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 1000
                }}
                onClick={scrollToTop}
            >
                Scroll to Top
            </button>
        </div>
    );
};

export default Tips;
