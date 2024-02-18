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
