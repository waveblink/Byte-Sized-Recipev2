import express from 'express';
import { pool, query } from './db/db.js'; // Adjust the path as necessary
import { saveAIGeneratedRecipe } from './db/db.js';
import { linkRecipeToUser } from './db/db.js';
import authenticateToken from './middleware/authenticateToken.js';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';






const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json()); // Middleware to parse JSON bodies


const corsOptions = {
  origin: 'http://localhost:3000',  
  credentials: true, 
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Test route for fetching cuisines
app.post('/api/my-recipes/save', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const recipe = req.body.recipe;

    try {
        const recipeId = await saveAIGeneratedRecipe(recipe);
        await linkRecipeToUser(userId, recipeId);
        res.send('Recipe saved successfully');
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).send('Failed to save recipe');
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
