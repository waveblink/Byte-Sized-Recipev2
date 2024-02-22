// Album.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps, Grid, Card, CardContent, Typography, Rating, Button, IconButton, CardMedia, CardHeader } from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AppBarComponent from './AppBar.jsx';
import PhotoCards from './Hero.jsx'; // Correct import
import Cards from './Photo.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import { Link } from 'react-router-dom';
import CarouselComponent from './CarouselComponent.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722', // Example primary color
    },
    secondary: {
      main: '#4CAF50', // Example secondary color
    },
    
  typography: {
    fontFamily: [
      'Roboto',
      'Playfair Display',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Playfair Display, serif',
    },
    body1: {
      fontFamily: 'Roboto, sans-serif',
    },
  },
}
});

export default function Album() {

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/recipes/latest');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      }
    };

    fetchLatestRecipes();
  }, []);
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Container for the carousel */}
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={8} md={6}> {/* Adjusted for centering */}
          <CarouselComponent />
        </Grid>
      </Grid>
      {/* Container for the recipe cards */}
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={8} md={6} key={recipe.id}> {/* Adjusted for centering */}
            <Card sx={{ maxWidth: 345, margin: 'auto' }}> {/* Center the card */}
              <CardHeader
                title={recipe.name}
                subheader={recipe.cuisine_name}
              />
              <CardMedia
                component="img"
                height="194"
                image="/croissant.jpg" 
                alt={recipe.name}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                </Typography>
                <Typography variant='body2' component='p'>
                  <Rating name="read-only" value={parseFloat(recipe.rating)} readOnly />
                </Typography>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to={`/recipe/${recipe.id}`}
                  endIcon={<DoubleArrowIcon />}>
                    View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
}