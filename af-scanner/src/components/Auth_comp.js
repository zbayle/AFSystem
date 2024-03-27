import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../services/login_api';
import { getUserProfile } from '../services/getProfile_api'; // Import getUserProfile service
import { fetchRoleDetails } from '../services/perms_api'; // Import fetchRoleDetails service 

export const AuthContext = React.createContext(); 

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('guest');
  const [perms, setPerms] = useState(null); 

  useEffect(() => {
    if (role !== 'guest' && token) {
      fetchRoleDetails(role, token)
        .then(roleDetails => {
          setPerms(roleDetails.perms); // Set permissions
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [role, token]);

  const login = async (username, password) => {
    try {
      const userData = await loginUser(username, password);
      setToken(userData.token);
      setIsAuthenticated(true);

      const userProfile = await getUserProfile(userData.token); // Call getUserProfile service
      setUsername(userProfile.username);
      setRole(userProfile.role);

      const roleDetails = await fetchRoleDetails(userProfile.role, userData.token); // Fetch role details
      setPerms(roleDetails.perms); // Set permissions
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setUsername('');
    setRole('guest');
    setToken(null);
    setIsAuthenticated(false);
    setPerms(null); // Reset permissions on logout
  };

  const authContextValue = {
    isAuthenticated, // Include isAuthenticated in context value
    login,
    logout,
    token,
    user: isAuthenticated ? { username, role, perms } : null, // Add user object to context
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;