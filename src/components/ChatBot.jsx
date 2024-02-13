import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import axios from 'axios'; // Ensure you have axios installed

export default function ChatBot() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  
  
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
    console.log("Has been clicked");
    try {
        const response = await axios.post('http://localhost:4000/api/chatbot', { query, cuisine: selectedCuisine }); // Fixed: added await
        if (response.data.reply) {
          setResponses([...responses, { query, response: response.data.reply}]);

        } else {
            console.error('No choices found in response:', response.data);
        }
        setQuery(''); // Reset query input
    } catch (error) {
        console.error('Error fetching response:', error);
    }
};

const getRandomCuisine = () => {
  const cuisines = ['Italian','American','English','Chinese','Japanese','French','Mexican'];
  const randomIndex = Math.floor(Math.random() * cuisines.length);
  return cuisines[randomIndex];
}

  return (
    <>
    <Box sx={{ maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
  <Typography variant="h4" sx={{ my: 2 }}>
    What Cuisine Would You Like a Recipe From?
    <Button onClick={()=> handleCuisineChange('Italian')} variant="contained" color="primary">Italian</Button> 
    <Button onClick={()=> handleCuisineChange('American')} variant="contained" color="primary">American</Button> 
    <Button onClick={()=> handleCuisineChange('English')} variant="contained" color="primary">English</Button>
    <Button onClick={()=> handleCuisineChange('Chinese')} variant="contained" color="primary">Chinese</Button> 
    <Button onClick={()=> handleCuisineChange('Japanese')} variant="contained" color="primary">Japanese</Button> 
    <Button onClick={()=> handleCuisineChange('French')} variant="contained" color="primary">French</Button> 
    <Button onClick={()=> handleCuisineChange('Mexican')} variant="contained" color="primary">Mexican</Button> 
    <Button onClick={() => handleCuisineChange(getRandomCuisine())} variant="contained" color="primary">Surprise Me!</Button>
        </Typography>
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
        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {responses.map((entry, index) => (
            <Paper key={index} sx={{ p: 2, mb: 1 }}>
              <Typography><strong>You:</strong> {entry.query}</Typography>
              <Typography><strong>Bot:</strong> {entry.response}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}