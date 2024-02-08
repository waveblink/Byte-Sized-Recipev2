import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import pkg from 'pg';
const { Pool } = pkg;



const app = express();
const port = 3000;

dotenv.config();


const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432
  }); 
  

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });


  

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });