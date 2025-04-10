import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config({ path: "./.env" });

console.log("URI:", process.env.MONGO);
console.log("ALL ENV VARS:", process.env);

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

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("server is running on port 3000!");
});

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
