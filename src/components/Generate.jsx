// Album.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps } from '@mui/material';
import AppBarComponent from './AppBar';
import PhotoCards from './Hero'; // Correct import
import Cards from './Photo';
import Footer from './Footer';
import Navbar from './Navbar';

const defaultTheme = createTheme();

export default function Generate() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Pass cardsData as a prop to the first PhotoCards component */}
        <h1>Testing</h1>
        <main>
          {/* Pass cardsData as a prop to the second PhotoCards component */}

        </main>

      </main>

    </ThemeProvider>
  );
}
