import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import pkg from 'pg';
const { Pool } = pkg;
import { query } from "./db.js"; // Adjust the path as necessary



const app = express();
const port = 3000;

dotenv.config();


app.get('/api/data', async (req, res) => {
  try {
    const result = await query('SELECT * FROM your_table');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Other server setup...




app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });


  

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });