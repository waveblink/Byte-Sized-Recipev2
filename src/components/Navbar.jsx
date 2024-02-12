    import React from 'react';
    import { AppBar, Toolbar, IconButton, Typography, Button, createTheme, ThemeProvider } from '@mui/material';
    import MenuIcon from '@mui/icons-material/Menu';
    import { Link } from 'react-router-dom';
    import HomeIcon from '@mui/icons-material/Home';

        


    export default function Navbar() {
    return (

        <AppBar position="static">
        <Toolbar>
            <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            component={Link}
             to="/"
            sx={{ mr: 2 }}
            >
            <HomeIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Byte-Sized Recipes
            </Typography>
            <Button component={Link} to="/login" variant="contained">Login</Button>
            <Button component={Link} to="/cookbook" variant="contained">Cookbook</Button>
            <Button component={Link} to="/generate" variant="contained">Generate</Button>
            <Button component={Link} to="/register" variant="contained">Register</Button>
            <Button component={Link} to="/chatbot" variant="contained">ChatBot</Button>

        </Toolbar>
        </AppBar>
    );
    }