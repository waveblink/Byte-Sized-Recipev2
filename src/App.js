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
import RecipeView from './components/RecipeView.jsx';
import { UserProvider } from './components/UserContext.jsx';
import ValidateSession from './components/ValidateSession.jsx';
import NavBar2 from './components/NavBar2.jsx';
import MyRecipes from './components/MyRecipes.jsx';


function App() {


  return (
    <Router>
      <div className="App">
      <UserProvider>
      <ValidateSession />
      <NavBar2 />
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Album />} />
          <Route path="/cookbook" element={<Cookbook />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/recipe/:id" element={<RecipeView />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
        </Routes>
        <Footer />
        </UserProvider>
      </div>
    </Router>
  );
}

export default App;
