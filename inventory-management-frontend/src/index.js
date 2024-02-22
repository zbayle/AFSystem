import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RegistrationPage from './components/RegistrationForm'; // Import the component for the registration page
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="*" element={<App />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
