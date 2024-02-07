// Album.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps } from '@mui/material';
import AppBarComponent from './AppBar';
import HeroUnit from './Hero';
import Cards from './Photo';
import Footer from './Footer';


const defaultTheme = createTheme();


export default function Album() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBarComponent />
      <main>
        <HeroUnit />
        <Cards title="Testing card title" 
        description="Testing description"/>

        <Cards title="Testing card title" 
        description="Testing description"/>

         <Cards 
         title="Testing card title" 
         description="Testing description"
        />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
