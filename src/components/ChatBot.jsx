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
    // Assuming you have a user's authentication token stored, for example, in localStorage
    const token = Cookies.get('token');
    try {
      const response = await axios.post('http://localhost:4000/api/my-recipes/save', { recipe }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true // This should be part of the same object as headers
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