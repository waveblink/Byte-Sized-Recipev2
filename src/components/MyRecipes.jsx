// Album.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps, Rating, Button, IconButton, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';


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


export default function MyRecipes() {

  const [recipes, setRecipes] = useState([]);
  const [sortCategory, setSortCategory] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([])
  const [isFetching, setIsFetching] = useState(false);
  const [noRecipesFound, setNoRecipesFound] = useState(false);
  
  
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsFetching(true);
      try {
        let url = 'http://localhost:4000/api/my-recipes';
        const response = await axios.get(url, { withCredentials: true });
        const data = response.data;

        if (data.length === 0) {
          setNoRecipesFound(true);
        } else {
          setRecipes(data);
          setNoRecipesFound(false);
        }
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      let url = `http://localhost:4000/api/my-recipes/${sortCategory === 'cuisine' ? 'cuisines' : 'mealTypes'}`;
      try {
        const response = await axios.get(url, { withCredentials: true });
        setOptions(response.data);
      } catch (error) {
        console.error(`Error fetching options for ${sortCategory}: `, error);
      }
    };

    if (sortCategory) {
      fetchOptions();
    } else {
      setOptions([]);
    }
  }, [sortCategory]);

  const handleSortCategoryChange = (event) => {
    setSortCategory(event.target.value);
    setSelectedOption('');
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:4000/api/my-recipes/${recipeId}`, { withCredentials: true });
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe: ', error);
      alert('An error occurred while deleting the recipe.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Typography variant='h2' color={'text.secondary'} textAlign={'center'}>Cookbook</Typography>
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="sort-category-select-label">Sort By</InputLabel>
        <Select
          labelId="sort-category-select-label"
          id="sort-category-select"
          value={sortCategory}
          label="Sort By"
          onChange={handleSortCategoryChange}
        >
          <MenuItem value="cuisine">Cuisine</MenuItem>
          <MenuItem value="mealType">Meal Type</MenuItem>
        </Select>
      </FormControl>
      
      {/* Dynamically generated Select component for sorting options */}
      {sortCategory && (
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id={`${sortCategory}-label`}>{sortCategory}</InputLabel>
          <Select
            labelId={`${sortCategory}-label`}
            id={sortCategory}
            value={selectedOption}
            onChange={handleOptionChange}
            label={sortCategory.charAt(0).toUpperCase() + sortCategory.slice(1)} // Capitalize the first letter
          >
            <MenuItem value="" disabled>
              Choose a {sortCategory}
            </MenuItem>
            {options.map((option, index) => (
              <MenuItem key={index} value={option.name}>{option.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
    <Grid container spacing={2} sx={{ mt: 4 }}>
  {isFetching && (
    <Grid item xs={12}>
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    </Grid>
  )}
  {noRecipesFound && !isFetching && (
    <Grid item xs={12}>
      <Typography variant="h6" color="text.secondary" textAlign="center">
        No recipes found for the selected cuisine. Please try a different one.
      </Typography>
    </Grid>
  )}
  {/* Recipe cards rendering */}
    {!noRecipesFound && recipes.map((recipe) => (
          <Grid alignContent={'center'} item xs={12} sm={6} md={4} key={recipe.id}>
          <Card sx={{ maxWidth: 345 }}>
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

