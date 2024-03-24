import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomeView from './views/home_view';
import NavigationBar from './components/Navbar_comp';
import AuthProvider from './components/Auth_comp';


function App() {
  return (
    <AuthProvider>
      <div>
        <NavigationBar />
        <Routes>
          <Route exact path="/" element={<HomeView />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
