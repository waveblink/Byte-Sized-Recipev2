import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container'; // Make sure to import Container
import Grid from '@mui/material/Grid'; // Make sure to import Grid
import Card from '@mui/material/Card'; // Make sure to import Card
import CardActions from '@mui/material/CardActions'; // Make sure to import CardActions
import CardContent from '@mui/material/CardContent'; // Make sure to import CardContent
import CardMedia from '@mui/material/CardMedia'; // Make sure to import CardMedia
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'; // Make sure to import Button
import Stack from '@mui/material/Stack'; // Make sure to import Stack

export default function Cards({ props }){
return(
<Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
            {props.title}
            </Typography>
            
                  {/* After form creation is made, have it route back to this. Use mapping or ..prevValue */}
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              {props.description}
            </Typography> 
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">view</Button>
              

            </Stack>
          </Container>
        </Box>
)
}