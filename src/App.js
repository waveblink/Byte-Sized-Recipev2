import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Album from './components/Album';
import Navbar from './components/Navbar'; // Assuming Navbar is meant to be global
import Cookbook from './components/Cookbook';
import Generate from './components/Generate';
import Footer from './components/Footer'; // Assuming Footer is meant to be global
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Album />} />
          <Route path="/cookbook" element={<Cookbook />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
