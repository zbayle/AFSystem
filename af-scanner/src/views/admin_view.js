import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthContext } from '../components/Auth_comp'; // Import AuthContext

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
    <div>
      <h1>Admin Dashboard</h1>
      {/* Rest of your dashboard code */}
    </div>
  );
}

export default AdminDashboard;