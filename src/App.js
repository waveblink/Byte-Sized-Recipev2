import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Album from './components/Album.jsx';
import Navbar from './components/Navbar.jsx'; 
import Cookbook from './components/Cookbook.jsx';
import Generate from './components/Generate.jsx';
import Footer from './components/Footer.jsx'; 
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import ChatBot from './components/ChatBot.jsx';
import { UserProvider } from './components/UserContext.jsx';


function App() {


  useEffect(() => {
    async function validateSession() {
      try {
        const response = await fetch('http://localhost:4000/api/validate', {
          method: 'GET',
          credentials: 'include', 
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    validateSession(); 
  }, []);

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
        </Routes>
        <Footer />
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
