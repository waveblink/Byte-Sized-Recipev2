import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, TextField, Button, Typography, Box , InputLabel, Select, MenuItem, FormControl, Rating} from '@mui/material';
import Footer from './Footer';
import HoverRating from './Hover';
// import theme from '../theme.js'


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

export default function Generate() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    mealType: "",
    ingredients: "",
    instructions: "",
    nutritionFacts: "",
    rating: 0,
  });
  
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/api/submit-recipe', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const responseBody = await response.json();
        console.log(responseBody);
        alert('Recipe submitted Successfully!');
        
        // Reset the form data here, within the scope of `handleSubmit` and after a successful response
        setFormData({
          name: "",
          cuisine: "",
          mealType: "",
          ingredients: "",
          instructions: "",
          nutritionFacts: "",
          rating: 0,
          // Make sure to reset the rating as well, if it's part of formData
        });
      } else {
        alert('Failed to submit recipe.');
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Error submitting recipe.');
    }
  };


  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
 
  }
  
//Change 
  return(
  <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="h5" textAlign="center">
            Your Recipe
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
                <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="cuisine-label">Cuisine</InputLabel>
              <Select
                labelId="cuisine-label"
                id="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                label="Cuisine" // This ensures the label moves correctly
              >

                <MenuItem value="" disabled>
            Cuisine
            </MenuItem>
            <MenuItem value={"Italian"}>Italian</MenuItem>
            <MenuItem value={"American"}>American</MenuItem>
            <MenuItem value={"English"}>English</MenuItem>
            <MenuItem value={"Chinese"}>Chinese</MenuItem>
            <MenuItem value={"Japanese"}>Japanese</MenuItem>
            <MenuItem value={"French"}>French</MenuItem>
            <MenuItem value={"Mexican"}>Mexican</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="mealType-label">Meal Type</InputLabel>
              <Select
                labelId="mealType-label"
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                label="mealType" // This ensures the label moves correctly
              >

                <MenuItem value="" disabled>
            Cuisine
            </MenuItem>
            <MenuItem value={"Breakfast"}>Breakfast</MenuItem>
            <MenuItem value={"Lunch"}>Lunch</MenuItem>
            <MenuItem value={"Dinner"}>Dinner</MenuItem>
            <MenuItem value={"Snack"}>Snack</MenuItem>
            <MenuItem value={"Bread"}>Bread</MenuItem>
            <MenuItem value={"Dessert"}>Dessert</MenuItem>
            <MenuItem value={"Pastry"}>Pastry</MenuItem>
            <MenuItem value={"Other"}>Other</MenuItem>
          </Select>
          </FormControl>
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="ingredients"
            label="Ingredients"
            multiline
            rows={4}
            value={formData.ingredients}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="instructions"
            label="Instructions"
            multiline
            rows={4}
            value={formData.instructions}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            name="nutritionFacts"
            label="Nutrition Facts"
            rows={4}
            value={formData.nutritionFacts}
            onChange={handleChange}
          />
        <Rating
        name="simple-controlled"
        value={formData.rating}
        onChange={(event, newValue) => {
          setFormData({ ...formData, rating: newValue });
  }}
/>      
          <Button
          
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          
        </form>
      </Container>
      </Box>
    </ThemeProvider>
  );
}
