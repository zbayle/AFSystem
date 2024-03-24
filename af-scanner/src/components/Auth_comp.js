import React, { createContext, useState } from 'react';
import { loginUser } from '../services/login_api';
import { getUserProfile } from '../services/getProfile_api'; // Import getUserProfile service

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('guest');

  const login = async (username, password) => {
    try {
      const userData = await loginUser(username, password);
      setToken(userData.token);
      setIsAuthenticated(true);

      const userProfile = await getUserProfile(userData.token); // Call getUserProfile service
      setUsername(userProfile.username);
      setRole(userProfile.role);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setUsername('');
    setRole('guest');
    setToken(null);
    setIsAuthenticated(false);
  };

  const authContextValue = {
    isAuthenticated,
    login,
    logout,
    token,
    user: isAuthenticated ? { username, role } : null, // Add user object to context
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;