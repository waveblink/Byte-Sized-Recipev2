import express from 'express';
import { query, pool } from '../db/db.js'; // Adjust the path as necessary
import axios from "axios";
import authenticateToken from '../middleware/authenticateToken.js';
const router = express.Router();

// Define a route for submitting recipes
router.post('/submit-recipe', authenticateToken, async (req, res) => {
    const { name, cuisine, mealType, ingredients, instructions, rating } = req.body;
    const userId= req.user.id;
    console.log(req.body);
    try {
        const cuisineResult = await query('SELECT id FROM cuisines WHERE name = $1', [cuisine]);
        const cuisineId = cuisineResult.rows[0]?.id;

        if (!cuisineId) {
            return res.status(400).json({ error: "Cuisine not found" });
        }

        const result = await query(
            'INSERT INTO recipes (name, cuisine_id, meal_type, ingredients, instructions, rating, user_Id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, cuisineId, mealType, ingredients, instructions, rating, userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting recipe:', err);
        // Consider more detailed error handling here
        res.status(500).json({ message: 'An error occurred while inserting the recipe.' });
    }
});

router.get('/recipes/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM recipes WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching recipes by user:', error);
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
});


router.get('/recipes/latest', async (req, res) =>{
    const limit = parseInt(req.query.limit) || 3;
    try {
        const result = await query(`SELECT recipes.*, cuisines.name AS cuisine_name, users.username AS username FROM recipes
        JOIN cuisines ON recipes.cuisine_id = cuisines.id
        JOIN users ON recipes.user_id = users.id 
        ORDER BY recipes.created_at DESC
        LIMIT $1`, [limit]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching latest recipes:', error);
    res.status(500).json({ message: 'An error occurred while fetching the latest recipes.' });
        
    }
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

router.post('/chatbot', async (req, res) => {
    const userQuery = req.body.query;
    const cuisine = req.body.cuisine;
    console.log("Chatbot endpoint hit", req.body);

    const systemMessageContent = `You are a chatbot specialized in ${cuisine} cuisine. Method: Focus on [Ingredient details, Cooking techniques, Regional specialties] Structure: [Ingredient exploration] + [Technique refinement] + [Regional emphasis] + [Measurements in grams only] Goal: Elevate [Culinary knowledge], [Recipe authenticity] + [give the macronutrient breakdown, in the form of Calories: Protein: Carbs: Fats:].`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo-preview", // Adjust according to your subscription and the model's availability
            messages: [
                { role: "system", content: systemMessageContent },
                { role: "user", content: userQuery }
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        console.log("OpenAI response:", response.data);

        // Extracting the chatbot's response assuming the first choice's message contains the response
        // Check if the 'choices' array and 'message' object are structured as expected
        if (response.data.choices && response.data.choices.length > 0) {
            // Assuming 'message' object exists and has a 'content' property
            const botResponse = response.data.choices[0].message.content;
            console.log("Bot's response content:", botResponse);
            res.json({ reply: botResponse });
        } else {
            console.log("Unexpected response structure or no choices returned.");
            res.status(500).send("Chatbot response was not in the expected format.");
        }
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Failed to fetch response from OpenAI');
    }
});

router.get('/recipes/:id', async (req,res) =>{
    const recipeId = req.params.id;

    try {
        const result = await pool.query(`SELECT recipes.*, cuisines.name AS cuisine_name, users.username AS username 
        FROM recipes 
        JOIN cuisines ON recipes.cuisine_id = cuisines.id
        JOIN users ON recipes.user_id = users.id
        WHERE recipes.id = $1`, [recipeId]);

        if (result.rows.length === 0){
            return res.status(404).json({message: "Recipe not found"});
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error getting recipe:', error);
        res.status(500).json({ message: 'An error occurred while getting the recipe.' });
    }
});

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
        const result = await query(
    `SELECT recipes.*, 
           cuisines.name AS cuisine_name, 
           users.username AS username 
    FROM recipes 
    JOIN cuisines ON recipes.cuisine_id = cuisines.id 
    JOIN users ON recipes.user_id = users.id 
    ORDER BY recipes.created_at DESC 
    LIMIT $1 OFFSET $2`
, [limit, offset]);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching recipe:', err);
        // Consider more detailed error handling here
        res.status(500).json({ message: 'An error occurred while fetching the recipe.' });
    }
});

router.post('/recipes/:id/comments', authenticateToken, async (req, res) => {
    const recipeId = req.params.id; // Make sure this is correctly extracting the 'id'
    const userId = req.user.id;
    const { comment } = req.body;
    
    try {
        const result = await pool.query(
            `INSERT INTO comments (recipe_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *`,
            [recipeId, userId, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Failed to post comment' });
    }
});


router.get('/recipes/:id/comments', async (req, res) => {
    const {id: recipeId} = req.params;
    

    try {
        const result = await pool.query(
        `SELECT comments. *, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE recipe_id = $1 ORDER BY created_at DESC`,
        [recipeId]
);
res.json(result.rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
        
    }
})

router.delete('/recipes/:recipeId/comments/:commentId', authenticateToken, async (req, res) => {
    const { recipeId, commentId } = req.params;
    const userId = req.user.id; // Assuming you have a middleware to set req.user based on the authenticated user

    try {
        // Optional: Check if the comment belongs to the user attempting to delete it
        const ownershipResult = await pool.query('SELECT * FROM comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
        if (ownershipResult.rows.length === 0) {
            return res.status(403).json({ message: 'You do not have permission to delete this comment.' });
        }

        // Proceed to delete the comment
        const deleteResult = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [commentId]);
        
        if (deleteResult.rows.length > 0) {
            res.json({ message: 'Comment deleted successfully', deletedComment: deleteResult.rows[0] });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'An error occurred while deleting the comment.' });
    }
});

router.get('/recipes/sorted', async (req,res) => {
    const {sortBy} = req.query;

    let orderByColumn;
    switch (sortBy){
        case 'cuisine':
            orderByColumn = 'cuisines.name';
            break;
        case 'mealType': 
            orderByColumn = 'recipes.meal_type';
            break;
        default:
            orderByColumn = 'recipes.created_at';
            break;
    }
    try {
        const result = await query(`
            SELECT recipes.*, cuisines.name AS cuisine_name, users.username, AS username
            FROM recipes
            JOIN cuisines ON recipes.cuisine_id = cuisines.id
            JOIN users ON recipes.user_id = user.id
            ORDER BY ${orderByColumn} ASC
            `);
            res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sorted recipes:', error);
        res.status(500).json({ message: 'An error occurred while fetching sorted recipes.' });
    }
});


// Export the router
export default router;