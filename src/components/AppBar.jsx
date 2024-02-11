// AppBarComponent.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import CameraIcon from '@mui/icons-material/PhotoCamera';

export default function AppBarComponent() {
  return (
    <AppBar position="relative" sx={{ pb: 4 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="open drawer">
          <CameraIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" noWrap>
          Album layout
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
