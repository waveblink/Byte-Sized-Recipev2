import cors from 'cors';
import express from "express";
import path from "path";
import dotenv from "dotenv";
import recipeRoutes from './routes/recipeRoutes.js'; 
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, 
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use('/api', recipeRoutes);

app.use('/api', authRoutes);

app.get('/validate', (req, res) => {
  res.status(200).json({ message: 'Validation route is working' });
});


app.post('/api/test', (req, res) => {
  res.send('Test route is working');
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
