import bcrypt from 'bcrypt';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pg from 'pg';
import jwt from 'jsonwebtoken';




const app = express();
const port = process.env.PORT || 4000;

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const jwtSecret = process.env.JWT_SECRET;



app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Test route for fetching cuisines
app.post('/login', async (req, res) => {
    console.log("Attempting to log in", req.body);

    const { email, password } = req.body;
    try {
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = userQuery.rows[0];
        // Ensure password is a string to avoid SCRAM authentication errors
        const isValidPassword = await bcrypt.compare(String(password), user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1 day' });
        res.cookie('token', token, { httpOnly: true, path: '/', maxAge: 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });
        res.status(200).json({ message: "Login successful", user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
