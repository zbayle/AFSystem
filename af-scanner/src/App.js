import React, { useContext, useEffect, useState } from 'react'; // Import useEffect and useState
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomeView from './views/home_view';
import NavigationBar from './components/Navbar_comp';
import Scanner from './components/Scanner_comp';
import AuthProvider, { AuthContext } from './components/Auth_comp'; // Import AuthContext
import { fetchRoleDetails } from './services/perms_api'; // Import fetchRoleDetails

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, token, user } = useContext(AuthContext); // Get token and user from AuthContext
  const [roleDetails, setRoleDetails] = useState(null); // State to store role details

  useEffect(() => {
    if (isAuthenticated && user && user.role) {
      // Fetch role details when user logs in and has a role
      fetchRoleDetails(user.role, token)
        .then(data => setRoleDetails(data))
        .catch(error => console.log(error));
    }
  }, [isAuthenticated, token, user]);

  return (
    <div>
      <NavigationBar />
      
      <Routes>
      <Route exact path="/" element={
          <>
            <HomeView />
            {isAuthenticated && <Scanner roleDetails={roleDetails}/>}
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;