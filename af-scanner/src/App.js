import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomeView from './views/home_view';
import AdminDashboard from './components/admin/AdminDashboard_comp';
import NavigationBar from './components/Navbar_comp';
import Scanner from './components/Scanner_comp';
import AuthProvider, { AuthContext } from './components/Auth_comp';
import { fetchRoleDetails } from './services/perms_api';

function App() {

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, token, user } = useContext(AuthContext);
  const [roleDetails, setRoleDetails] = useState(null);


  function AdminRoute() {
    return (
      <>
        <AdminDashboard />
      </>
    );
  }

  function HomeRoute() {
    return (
      <>
        <HomeView />
        {isAuthenticated && <Scanner roleDetails={roleDetails}/>}
      </>
    );
  }


  useEffect(() => {
    if (isAuthenticated && user && user.role && !roleDetails) {
      fetchRoleDetails(user.role, token)
        .then(data => setRoleDetails(data))
        .catch(error => console.log(error));
    }
  }, [isAuthenticated, token, user, roleDetails]);

  return (
    <div>
      <NavigationBar />
      
      <Routes>
        <Route exact path="/" element={<HomeRoute />} />
        <Route path="/admin" element={<AdminRoute roleDetails={roleDetails} />
        } />
      </Routes>
    </div>
  );
}

export default App;