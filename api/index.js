import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
    .connect(process.env.DB_URI)
    .then(() => {
        console.log("Database connected!");
    })
    .catch((error) => {
        console.error("Error: " + error);
    });

const app = express();

app.listen(5000, () => {
    console.log("Server is running on port 5000!");
});
