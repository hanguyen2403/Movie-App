import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './Routes/UserRouter.js';
import movieRouter from "./Routes/MoviesRouter.js";
import listRouter from "./Routes/FavoriteRouter.js";
import commentRouter from "./Routes/CommentRouter.js";
import { errorHandler } from './middlewares/errorMiddleware.js';


const app = express();
app.use(cors());
app.use(express.json());
//CONNECT TO MONGODB
connectDB();

//Main router
app.get('/', (req, res) => {
  res.send('API is running...');
});
//other routes
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/lists", listRouter);
app.use("/api/comments", commentRouter);

app.use((req, res, next) => {
  console.log(`404 Error: Route ${req.originalUrl} not found`);
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});