    import React from 'react';
    import { AppBar, Toolbar, IconButton, Typography, Button, createTheme, ThemeProvider } from '@mui/material';
    import MenuIcon from '@mui/icons-material/Menu';
    import { Link } from 'react-router-dom';
    import HomeIcon from '@mui/icons-material/Home';
    import { useUser } from './UserContext.jsx';
    import { useNavigate } from 'react-router-dom';
    import { useState } from 'react';




        


    const Navbar = () => {
        const { user, setUser } = useUser();
        console.log('User in Navbar:', user);
        const navigate = useNavigate();
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');



    
        const logOut = async () => {
            setLoading(true);
            setError('');

            try {
              const response = await fetch('http://localhost:4000/api/logout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },

              });
              if (response.ok) {
                console.log('Logout successful:');
                setUser(null); // Adjust according to your actual user object structure
                navigate('/'); // Redirect to the homepage or dashboard
              } else {
                // Handle HTTP errors, such as 401 Unauthorized
                console.error('Failed to logout');
                alert('Failed to logout.');
              }
            } catch (error) {
              console.error('Error logging out:', error);
              setError('An error occurred. Please try again.');
              alert('Error logging out. Please try again later.');
            } finally {
                setLoading(false);
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
              
            typography: {
              fontFamily: [
                'Roboto',
                'Playfair Display',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
              ].join(','),
              h1: {
                fontFamily: 'Playfair Display, serif',
              },
              body1: {
                fontFamily: 'Roboto, sans-serif',
              },
            },
          }
          });
          
    return (
<ThemeProvider theme={theme}>
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
            {user ? (
                
                <>
                    <Button color = "inherit">{user.firstname}</Button>
                    <Button color="inherit"
                    onClick={logOut}>Logout</Button>
                </>
                ) : (
                    <>
            <Button component={Link} to="/login" variant="contained">Login</Button>
            <Button component={Link} to="/register" variant="contained">Register</Button>
            </>
                )}
            <Button component={Link} to="/cookbook" variant="contained">Cookbook</Button>
            <Button component={Link} to="/generate" variant="contained">Generate</Button>
            <Button component={Link} to="/chatbot" variant="contained">ChatBot</Button>

        </Toolbar>
        </AppBar>
        </ThemeProvider>
        
    );
   
    
    }
    export default Navbar;
    
