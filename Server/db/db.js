import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize a connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432
});

export const query = async (text, params) => {
  try {
    const response = await pool.query(text, params);
    return response; // This contains rows and other response properties
  } catch (err) {
    console.error('Query error', err.stack);
    throw err;
  }
};
