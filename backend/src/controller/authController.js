import { pool } from "../config/dbConfig.js";
import argon2 from 'argon2';
import { generateToken } from "../util/token.js";
import validate from "psgutil";

export async function register(req, res, next) {
    const { username, password, email, fullname, birthdate, gender, bio } = req.body;
    try {
        if (!validate('username', username) || !validate('password', password) || !validate('email', email)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
        const hashedPassword = await argon2.hash(password);

        const [exists] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (exists.length > 0) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        await pool.query('INSERT INTO users (username, password_hash, email, full_name, birth_date, gender, bio) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, hashedPassword, email, fullname, birthdate, gender, bio]);
        res.status(201).json({ message: 'User registered successfully'});
    }
    catch (error) {
        next(error);
    }
}
export async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        const [exists] = await pool.query('SELECT id, password_hash FROM users WHERE email = ?', [email]);
        if (exists.length !== 1) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (!await argon2.verify(exists[0].password_hash, password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(exists[0].id);
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax' }).json({ message: 'Login successful' });
        res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        next(error);
    }
}