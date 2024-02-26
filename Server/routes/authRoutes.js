import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';
const router = express.Router();


dotenv.config();
const { Pool } = pg;
const jwtSecret = process.env.JWT_SECRET;


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
router.post('/login', async (req, res) => {
    console.log("Login endpoint hit", req.body);
    const { email, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET; // Ensure this is defined

    try {
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            // Using a generic error message
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = userQuery.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            // Using a generic error message
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Omitting password from the user data sent in the response
        const { password, ...userDataWithoutPassword } = user;
        
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1 day' });
        res.cookie('token', token, { 
            httpOnly: true, 
            path: '/', 
            maxAge: 24 * 60 * 60 * 1000, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });
        res.status(200).json({ message: "Login successful", user: userDataWithoutPassword });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});


async function getUserById(userId) {
    const queryResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (queryResult.rows.length > 0) {
        return queryResult.rows[0]; // Returns the first user matching the ID
    } else {
        return null; // No user found
    }
}



         

router.post('/logout', (req, res) => {
    console.log('Logout route hit');
    res.cookie('token', '', { httpOnly: true, path: '/', expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
  });
  

router.post('/register', async (req, res) => {
    // Log when the route is hit
    console.log("Register endpoint hit", req.body);

    const { firstName, lastName, email, password, username } = req.body;

    try {
        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists with that email." });
        }
        const usernameExists = await pool.query("SELECT * FROM users WHERE email = $1", [username]);
        if (usernameExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists with that username." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const newUser = await pool.query("INSERT INTO users (firstName, lastName, email, password, username) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [firstName, lastName, email, hashedPassword, username]
        );

        // Successfully created new user
        res.status(201).json({ user: newUser.rows[0] });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: 'Error registering user' });
    }
});


router.get('/validate', async (req, res) => {
    const token = req.cookies.token;
    console.log("cookies:", token)
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details using the ID from the decoded token
        const user = await getUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare user details for response, excluding sensitive information like passwords
        const { password, ...userDetails } = user;
        res.status(200).json({ message: 'Session is valid', user: userDetails });
    } catch (error) {
        console.error("Validation error:", error.message);
        res.status(401).json({ message: 'Session validation failed' });
    }
});



export default router;
export const query = (text, params) => pool.query(text, params);