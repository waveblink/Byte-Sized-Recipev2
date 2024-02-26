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
export async function saveAIGeneratedRecipe(recipe) {
  const { name, cuisineId, mealTypeId, ingredients, instructions, rating, userId, nutritionFacts } = recipe; // Assuming these are the fields you have

  const sql = `
      INSERT INTO ai_generated_recipes (name, cuisine_id, meal_type_id, ingredients, instructions, rating, user_id, nutrition_facts) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
  `;

  const values = [name, cuisineId, mealTypeId, ingredients, instructions, rating, userId, nutritionFacts];

  try {
      const result = await query(sql, values);
      return result.rows[0].id; // Return the ID of the newly inserted recipe
  } catch (error) {
      console.error('Error saving AI-generated recipe to database:', error);
      throw error;
  }
}

export async function linkRecipeToUser(userId, recipeId) {
  const sql = `
      INSERT INTO user_saved_recipes (user_id, recipe_id) VALUES ($1, $2)
  `;

  const values = [userId, recipeId];

  try {
      await query(sql, values);
  } catch (error) {
      console.error('Error linking recipe to user:', error);
      throw error;
  }
}



// Assuming this is in a file like dbOperations.js or a similar module
export async function getRecipesByUserId(userId) {
  const sql = `
      SELECT * FROM user_recipes WHERE user_id = $1
  `;

  try {
      const result = await query(sql, [userId]); // Execute the query
      return result.rows; // Return the rows from the query result
  } catch (error) {
      console.error('Error fetching recipes from database:', error);
      throw error; // Rethrow the error to be caught by the caller
  }
}
