import express from 'express';
import { query } from '../db/db.js'; // Adjust the path as necessary

const router = express.Router();

// Define a route for submitting recipes
router.post('/submit-recipe', async (req, res) => {
    const { name, cuisine, mealType, ingredients, instructions, rating } = req.body;
    console.log(req.body);
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

router.get('/recipes/latest', async (req, res) =>{
    const limit = parseInt(req.query.limit) || 3;
    try {
        const result = await query(`SELECT recipes.*, cuisines.name AS cuisine_name FROM recipes
        JOIN cuisines ON recipes.cuisine_id = cuisines.id
        ORDER BY recipes.created_at DESC
        LIMIT $1`, [limit]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching latest recipes:', error);
    res.status(500).json({ message: 'An error occurred while fetching the latest recipes.' });
        
    }
})

router.delete('/recipes/:id', async (req,res) =>{
    const recipeId = req.params.id;

    try {
        const result = await query('DELETE FROM recipes WHERE id =$1 RETURNING *', [recipeId]);

        if (result.rows.length === 0){
            return res.status(404).json({message: "Recipe not found"});
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'An error occurred while deleting the recipe.' });
    }
});

router.get('/recipes', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const result = await query('SELECT recipes.*, cuisines.name AS cuisine_name FROM recipes JOIN cuisines ON recipes.cuisine_id = cuisines.id LIMIT $1 OFFSET $2',
        [limit, offset]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching recipe:', err);
        // Consider more detailed error handling here
        res.status(500).json({ message: 'An error occurred while fetching the recipe.' });
    }
});
// Export the router
export default router;