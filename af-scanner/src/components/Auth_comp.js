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
  const [perms, setPerms] = useState({ dashBoardAccess: false }); // Set default perms
  const [loading, setLoading] = useState(true);
  const [roleDetails, setRoleDetails] = useState(null); // Add roleDetails state variable

  useEffect(() => {
    console.log('AuthProvider mounted'); // Log when the component mounts

    return () => {
      console.log('AuthProvider unmounted'); // Log when the component unmounts
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && role !== 'guest' && token) {
      fetchRoleDetails(role, token)
        .then(roleDetails => {
          setPerms(roleDetails.perms[0]); // Set permissions
          setRoleDetails(roleDetails); // Set roleDetails
          setLoading(false); // Set loading to false when permissions are fetched
        })
        .catch(error => {
          console.log(error);
          setLoading(false); // Set loading to false if an error occurs
        });
    } else {
      setLoading(false); // Set loading to false if the user is a guest
    }
  }, [isAuthenticated, role, token]);

  const login = async (username, password) => {
    try {
      const userData = await loginUser(username, password);
      setToken(userData.token);
      setIsAuthenticated(true);

      const userProfile = await getUserProfile(userData.token); // Call getUserProfile service
      setUsername(userProfile.username);
      setRole(userProfile.role);

      const roleDetails = await fetchRoleDetails(userProfile.role, userData.token); // Fetch role details
      setPerms(roleDetails.perms[0]); // Set permissions
      setRoleDetails(roleDetails); // Set roleDetails
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setUsername('');
    setRole('guest');
    setToken(null);
    setIsAuthenticated(false);
    setPerms({ dashBoardAccess: false }); // Reset permissions on logout
    setRoleDetails(null); // Reset roleDetails on logout
  };

  const authContextValue = {
    isAuthenticated, // Include isAuthenticated in context value
    login,
    logout,
    token,
    user: isAuthenticated ? { username, role, perms, roleDetails } : null, // Add roleDetails to user object
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;