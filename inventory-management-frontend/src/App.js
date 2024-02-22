import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';

function App() {
  // State to keep track of user's authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle user login
  const handleLogin = () => {
    // Implement your logic to set isLoggedIn to true after successful login
    setIsLoggedIn(true);
  };

  // Function to handle user logout
  const handleLogout = () => {
    // Implement your logic to set isLoggedIn to false after logout
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Airfiber Inventory System
        </p>
        {/* Conditionally render LoginForm only if user is not logged in */}
        {!isLoggedIn && <LoginForm onLogin={handleLogin} />}
        {/* Example of conditional rendering based on authentication status */}
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
      </header>
    </div>
  );
}

export default App;
