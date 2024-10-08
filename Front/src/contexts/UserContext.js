import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => sessionStorage.getItem('userId'));
  const [userType, setUserType] = useState(() => sessionStorage.getItem('userType'));
  const [userName, setUserName] = useState(() => sessionStorage.getItem('userName'));

    useEffect(() => {
    if (userId) {
      console.log('Setting userId in sessionStorage:', userId);
      sessionStorage.setItem('userId', userId);
    } else {
      console.log('Removing userId from sessionStorage');
      sessionStorage.removeItem('userId');
    }
  }, [userId]);
  
  useEffect(() => {
    if (userType) {
      console.log('Setting userType in sessionStorage:', userType);
      sessionStorage.setItem('userType', userType);
    } else {
      console.log('Removing userType from sessionStorage');
      sessionStorage.removeItem('userType');
    }
  }, [userType]);
  
  useEffect(() => {
    if (userName) {
      console.log('Setting userName in sessionStorage:', userName);
      sessionStorage.setItem('userName', userName);
    } else {
      console.log('Removing userName from sessionStorage');
      sessionStorage.removeItem('userName');
    }
  }, [userName]);
  
  return (
    <UserContext.Provider value={{ userId, setUserId, userType, setUserType, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};