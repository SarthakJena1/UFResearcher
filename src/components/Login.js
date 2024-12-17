import React, { useState } from 'react';
import './Login.scss';

function Login() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (!username.endsWith('@ufl.edu')) {
            setError('Please enter a valid UFL email address.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log('Login Response:', data); //debugging log

            if (!response.ok) {
                setError(data.message || 'Failed to log in.');
                return;
            }

            setMessage('Login successful! Redirecting...');
            setTimeout(() => {
                setMessage('');
                // add navigation logic here (if needed) (auth)
            }, 2000);
        } catch (err) {
            console.error('Login Error:', err);
            setError('An error occurred during login. Please try again.');
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log('Register Response:', data);

            if (!response.ok) {
                setError(data.message || 'Failed to register.');
                return;
            }

            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                setMessage('');
                setIsLoginView(true);
            }, 2000);
        } catch (err) {
            console.error('Registration Error:', err);
            setError('An error occurred during registration. Please try again.');
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setMessage('');
    };

    return (
        <div className="login-page">
            {/* Background stars */}
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>

///login + register form

            <div className="login-container">
                <h2>{isLoginView ? 'Login' : 'Register'}</h2>
                <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            type="text"
                            placeholder="Enter your UFL email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {!isLoginView && (
                        <div className="input-group">
                            <label>Confirm Password:</label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <button type="submit">{isLoginView ? 'Log In' : 'Register'}</button>
                    {error && <div className="error">{error}</div>}
                    {message && <div className="success">{message}</div>}
                </form>
                <button onClick={toggleView} className="toggle-form">
                    {isLoginView
                        ? 'Need to register? Click here.'
                        : 'Already have an account? Log in here.'}
                </button>
            </div>
        </div>
    );
}

export default Login;
