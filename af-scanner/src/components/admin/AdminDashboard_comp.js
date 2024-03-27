// AdminDashboard.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/Auth_comp'; // Import AuthContext
// import UserData from './UserData';
// import ProductData from './ProductData';
// import SalesData from './SalesData';

function AdminDashboard() {
  const { isAuthenticated, user } = useContext(AuthContext); // Access isAuthenticated and user from AuthContext
  const navigate = useNavigate(); // Get navigate function

  // Check if user is authenticated and has dashBoardAccess permission
  const hasDashboardAccess = isAuthenticated && user && user.perms && user.perms.dashBoardAccess;

  if (!hasDashboardAccess) {
    // If user is not authenticated or does not have dashBoardAccess permission, navigate to home page
    navigate('/');
    return null;
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/sales">Sales</Link></li>
          </ul>
        </nav>

        <Switch>
          <Route path="/">
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default AdminDashboard;