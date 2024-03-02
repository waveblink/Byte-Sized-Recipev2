import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, createTheme, CssBaseline, Typography, Box, Grid, 
  Card, CardHeader, CardMedia, CardContent, Button, IconButton, CircularProgress 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: { main: '#FF5722' },
    secondary: { main: '#4CAF50' },
  },
  typography: {
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
  },
});

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/my-recipes', { withCredentials: true });
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to fetch recipes');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRecipes();
  }, []);
  

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`/api/my-recipes/${recipeId}`, { withCredentials: true });
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant="h4" align="center" gutterBottom>
        My Recipes
      </Typography>
      <Grid container spacing={2}>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          recipes.map(recipe => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card>
                <CardHeader title={recipe.name} subheader={`Cuisine: ${recipe.cuisine}`} />
                <CardMedia image="/placeholder.jpg" title="Recipe Image" />
                <CardContent>
                  <Button size="small" color="primary">
                    View
                  </Button>
                  <IconButton size="small" onClick={() => deleteRecipe(recipe.id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </ThemeProvider>
  );
}
