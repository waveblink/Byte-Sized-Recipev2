import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useThemeProps, Grid, Card, CardContent, Typography, Rating, Button, IconButton, CardMedia, CardHeader, Paper } from '@mui/material';



export default function WhoWeAreSection() {
    return(
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 4, mb: 4 }}>
        <Grid item xs={12} sm={10} md={8}> {/* Adjusted for a slightly larger width */}
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant='h4' gutterBottom>
              Who We Are
            </Typography>
            <Typography variant='body1' paragraph>
              Byte-Sized Recipes is a platform dedicated to the innovative world of AI-created recipes. Our mission is to revolutionize the culinary experience by introducing recipes crafted through sophisticated algorithms that understand flavor profiles, nutrition, and culinary techniques.
            </Typography>
            <Typography variant='body1' paragraph>
              We are a community of food lovers, tech enthusiasts, and culinary experts who believe in the power of technology to enhance our cooking and eating habits. Join us in exploring new frontiers in gastronomy, reviewing unique recipes, and sharing them with others.
            </Typography>
            <Typography variant='body1' paragraph>
              Whether you're looking for inspiration for your next meal or want to dive into the future of cooking, Byte-Sized Recipes is your destination for the extraordinary.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
}