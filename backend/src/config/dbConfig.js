import { dbConfig } from "./envConfig.js";
import mysql2 from 'mysql2/promise';

export const pool = mysql2.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});