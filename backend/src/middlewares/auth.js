import { jwtSecret } from "../config/envConfig.js";
import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden' });
    }
}