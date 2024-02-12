// Album.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps, Grid, Card, CardContent, Typography, Rating, Button, IconButton } from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AppBarComponent from './AppBar.jsx';
import PhotoCards from './Hero.jsx'; // Correct import
import Cards from './Photo.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

const defaultTheme = createTheme();

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
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {recipes.map((recipe) => ( 
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <Card>
            <CardContent>
              <Typography variant='h5' component='h2'>
                {recipe.name}
              </Typography>
              <Typography color='textSecondary'>
                Cuisine: {recipe.cuisine_name}
              </Typography>
              <Typography variant='body2' component='p'>
                Ingredients: {recipe.ingredients}
              </Typography>
              <Typography variant='body2' component='p'>
              <Rating name="read-only" value={parseFloat(recipe.rating)} readOnly />

              </Typography>
              <Button 
              variant="outlined" endIcon={<DoubleArrowIcon />}>
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
