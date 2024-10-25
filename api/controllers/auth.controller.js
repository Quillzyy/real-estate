import User from "../models/user.model.js";
import { scryptSync, randomBytes } from "crypto";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Callback for /models/auth.route.js

function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const saltWord = scryptSync(password, salt, 64).toString("hex") + salt;
    return Buffer.from(saltWord).toString("base64");
}

function comparePassword(localPassword, dbPassword) {
    const decodeWord = Buffer.from(dbPassword, "base64").toString();
    const salt = decodeWord.slice(-32);
    const decodeSaltWord = decodeWord.slice(0, -32);
    const saltWord = scryptSync(localPassword, salt, 64).toString("hex");

    return decodeSaltWord === saltWord;
}

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
        const encodeWord = hashPassword(password);

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
        if (!comparePassword(password, validUser.password)) {
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

export async function google(req, res, next) {
    try {
        const { username, email, photo } = req.body;

        const validUser = await User.findOne({ email });
        if (validUser) {
            const { password: _, ...userWithoutPassword } =
                validUser.toObject();
            const token = jwt.sign(
                { id: validUser._id },
                process.env.JWT_SECRET
            );
            res.cookie("access_token", token, { httpOnly: true })
                .status(200)
                .json(userWithoutPassword);

            // console.log("Google user signed in!");
            // console.log(validUser);
            // console.log(token);
        } else {
            const generatedPassword = randomBytes(16).toString("hex");
            const encodeWord = hashPassword(generatedPassword);

            const generatedUsername =
                username.split(" ").join("").toLowerCase() +
                Math.random().toString(36).substring(7);

            const newUser = new User({
                username: generatedUsername,
                email,
                password: encodeWord,
                avatar: photo,
            });
            await newUser.save();

            const { password: _, ...userWithoutPassword } = newUser.toObject();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            res.cookie("access_token", token, { httpOnly: true })
                .status(201)
                .json(userWithoutPassword);
            // console.log("Google user created!");
            // console.log(newUser);
            // console.log(token);
        }
    } catch (err) {
        next(err);
    }
}
