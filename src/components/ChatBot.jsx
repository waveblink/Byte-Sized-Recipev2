import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import axios from 'axios'; // Ensure you have axios installed

export default function ChatBot() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);

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
        const response = await axios.post('http://localhost:4000/api/chatbot', { query, cuisine: 'Italian' }); // Fixed: added await
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

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
  <Typography variant="h4" sx={{ my: 2 }}>
    Cuisine ChatBot
  </Typography>
  <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <TextField
      fullWidth
      label="Ask me anything about Italian cuisine!"
      value={query}
      onChange={handleQueryChange}
      variant="outlined"
      sx={{ mr: 1 }}
    />
    <Button variant="contained" color="primary" type="submit">
      Ask
    </Button>
  </Box>
  <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
    {responses.map((entry, index) => (
      <Paper key={index} sx={{ p: 2, mb: 1 }}>
        <Typography><strong>You:</strong> {entry.query}</Typography>
        <Typography><strong>Bot:</strong> {entry.response}</Typography>
      </Paper>
    ))}
  </Box>
</Box>
  );
}
