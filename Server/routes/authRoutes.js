import express from 'express';
import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const{Pool} = pg;

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL});

router.post('/register', async (req, res) => {
    const pool = {firstName, lastName, email, password} = req.body;

    try {
        
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists with that email." });

        }
        const hashedPassword = await bcrypt.hash(password, 10);

        
            const newUser = await pool.query("INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4 RETURNING *",
            [firstName, lastName, email, hashedPassword]
            );
            res.status(201).json({user: newUser.rows[0]});
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }

});

export default router;