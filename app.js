import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config as cloudinaryConfig } from 'cloudinary';
import errorMiddleware from './middleware/error.js';
import userRouter from './routes/user.route.js';
import eventRouter from './routes/event.route.js';
import teamRouter from './routes/team.route.js';

const app = express();

const corsOptions = {
  origin: "*",
};

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

cloudinaryConfig({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the User Registration API");
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});
app.get("/health", (req, res) => {
  res.status(200).json("Health checking");
});

// imports
app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);
app.use('/api/team', teamRouter);

app.use(errorMiddleware);

export default app;
