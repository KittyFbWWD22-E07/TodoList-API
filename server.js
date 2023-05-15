import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { genericErrHandler, noRoute } from './middlewares/err.handler.js';
import { connectToDB } from './utils/db.js';

// set environment variables
process.NODE_ENV === 'production'
    ? dotenv.config({ path: './config/production.env' })
    : dotenv.config({ path: './config/development.env' });

// create app
const app = express();

// database connection
connectToDB();

// core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(cors());

// routes
// app.use('/users', userRouter);
// app.use('/tasks', taskRouter);

// error handlers
app.use(noRoute);
app.use(genericErrHandler);

// port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
