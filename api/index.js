import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import "./utils/firebase.js";

dotenv.config();

// Deprecated into firestore
mongoose
    .connect(process.env.DB_URI)
    .then(() => {
        console.log("Database connected!");
    })
    .catch((err) => {
        console.error("Error: " + err);
    });

const app = express();

app.use(express.json());

app.listen(5000, () => {
    console.log("Server is running on port 5000!");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    });
});
