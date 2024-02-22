import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';

export default function NavBar2() {
  return (
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
          <Button component={Link} to="/login" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Login
          </Button>
          <Button component={Link} to="/register" sx={{ color: 'orange', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Register
          </Button>
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
  );
}
