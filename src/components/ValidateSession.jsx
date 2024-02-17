import React, { useEffect } from 'react';
import { useUser } from './UserContext';

const ValidateSession = () => {
    const { setUser } = useUser();

    useEffect(() => {
        async function validateSession() {
            try {
                const response = await fetch('http://localhost:4000/api/validate', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const { user } = await response.json();
                    setUser(user);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        validateSession();
    }, [setUser]); // No need to include setUser in dependency array

    return null; // This component doesn't need to render anything
};

export default ValidateSession;