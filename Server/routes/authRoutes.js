import express from 'express';
import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const{Pool} = pg;

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL});

router.post('/register', async (req, res) => {

});

export default router;