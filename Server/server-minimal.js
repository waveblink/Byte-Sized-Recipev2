import express from 'express';
import { pool } from './db/db.js'; // Adjust the path as necessary

const app = express();
const port = 3000; // or any port suitable for your environment

app.use(express.json()); // Middleware to parse JSON bodies

// Test route for fetching cuisines
app.get('/api/recipes/cuisines', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
