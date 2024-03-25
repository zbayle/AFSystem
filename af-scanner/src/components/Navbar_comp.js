import React, { useContext } from 'react';
import '../App.css';
import LoginBox from './LoginBox_comp';
import { AuthContext } from '../components/Auth_comp'; // Import AuthContext
import ScanProductButton from '../components/CheckOutBtn_comp';

function NavigationBar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext); // Access isAuthenticated, user, and logout from AuthContext

  console.log('NavigationBar isAuthenticated:', isAuthenticated);
  console.log('NavigationBar user:', user);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/path/to/logo.png" alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-center">
        {isAuthenticated && <ScanProductButton user={user} />}
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="navbar-username">{user.username}</span>
            <button onClick={logout}>Logout</button> {/* Call logout when logout button is clicked */}
          </>
        ) : (
          <LoginBox />
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;