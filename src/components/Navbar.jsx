import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Byte-Sized Recipes
        </Typography>
        <Button variant="contained">Login</Button>
        <Button variant="contained">Cookbook</Button>
        <Button variant="contained">Generate</Button>
        <Button variant="contained">Register</Button>

      </Toolbar>
    </AppBar>
  );
}