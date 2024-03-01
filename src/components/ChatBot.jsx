import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper,ThemeProvider, createTheme, ButtonGroup } from '@mui/material';
import axios from 'axios'; // Ensure you have axios installed
import CircularProgress from '@mui/material/CircularProgress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Cookies from 'js-cookie';



export default function ChatBot() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [loading, setLoading] = React.useState(false);
  const [isBoxVisible, setIsBoxVisible] = useState(false);



  const handleSaveRecipe = async (recipe) => {
    const token = Cookies.get('token');
    try {
        console.log('Recipe to save:', recipe);
        const response = await axios.post('http://localhost:4000/api/my-recipes/save', { recipe }, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });

        if (response.status === 200) {
            alert('Recipe saved successfully!');
        } else {
            alert('Failed to save recipe.');
        }
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('An error occurred while saving the recipe.');
    }
};


// const recipeData = {
//   name: "Ratatouille",
//   ingredients: `- 400g eggplant, cut into slices
//   - 400g zucchini, sliced
//   - 400g bell peppers (mix of colors), chopped
//   - 400g ripe tomatoes, chopped
//   - 200g onion, finely chopped
//   - 3 cloves of garlic, minced
//   - 60ml olive oil
//   - 5g fresh thyme
//   - 5g fresh basil, chopped
//   - Salt and pepper to taste`,
//   instructions: `
//   1. **Preparation of Vegetables:** Begin by preparing your vegetables. Wash all the produce. Slice the eggplant and zucchini into rounds, chop the bell peppers and tomatoes, finely chop the onion, and mince the garlic.
//   2. **Sautéing Vegetables:** In a large skillet or Dutch oven, heat half of the olive oil over medium heat. Add the eggplant and zucchini in batches, seasoning with salt and pepper. Sauté until they start to become tender and golden. Set aside.
//   3. **Cooking the Aromatic Base:** Using the same skillet, add the remaining olive oil. Sauté the onions and bell peppers until they start to soften. Add the garlic and cook for another minute until fragrant.
//   4. **Combining the Ratatouille:** Add the chopped tomatoes and sautéed eggplant and zucchini back into the skillet along with thyme. Stir gently to combine.
//   5. **Simmering:** Cover and let the ratatouille simmer on low heat for about 30 minutes. Stir occasionally to prevent sticking. The vegetables should be tender and the flavors well blended.
//   6. **Finishing Touches:** Check for seasoning and adjust with salt and pepper as needed. Stir in the fresh basil just before serving.`,
//   cuisineId: 6,
//   mealTypeId: 3,
//   nutritionFacts:`**Macronutrient Breakdown:**

//   - **Calories:** Approximately 120 calories per 100g serving
//   - **Protein:** 2g
//   - **Carbs:** 14g
//   - **Fats:** 7g`
//   // other expected properties
// };

// handleSaveRecipe(recipeData);

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
  
  
  
  const handleCuisineChange = (cuisine) => {
    setSelectedCuisine(cuisine);
    setIsBoxVisible(true);
    setQuery('');
    setResponses([]);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!query.trim()) {
//         console.log("Query is empty");
//         // Optionally, inform the user or simply return to avoid making an API call
//         return;
//     }
//     // Proceed with making the API call
// };
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Asking the chatbot...");
  setLoading(true); // Enable loading indicator
  try {
    const response = await axios.post('http://localhost:4000/api/chatbot', { query, cuisine: selectedCuisine });
    if (response.data.reply) {
      setResponses([...responses, { query, response: response.data.reply }]);
      setQuery(''); // Reset query input
    } else {
      console.error('No choices found in response:', response.data);
    }
  } catch (error) {
    console.error('Error fetching response:', error);
  } finally {
    setLoading(false); // Disable loading indicator after fetching response
  }
};

const getRandomCuisine = () => {
  const cuisines = ['Italian','American','English','Chinese','Japanese','French','Mexican'];
  const randomIndex = Math.floor(Math.random() * cuisines.length);
  return cuisines[randomIndex];
}

return (
  <>
    <ThemeProvider theme={theme}>
  <Box sx={{ maxWidth: 800, margin: 'auto', textAlign: 'center' }}>
<Typography variant="h4" sx={{ my: 2 }}>
  What Cuisine Would You Like a Recipe From?
  </Typography>
  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
  <ButtonGroup>
  <Button onClick={()=> handleCuisineChange('Italian')} sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Italian</Button> 
  <Button onClick={()=> handleCuisineChange('American')} sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>American</Button> 
  <Button onClick={()=> handleCuisineChange('English')} sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>English</Button>
  <Button onClick={()=> handleCuisineChange('Chinese')} sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Chinese</Button> 
  <Button onClick={()=> handleCuisineChange('Japanese')} sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Japanese</Button> 
  <Button onClick={()=> handleCuisineChange('French')} sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>French</Button> 
  <Button onClick={()=> handleCuisineChange('Mexican')} sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Mexican</Button> 
  <Button onClick={() => handleCuisineChange(getRandomCuisine())} sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Surprise Me!</Button>
  </ButtonGroup>
  </Box>
        {isBoxVisible && (
  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <TextField
      fullWidth
      label={`Ask me anything about ${selectedCuisine} cuisine!`}
      value={query}
      onChange={handleQueryChange}
      variant="outlined"
      sx={{ mr: 1 }}
    />
    <Button variant="contained" color="primary" type="submit">Ask</Button>
  </Box>
)}
{loading && (
  <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
    <CircularProgress />
  </Box>
)}

        <Box sx={{ maxHeight: 800, overflowY: 'auto' }}>
        {responses.map((entry, index) => (
          <Paper key={index} sx={{ p: 2, mb: 1, textAlign: 'left' }}>
          <Typography><strong>You:</strong> {entry.query}</Typography>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {entry.response}
          </ReactMarkdown>
          <Button
            variant='contained'
            color='primary'
            onClick={()=> handleSaveRecipe(entry.response)}
          sx={{ mt: 2 }}>
            Save Recipe
          </Button>
         </Paper>
          ))}
          

        </Box>
      </Box>
      </ThemeProvider>
    </>
  );
}