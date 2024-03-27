// PrivateRoute.js
import React, { useContext } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth_comp'; // Import AuthContext

function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated } = useContext(AuthContext); // Access isAuthenticated from AuthContext
  const navigate = useNavigate(); // Get navigate function

  if (!isAuthenticated) {
    // If user is not authenticated, navigate to login page
    navigate('/');
    return null;
  }

  return <Route {...rest}>{children}</Route>;
}

export default PrivateRoute;