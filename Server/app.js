import cors from 'cors';
import { query } from './db/db.js'; // Adjust the path as necessary
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import recipeRoutes from './routes/recipeRoutes.js';




const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

dotenv.config();
app.use('/api', recipeRoutes);


app.get('/api/data', async (req, res) => {
  try {
    const result = await query('SELECT * FROM recipes');
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

app.post('/api/submit-recipe', async (req,res) => {
  const{name, cuisine, mealType, ingredients, instructions, rating} = req.body;

  try{
    const cuisineResult = await query('SELECT id FROM cuisines WHERE name = $1', [cuisine]);
    const cuisineId = cuisineResult.rows[0]?.id;

    if (!cuisineId){
      return res.status(400).json({error: "Cuisine not found" });
    }
    const result = await query(
      'INSERT INTO recipes (name, cuisine_id, mealType, ingredients, instructions, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, cuisineId, mealType, ingredients, instructions, rating]
    );

    res.json(result.rows[0]);

  }catch (err){
    console.error('Error inserting recipe:', err);
    res.status(500).send('Server error');
  }

})

  

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });