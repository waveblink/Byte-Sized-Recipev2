import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Album from './components/Album.jsx';
import Navbar from './components/Navbar.jsx'; // Assuming Navbar is meant to be global
import Cookbook from './components/Cookbook.jsx';
import Generate from './components/Generate.jsx';
import Footer from './components/Footer.jsx'; // Assuming Footer is meant to be global
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import ChatBot from './components/ChatBot.jsx';
import { UserProvider } from './components/UserContext.jsx';


function App() {
  return (
    <Router>
      <div className="App">
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Album />} />
          <Route path="/cookbook" element={<Cookbook />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<ChatBot />} />

          {/* Add more routes as needed */}
        </Routes>
        <Footer />
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
