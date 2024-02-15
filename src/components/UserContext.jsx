import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
    const[user, setUser] = useState(null);
    
    console.log('Current user in context:', user);

    return(

        <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    )

} 