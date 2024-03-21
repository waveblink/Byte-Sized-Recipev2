import React, { useEffect } from 'react';
import { useUser } from './UserContext';
import axios from 'axios';

const ValidateSession = () => {
    const { setUser } = useUser();

    useEffect(() => {
        async function validateSession() {
            try {
                const response = await axios.get('https://byte-sized-recipev2.vercel.app/api/validate', {
                    withCredentials: true, 
                });

                const { user } = response.data;
                setUser(user);

            } catch (error) {
                console.error('Error:', error);
            }
        }

        validateSession();
    }, [setUser]); 

    return null; 
};

export default ValidateSession;
