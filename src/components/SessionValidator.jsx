// SessionValidator.js
import React, { useEffect } from 'react';
import { useUser } from './UserContext'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const SessionValidator = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const validateSession = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/validate-session', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user); // Assuming the response contains the user object
                } else {
                    setUser(null);
                    navigate('/login'); // Redirect to login if session is invalid
                }
            } catch (error) {
                console.error('Session validation error:', error);
                setUser(null);
                navigate('/login');
            }
        };

        validateSession();
    }, [setUser, navigate]); // Dependencies

    return null; // This component doesn't render anything
};
export default SessionValidator;