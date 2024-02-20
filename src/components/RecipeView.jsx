import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps, Grid, Card, CardContent, Typography, Rating, Button, IconButton, CardHeader, GlobalStyles } from '@mui/material';
import { useParams } from 'react-router-dom';
import CommentsSection from './CommentsSection';


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
    allVariants: {
      fontFamily: 'Playfair Display, serif',
    },
  },
});


function RecipeView(){
    const { id: recipeId } = useParams();
    const {id} = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() =>{
        const fetchRecipe = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/recipes/${id}`);
            const data = await response.json();
            setRecipe(data);
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
    };

    fetchRecipe();
},[id]);

if (!recipe){
    return <div>Loading...</div>;
}

const listItemStyle = { fontFamily: 'Roboto, sans-serif', textAlign: 'left' };

const ingredientsList = recipe.ingredients.split('\n').filter(line => line.trim() !== '');
const instructionsList = recipe.instructions.split('\n').filter(line => line.trim() !== '');

return (
  <ThemeProvider theme={theme}>
      <CssBaseline />
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} md={8} lg={6}>
        <Card>
          <CardHeader title={recipe.name} subheader={`Cuisine: ${recipe.cuisine_name}`} />
          <CardContent sx={{ textAlign: 'left' }}>
            <Typography variant="h6" component="h2" gutterBottom align="center">
              Ingredients
            </Typography>
            <ul>
              {ingredientsList.map((ingredient, index) => (
                <Typography component ="li" style={listItemStyle} key={index} align="left">{ingredient}</Typography>
              ))}
            </ul>
            <Typography variant="h6" component="h2" gutterBottom align="center">
              Instructions
            </Typography>
            <ol>
              {instructionsList.map((instruction, index) => (
                <Typography component="li" style={listItemStyle} key={index} align="left">{instruction}</Typography>
              ))}
            </ol>
            <Typography variant="h6" component="h2" gutterBottom align="center">
              Meal Type: {recipe.meal_type_name}
            </Typography>
            <Typography align="left"><Rating name="read-only" value={parseFloat(recipe.rating)} readOnly />
</Typography>
            {recipe.username && (
              <Typography align="left">Submitted by: {recipe.username}</Typography>
            )}
          </CardContent>
        </Card>
        <CommentsSection recipeId={recipeId}/>
      </Grid>
    </Grid>
  </ThemeProvider>
);
}

export default RecipeView;