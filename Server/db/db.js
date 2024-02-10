import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize a connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432
});

export const query = (text, params) => pool.query(text, params);
