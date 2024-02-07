import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

export default function Cards({ imageUrl }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt="Card image"
      />
      <CardActions>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained">View</Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
