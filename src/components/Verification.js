import React, { useState, useEffect } from 'react';
import './Login.scss';
import {useParams} from "react-router-dom";

const VerifyEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`https://ufresearcherbackend.onrender.com/verify/${token}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error verifying email');
                }
                setMessage('Email verified successfully! You can now log in.');
            } catch (err) {
                console.error('Verification Error:', err.message);
                setError(err.message);
            }
        };
        verifyEmail();
    }, [token]);

    return (
        <div className="verification">
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default VerifyEmail;
