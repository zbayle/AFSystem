import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth_comp'; // Import AuthContext
import HomeView from '../../views/home_view';

function AdminDashboard() {
  const { isAuthenticated, user } = useContext(AuthContext); // Access isAuthenticated and user from AuthContext

  
  return (
    console.log("Admin dash board")
  );
}

export default AdminDashboard;