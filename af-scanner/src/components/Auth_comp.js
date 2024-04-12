import React, { createContext, useState, useEffect } from 'react';
import { loginUser, fobLogin } from '../services/login_api';
import { getUserProfile } from '../services/getProfile_api';
import { fetchRoleDetails } from '../services/perms_api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [perms, setPerms] = useState({ dashBoardAccess: false });
  const [loading, setLoading] = useState(true);
  const [roleDetails, setRoleDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  const resetTimer = () => {
    clearTimeout(logoutTimer);
    setLogoutTimer(setTimeout(logout, 300000)); // 300000 ms = 5 minutes
  };

  const logout = () => {
    setUsername('');
    setRole('guest');
    setToken(null);
    setIsAuthenticated(false);
    setPerms({ dashBoardAccess: false });
    setRoleDetails(null);
    clearTimeout(logoutTimer); // Clear the logout timer

    // Remove token from localStorage
    localStorage.removeItem('token');
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      resetTimer(); // Reset the logout timer when the user is authenticated
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && role !== 'guest' && token) { 
      fetchRoleDetails(role, token)
        .then(roleDetails => {
          setPerms(roleDetails.perms[0]);
          setRoleDetails(roleDetails);
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false); 
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, role, token]);

  const login = async (username, password) => {
    try {
      const userData = await loginUser(username, password);
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.username));
  
      setToken(userData.token);
      setIsAuthenticated(true);
      resetTimer(); // Reset the logout timer when the user logs in
  
      const userProfile = await getUserProfile(userData.token);
      setUsername(userProfile.username);
      setRole(userProfile.role);
      setUserId(userProfile._id);

      const roleDetails = await fetchRoleDetails(userProfile.role, userData.token);
      setPerms(roleDetails.perms[0]);
      setRoleDetails(roleDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const fobLoginFunc = async (fobKey) => {
    try {
      const userData = await fobLogin(fobKey);
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.username));
  
      setToken(userData.token);
      setIsAuthenticated(true);
      resetTimer(); // Reset the logout timer when the user logs in
  
      const userProfile = await getUserProfile(userData.token);
      setUsername(userProfile.username);
      setRole(userProfile.role);
      setUserId(userProfile._id);

      const roleDetails = await fetchRoleDetails(userProfile.role, userData.token);
      setPerms(roleDetails.perms[0]);
      setRoleDetails(roleDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const authContextValue = {
    isAuthenticated,
    login,
    fobLogin: fobLoginFunc,
    logout,
    logoutTimer,
    token,
    user: isAuthenticated ? { _id: userId, username, role, perms, roleDetails } : null,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;