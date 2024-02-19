// Album.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps, Rating, Button, IconButton } from '@mui/material';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AppBarComponent from './AppBar.jsx';
import PhotoCards from './Hero.jsx'; // Correct import
import Cards from './Photo.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';


const theme = createTheme({
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
});


export default function Cookbook() {

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      }
    };

    fetchRecipes();
  }, []);

  const deleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/recipes/${recipeId}`, {
        method: 'DELETE',

      });

      if (!response.ok) {
        throw new Error('Failed to delete the recipe. ');
      }

      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));

      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe: ', error);
      alert('An error occurred while deleting the recipe.');
      
    }
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant='h2' color={'text.secondary'} textAlign={'center'}>Cookbook</Typography>
      <Grid container spacing={2} sx={{ mt: 4 }}>
      
        {recipes.map((recipe) => ( 
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <Card alignContent={'center'} sx={{ maxWidth: 345 }}>
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
              to={`/recipe/${recipe.id}`} // Use template literals to dynamically set the URL
              endIcon={<DoubleArrowIcon />}>
                View
              </Button>
              <IconButton 
              onClick={()=> deleteRecipe(recipe.id)}
              aria-label="delete" size="large">
              <DeleteIcon fontSize="inherit" />
              </IconButton>
              
            </CardContent>
          </Card>

          </Grid>


        ))}
      </Grid>
    </ThemeProvider>
  );
}
