import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { colorLog, errorLog } from 'psgutil'

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(colorLog);

//endpoints would go here

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use(errorLog);