// Album.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps } from '@mui/material';
import AppBarComponent from './AppBar';
import PhotoCards from './Hero'; // Correct import
import Cards from './Photo';
import Footer from './Footer';

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
      <AppBarComponent />
      <main>
        {/* Pass cardsData as a prop to the first PhotoCards component */}
        <PhotoCards cards={cardsData} />

        <main>
          {/* Pass cardsData as a prop to the second PhotoCards component */}

        </main>

      </main>
      <Footer />
    </ThemeProvider>
  );
}
