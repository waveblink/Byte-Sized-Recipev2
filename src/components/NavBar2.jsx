import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, ThemeProvider, createTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import { useUser } from './UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function NavBar2() {

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

  const { user, setUser } = useUser();
        console.log('User in Navbar:', user);
        const navigate = useNavigate();
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');



    
        

const logOut = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await axios.post('http://localhost:4000/api/logout', {}, { withCredentials: true });
    console.log('Logout successful:', response.data);
    setUser(null); // Adjust according to your actual user object structure
    navigate('/'); // Redirect to the homepage or dashboard
  } catch (error) {
    console.error('Failed to logout:', error.response?.data?.message || 'Error logging out');
    setError('An error occurred. Please try again.');
    alert('Error logging out. Please try again later.');
  } finally {
    setLoading(false);
  }
};


  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'orange', borderBottom: 3, borderColor: 'orange' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BakeryDiningIcon fontSize='large' sx={{ marginRight: 1 }} />
            <Typography variant="h6" sx={{ fontFamily: 'Quicksand, sans-serif', flexGrow: 0, color: 'orange' }}>
              Byte-sized Recipes
            </Typography>
          </Box>
          <Box sx={{ marginLeft: 'auto' }}> {/* This Box will push all the buttons to the right */}
          <Button component={Link} to="/" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Home
          </Button>
            {user ? (
                
                <>
                    <Button component={Link} to="/my-recipes" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>{user.username}</Button>
                    <Button sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    onClick={logOut}>Logout</Button>
                </>
                ) : (
                    <>
            <Button component={Link} to="/login" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }}}>Login</Button>
            <Button component={Link} to="/register" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' }
            }}>Register</Button>
            </>
                )}
          {/* <Button component={Link} to="/login" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Login
          </Button>
          <Button component={Link} to="/register" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Register
          </Button> */}
          <Button component={Link} to="/cookbook" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Cookbook
          </Button>
          <Button component={Link} to="/chatbot" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            AIChef
          </Button>
          <Button component={Link} to="/generate" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            New Recipe
          </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    </ThemeProvider>
  );
}
