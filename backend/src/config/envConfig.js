import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET'
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName] && varName !== 'DB_PASSWORD') {
        throw new Error(`Environment variable ${varName} is not set.`);
    }
});

export const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

export const jwtSecret = process.env.JWT_SECRET;