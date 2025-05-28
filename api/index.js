import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// app routes
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js"
// app middlewares
import { notFound } from './middleware/not-found.js'
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
// app pacakges
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimiter from 'express-rate-limit'
import helmet from 'helmet'
import cors from "cors"

// using env file
dotenv.config({ path: "./.env" });

// express config
const app = express();
app.use(express.json());

// connecting to MongoDB(database) and starting the server
mongoose
  .connect(process.env.MONGO, {
    serverSelectionTimeoutMS: 20000, // <- Wait up to 20s before timeout
  })
  .then(() => {
    console.log("connected to MongoDB!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(3000, () => {
  console.log("server is running on port 3000!");
});

// index route
app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

// app packages
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
}))
app.use(helmet())
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors({
  origin: ['http://localhost:5173', 'https://wf-marketplace.netlify.app', 'https://marketplacewf.netlify.app'],
  credentials: true
}));


// app routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// app middlewares
app.use(notFound);
app.use(errorHandlerMiddleware)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    suceess: false,
    statusCode,
    message,
  });
});
