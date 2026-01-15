import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { colorLog, errorLog } from 'psgutil'

import authRoutes from './src/routes/authRoutes.js';

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(colorLog);

// Routes
app.use('/auth', authRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Error logging middleware
app.use(errorLog);