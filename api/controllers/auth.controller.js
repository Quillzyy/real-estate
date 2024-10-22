import User from "../models/user.model.js";
import { scryptSync, randomBytes } from "crypto";

// Callback for /models/auth.route.js

export async function signup(req, res, next) {
    const { username, email, password } = req.body;

    // Scrypt

    const salt = randomBytes(16).toString("hex");
    const saltword = scryptSync(password, salt, 64).toString("hex") + salt;
    const encodeword = Buffer.from(saltword).toString("base64");
    // const decodeword = Buffer.from(encodeword, "base64").toString();
    // const salt = encodeword.slice(-32);
    // const hashword = encodeword.slice(0, -32);

    const newUser = new User({ username, email, password: saltword });
    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        next(err);
    }
}
