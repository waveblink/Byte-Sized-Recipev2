import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, TextField, Button, Typography, Box , InputLabel, Select, MenuItem, FormControl} from '@mui/material';
import Footer from './Footer';
import HoverRating from './Hover';

export default function Generate() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    mealType: "",
    ingredients: "",
    instructions: ""
  });
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Name: ${formData.name}, Cuisine: ${formData.cuisine}, Meal Type: ${formData.mealType}, Ingredients: ${formData.ingredients}, Instructions: ${formData.instructions}`);
  };

  const defaultTheme = createTheme();
//Change 
  return(
  <ThemeProvider theme={defaultTheme}>
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

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="mealType"
            label="Meal Type"
            type="text"
            id="mealType"
            autoComplete="meal-type"
            value={formData.mealType}
            onChange={handleChange}
          />
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
          <HoverRating />
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
