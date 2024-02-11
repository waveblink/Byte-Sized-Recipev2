import express from 'express';
import { query } from '../db/db.js'; // Adjust the path as necessary

const router = express.Router();

// Define a route for submitting recipes
router.post('/submit-recipe', async (req, res) => {
    const { name, cuisine, mealType, ingredients, instructions, rating } = req.body;

    try {
        const cuisineResult = await query('SELECT id FROM cuisines WHERE name = $1', [cuisine]);
        const cuisineId = cuisineResult.rows[0]?.id;

        if (!cuisineId) {
            return res.status(400).json({ error: "Cuisine not found" });
        }

        const result = await query(
            'INSERT INTO recipes (name, cuisine_id, meal_type, ingredients, instructions, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, cuisineId, mealType, ingredients, instructions, rating]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting recipe:', err);
        // Consider more detailed error handling here
        res.status(500).json({ message: 'An error occurred while inserting the recipe.' });
    }
});
// Export the router
export default router;