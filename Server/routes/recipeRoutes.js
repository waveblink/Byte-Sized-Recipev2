import express from 'express';
import { query, pool } from '../db/db.js'; // Adjust the path as necessary
import axios from "axios";
import authenticateToken from '../middleware/authenticateToken.js';
const router = express.Router();


router.get('/api/recipes/cuisines', async (req, res) => {
    console.log('Fetching all cuisines...');
    try {
        // Query to select all cuisines from the cuisines table
        const result = await pool.query('SELECT name FROM cuisines ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting all cuisines:', error);
        res.status(500).send('Server error');
    }
});

// router.get('/api/recipes/mealTypes', async (req, res) => {
//     console.log('Fetching all mealTypes...');
//     try {
//         // Query to select all cuisines from the cuisines table
//         const result = await pool.query('SELECT meal_type FROM recipes ORDER BY name');
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error getting all meal types:', error);
//         res.status(500).send('Server error');
//     }
// });

// Define a route for submitting recipes
router.post('/submit-recipe', authenticateToken, async (req, res) => {
    const { name, cuisine, mealType, ingredients, instructions, rating } = req.body;
    const userId= req.user.id;
    console.log(req.body);
    try {
        const cuisineResult = await query('SELECT id FROM cuisines WHERE name = $1', [cuisine]);
        const cuisineId = cuisineResult.rows[0]?.id;

        const mealTypeResult = await pool.query('SELECT id FROM mealtypes WHERE name = $1', [mealType]);
        const mealTypeId = mealTypeResult.rows[0]?.id;

        if (!mealTypeId) {
            return res.status(400).json({ error: "mealTypeId not found" });
        }

        if (!cuisineId) {
            return res.status(400).json({ error: "Cuisine not found" });
        }

        const result = await query(
            'INSERT INTO recipes (name, cuisine_id, meal_type_id , ingredients, instructions, rating, user_Id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
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
        const result = await pool.query(`SELECT recipes.*, cuisines.name AS cuisine_name, users.username AS username FROM recipes
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



//causing problems 
router.get('/recipes/:id(\\d+)', async (req, res) => {
    const recipeId = req.params.id;

    try {
        const result = await pool.query(`
            SELECT recipes.*, 
                   cuisines.name AS cuisine_name, 
                   users.username AS username, 
                   mealTypes.name AS meal_type_name
            FROM recipes 
            JOIN cuisines ON recipes.cuisine_id = cuisines.id
            JOIN users ON recipes.user_id = users.id
            JOIN mealTypes ON recipes.meal_type_id = mealTypes.id
            WHERE recipes.id = $1
        `, [recipeId]);

        if (result.rows.length === 0) {
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
        const result = await pool.query(
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

router.get('/recipes/sorted', async (req, res) => {
    const { sortBy } = req.query;

    // Predefined mapping to prevent direct user input in the query
    const validSortOptions = {
        'cuisine': 'cuisines.name',
        'mealType': 'recipes.meal_type',
        'createdAt': 'recipes.created_at'
    };

    // Default to sorting by creation date if the sortBy parameter is not valid
    const orderByColumn = validSortOptions[sortBy] || validSortOptions['createdAt'];

    try {
        const queryText = `
            SELECT recipes.*, cuisines.name AS cuisine_name, users.username
            FROM recipes
            JOIN cuisines ON recipes.cuisine_id = cuisines.id
            JOIN users ON recipes.user_id = users.id
            ORDER BY ${orderByColumn} ASC;
        `;

        const result = await pool.query(queryText);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching sorted recipes:', error);
        res.status(500).json({ message: 'An error occurred while fetching sorted recipes.' });
    }
});


router.get('/cuisines', async (req, res) => {
    console.log('Fetching all cuisines...');
    try {
        // Directly querying the cuisines table to fetch all cuisine names
        const result = await pool.query('SELECT name FROM cuisines ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting all cuisines:', error);
        res.status(500).send('Server error');
    }
});
  
  // Get distinct meal types
  router.get('/recipes/mealTypes', async (req, res) => {
    try {
      const result = await pool.query('SELECT name FROM mealtypes ORDER BY name');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching meal types:', error);
      res.status(500).json({ message: 'Failed to fetch meal types' });
    }
  });

  router.get('/recipes/by-cuisine/:cuisine', async (req, res) => {
    const { cuisine } = req.params;
    try {
      const queryText = `
        SELECT recipes.*, cuisines.name AS cuisine_name, users.username AS username
        FROM recipes
        JOIN cuisines ON recipes.cuisine_id = cuisines.id
        JOIN users ON recipes.user_id = users.id
        WHERE cuisines.name = $1
        ORDER BY recipes.created_at DESC;
      `;
      const result = await pool.query(queryText, [cuisine]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No recipes found for this cuisine.' });
      }
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching recipes by cuisine:', error);
      res.status(500).json({ message: 'An error occurred while fetching recipes by cuisine.' });
    }
  });
  
 router.get('/recipes/by-meal-type/:mealType', async (req, res) => {
  const { mealType } = req.params;
  try {
    const queryText = `
    SELECT recipes.*, cuisines.name AS cuisine_name, users.username AS username, mealtypes.name AS meal_type_name
    FROM recipes
    JOIN cuisines ON recipes.cuisine_id = cuisines.id
    JOIN users ON recipes.user_id = users.id
    JOIN mealtypes ON recipes.meal_type_id = mealtypes.id  
    WHERE mealtypes.name = $1
    ORDER BY recipes.created_at DESC;
    
    `;
    const result = await pool.query(queryText, [mealType]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this meal type.' });
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recipes by meal type:', error);
    res.status(500).json({ message: 'An error occurred while fetching recipes by meal type.' });
  }
});


// Export the router
export default router;