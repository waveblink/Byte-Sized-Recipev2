import cors from 'cors';
import express from "express";
import path from "path";
import dotenv from "dotenv";
import recipeRoutes from './routes/recipeRoutes.js'; // Ensure this path is correct
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse JSON bodies. This should come before your routes.
app.use(express.json());

// CORS middleware should also be setup early, before your routes.
app.use(cors());

// Middleware for logging incoming requests. It's good to have this early too, so every request gets logged.
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Use the recipe routes for anything under '/api'
app.use('/api', recipeRoutes);

// A simple test route can be kept here after the essential middleware
app.post('/api/test', (req, res) => {
  res.send('Test route is working');
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all remaining routes to support SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
