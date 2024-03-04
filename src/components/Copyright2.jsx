// Copyright.js
import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Copyright2() {
    console.log("Rendering Copyright component");
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
                Byte-Sized Recipes 
                {' '}
            
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
