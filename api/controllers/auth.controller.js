import User from "../models/user.model.js";
import { scryptSync, randomBytes } from "crypto";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Callback for /models/auth.route.js

export async function signup(req, res, next) {
    try {
        const { username, email, password } = req.body;

        // Check if username or email already exists
        const validUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        // console.log(validUser);
        if (validUser) {
            if (validUser.username === username) {
                return next(errorHandler(400, "Username already exists!"));
            } else if (validUser.email === email) {
                return next(errorHandler(400, "Email already exists!"));
            }
        }

        // Scrypt
        const salt = randomBytes(16).toString("hex");
        const saltWord = scryptSync(password, salt, 64).toString("hex") + salt;
        const encodeWord = Buffer.from(saltWord).toString("base64");

        // Create new user
        const newUser = new User({ username, email, password: encodeWord });
        // console.log(newUser);
        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        next(err);
    }
}

export async function signin(req, res, next) {
    try {
        if (!req.body.email || !req.body.password) {
            return next(errorHandler(400, "Email and password are required!"));
        }

        // Check if user exists
        const { email, password } = req.body;
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(401, "Wrong credentials!"));
        }

        // Scrypt compare
        const decodeWord = Buffer.from(validUser.password, "base64").toString();
        const salt = decodeWord.slice(-32);
        const decodeSaltWord = decodeWord.slice(0, -32);
        const saltWord = scryptSync(password, salt, 64).toString("hex");

        if (decodeSaltWord !== saltWord) {
            return next(errorHandler(401, "Wrong credentials!"));
        }

        const { password: _, ...userWithoutPassword } = validUser.toObject();

        // JWT
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(userWithoutPassword);
    } catch (err) {
        next(err);
    }
}
