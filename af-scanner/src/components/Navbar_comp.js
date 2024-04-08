import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import DialogContext from '../utils/DialogContext';
import LoginBox from './LoginBox_comp';
import ProductCreate from './admin/createProduct_comp';
import { AuthContext } from '../components/Auth_comp'; // Import AuthContext
import ScanProductButton from '../components/CheckOutBtn_comp';
import AirfiberLogo from "../logo.svg";

function UserSection({ user, logout }) {
  return (
    <>
      <span className="navbar-username">{user.username}</span>
      <button onClick={logout}>Logout</button> {/* Call logout when logout button is clicked */}
    </>
  );
}


const routeNames = {
  '/': 'Home',
  '/admin': 'Admin Dashboard',
  // Add more routes as needed
};


function NavigationBar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext); // Access isAuthenticated, user, and logout from AuthContext
  const location = useLocation();
  const navigate = useNavigate();
  const { setCreateDialogOpen } = useContext(DialogContext); 
  const { setProfilesDialogOpen } = useContext(DialogContext);
  const routeName = routeNames[location.pathname] || 'Page not found';

  const handleAdminClick = () => {
    navigate('/admin'); 
  };
  const handleHomeClick = () => {
    navigate('/');
  };
  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  }
  const handleProfilesClick = () => {
    setProfilesDialogOpen(true);
  }
  
  
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <p>{routeName}</p>
      </div>
      <div className="navbar-center">
        {isAuthenticated && <ScanProductButton user={user} />}
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <UserSection user={user} logout={logout} />
            {location.pathname === '/' || location.pathname ==='/create-product' && user && user.perms && user.perms.dashBoardAccess ? (
              <button onClick={handleAdminClick}>Admin</button>
            ) : null}
            {location.pathname === '/admin'  ? (
              <button onClick={handleHomeClick}>Home</button>
            ) : null}
            {location.pathname === '/admin' && user && user.perms && user.perms.createProduct ? (
              <button onClick={handleCreateClick}>Create Product</button>
            ) : null}
            {location.pathname === '/admin' && user && user.perms && user.perms.createUser ? (
              <button onClick={handleProfilesClick}>Profiles</button>
            ) : null}
          </>
        ) : (
          <LoginBox />
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;