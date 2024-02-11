// Album.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps } from '@mui/material';
import AppBarComponent from './AppBar.jsx';
import PhotoCards from './Hero.jsx'; // Correct import
import Cards from './Photo.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

const defaultTheme = createTheme();

export default function Album() {
  
  const cardsData = [
    { id: 1, title: "Card 1", description: "Description for Card 1" },
    { id: 2, title: "Card 2", description: "Description for Card 2" },
    { id: 3, title: "Card 3", description: "Description for Card 3" }
];

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      
      <main>
        {/* Pass cardsData as a prop to the first PhotoCards component */}
        <PhotoCards cards={cardsData} />

        <main>
          {/* Pass cardsData as a prop to the second PhotoCards component */}

        </main>

      </main>

    </ThemeProvider>
  );
}
