import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/envConfig.js';

export function generateToken(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
}