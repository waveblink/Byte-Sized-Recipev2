import express from 'express';
import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';
const router = express.Router();

dotenv.config();
const { Pool } = pg;


const pool = new Pool({ connectionString: process.env.DATABASE_URL });

router.post('/register', async (req, res) => {
    // Log when the route is hit
    console.log("Register endpoint hit", req.body);

    const { firstName, lastName, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists with that email." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const newUser = await pool.query("INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [firstName, lastName, email, hashedPassword]
        );

        // Successfully created new user
        res.status(201).json({ user: newUser.rows[0] });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: 'Error registering user' });
    }
});


    router.post('/login', async (req, res) => {
        // Log when the route is hit
        console.log("Login endpoint hit", req.body);
    
        const { email, password } = req.body;
    
        try {
            // Check if user already exists
            const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            if (userExists.rows.length === 0) {
                return res.status(400).json({ message: "User not found or wrong email" });
            }

            const user = userExists.rows[0];

            const isValidPassword = await bcrypt.compare(password, user.password);
            if(!isValidPassword) {
                return res.status(401).json({message: "Invalid Password"})
            }
            res.status(200).json({message: "Welcome back!"})

        } catch (error) {
            console.error("Error Loging In:", error);
            res.status(500).json({ message: 'Error Logging user' });
        }
    
});

export default router;
