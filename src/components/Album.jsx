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
import WhoWeAreSection from './WhoWeAreSection.jsx';
import { Link } from 'react-router-dom';
import CarouselComponent from './CarouselComponent.jsx';
import axios from 'axios';


const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722', // Example primary color
    },
    secondary: {
      main: '#4CAF50', // Example secondary color
    },
  },
  typography: {
    fontFamily: 'Quicksand, Arial, sans-serif',
    h1: {
      fontFamily: 'Quicksand, serif',
      fontWeight: 700, // Make sure you have the correct weight imported
    },
    body1: {
      fontFamily: 'Quicksand, sans-serif',
    },
  },
});

// const WhoWeAreSection = () => (
//   <Grid item xs={12} sm={8} md={6}>
//     <Typography variant="h4" gutterBottom>
//       Who We Are
//     </Typography>
//     <Typography variant="body1">
//       At Byte-Sized Recipes, we're passionate about the intersection of technology and culinary arts. Our platform leverages AI to create, review, and share innovative recipes with a vibrant community of food lovers. Dive into a new world of flavors with recipes crafted by AI and refined by connoisseurs like you.
//     </Typography>
//   </Grid>
// );

export default function Album() {

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/recipes/latest');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      }
    };
  
    fetchLatestRecipes();
  }, []);
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={8} md={6}> {/* Adjusted for centering */}
          <Typography variant='h1'>
            Byte-Sized Recipes
          </Typography> 
        </Grid>
        </Grid>
      {/* Container for the carousel */}
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={8} md={6}> {/* Adjusted for centering */}
          <CarouselComponent />
        </Grid>
      </Grid>
      <WhoWeAreSection /> 
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