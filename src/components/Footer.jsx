// Footer.js
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from './Copyright'; // Adjust the import path based on your project structure

export default function Footer() {
    return (
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
                Footer
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
                Something here to give the footer a purpose!
            </Typography>
            <Copyright />
        </Box>
    );
}
