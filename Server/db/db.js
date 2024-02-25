// Correctly import the pg package and destructure Pool from it
import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

dotenv.config();

// Initialize a connection pool
export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  connectionString: process.env.DATABASE_URL,
});


// Async function to query the database
export const query = async (text, params) => {
  try {
    const response = await pool.query(text, params);
    return response; // This contains rows and other response properties
  } catch (err) {
    console.error('Query error', err.stack);
    throw err;
  }
};

// Assuming you have a db.js file where you've set up your database connection
/**
 * Save a recipe to the database for a specific user.
 * 
 * @param {number} userId - The ID of the user saving the recipe.
 * @param {object} recipe - The recipe object to save.
 * @returns {Promise<void>}
 */
async function saveRecipeToDatabase(userId, recipe) {
  // Assuming `recipe` object does not need `userId` from its structure,
  // since `userId` is passed as a separate parameter
  const { name, cuisineId, mealTypeId, ingredients, instructions, rating, nutritionFacts } = recipe;

  const sql = `
      INSERT INTO user_recipes (name, cuisine_id, meal_type_id, ingredients, instructions, rating, user_id, nutrition_facts)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  const values = [name, cuisineId, mealTypeId, ingredients, instructions, rating, userId, nutritionFacts];

  try {
      await query(sql, values); // Execute the query to insert the recipe
  } catch (error) {
      console.error('Error saving recipe to database:', error);
      throw error; // Rethrow the error to be caught by the caller
  }
}

