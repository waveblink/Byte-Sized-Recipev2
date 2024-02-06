// Album.js
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppBarComponent from './AppBar';
import HeroUnit from './Hero';
import PhotoCards from './Photo';
import Footer from './Footer';

const defaultTheme = createTheme();
const cards = [1, 2, 3];

export default function Album() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBarComponent />
      <main>
        <HeroUnit />
        <PhotoCards cards={cards}/>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
