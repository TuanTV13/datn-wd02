import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import './App.css'
import AuthContainer from './components/auth/AuthContainer';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthContainer />} />
        {/* Add more routes here as needed */}
        <Route path="/auth2" element={<Auth />} />

      </Routes>
    </Router>
  );
};

export default App;
