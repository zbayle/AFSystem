import React, { createContext, useState, useEffect, useRef } from 'react';
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
  const inactivityTimer = useRef(null);
  const techTimer = useRef(null);

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(startTechTimer, 30000); // 30000 ms = 30 seconds
  };

  const startTechTimer = () => {
    if (isAuthenticated && role === 'Tech' && !techTimer.current) {
      techTimer.current = setTimeout(logout, 60000); // 10000 ms = 80 seconds
    }
  };

  const logout = () => {
    setUsername('');
    setRole('guest');
    setToken(null);
    setIsAuthenticated(false);
    setPerms({ dashBoardAccess: false });
    setRoleDetails(null);
    clearTimeout(techTimer); // Clear the tech timer
    clearTimeout(inactivityTimer); // Clear the inactivity timer
    techTimer.current = null;

    // Remove token from localStorage
    localStorage.removeItem('token');
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);

    return () => {
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
    };
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      resetInactivityTimer(); // Reset the inactivity timer
    }
  }, []);
  useEffect(() => {
    if (isAuthenticated && role === 'Tech') {
      startTechTimer();
    }
  }, [isAuthenticated, role]);

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
      resetInactivityTimer(); // Reset the logout timer when the user logs in
  
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
      resetInactivityTimer(); // Reset the logout timer when the user logs in
  
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