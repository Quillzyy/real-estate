import { addDoc, getDocs, query, where, or } from "firebase/firestore";
import { usersCollection } from "../utils/firebase.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import {
    hashPassword,
    comparePassword,
    generateAndHashPassword,
} from "../utils/cryptography.js";
import {
    currentTimestamp,
    defaultAvatar,
    generateUsername,
} from "../utils/user.utils.js";

export async function signup(req, res, next) {
    try {
        const { username, email, password } = req.body;

        // Query if username or email already exists
        const queryValidUser = await getDocs(
            query(
                usersCollection,
                or(
                    where("username", "==", username),
                    where("email", "==", email)
                )
            )
        );

        // Check if username or email already exists
        if (!queryValidUser.empty) {
            const existingUser = queryValidUser.docs[0].data();
            if (existingUser.username === username) {
                return next(errorHandler(400, "Username already exists!"));
            } else if (existingUser.email === email) {
                return next(errorHandler(400, "Email already exists!"));
            }
        }

        const encodePassword = hashPassword(password);

        const timestamp = currentTimestamp();
        const avatar = defaultAvatar;

        const newUser = await addDoc(usersCollection, {
            username,
            email,
            password: encodePassword,
            avatar,
            createdAt: timestamp,
            updatedAt: timestamp,
        });
        // console.log({ message: "User created successfully!" });
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

        const { email, password } = req.body;

        // Check if user exists
        const queryValidUser = await getDocs(
            query(usersCollection, where("email", "==", email))
        );

        if (queryValidUser.empty) {
            return next(errorHandler(401, "Email not found!"));
        } else if (queryValidUser.size > 1) {
            return next(errorHandler(500, "Duplicate email found!"));
        }

        const validUser = {
            _id: queryValidUser.docs[0].id,
            ...queryValidUser.docs[0].data(),
        };

        // Scrypt compare
        if (!comparePassword(password, validUser.password)) {
            return next(errorHandler(401, "Wrong credentials!"));
        }

        const { password: _, ...userWithoutPassword } = validUser;

        // console.log(validUser);

        // JWT
        const token = jwt.sign(
            { id: validUser._id, email: validUser.email },
            process.env.JWT_SECRET
        );
        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(userWithoutPassword);

        // console.log({ message: "User signed in successfully!" });
    } catch (err) {
        next(err);
    }
}

export async function google(req, res, next) {
    try {
        const { username, email, photo } = req.body;

        const queryValidUser = await getDocs(
            query(usersCollection, where("email", "==", email))
        );

        if (queryValidUser.empty) {
            const encodePassword = generateAndHashPassword();
            const generatedUsername = generateUsername(username);
            const timestamp = currentTimestamp();
            const avatar = photo || defaultAvatar;

            const newUser = {
                username: generatedUsername,
                email,
                password: encodePassword,
                avatar,
                createdAt: timestamp,
                updatedAt: timestamp,
            };

            const newUserDoc = await addDoc(usersCollection, newUser);

            const newUserWithId = {
                _id: newUserDoc.id,
                ...newUser,
            };

            const { password: _, ...userWithoutPassword } = newUserWithId;

            const token = jwt.sign(
                { id: newUserDoc.id },
                process.env.JWT_SECRET
            );

            res.cookie("access_token", token, { httpOnly: true })
                .status(201)
                .json(userWithoutPassword);

            // console.log({
            //     message: "Google user created and signed in successfully!",
            // });
        } else {
            const validUser = {
                _id: queryValidUser.docs[0].id,
                ...queryValidUser.docs[0].data(),
            };

            const { password: _, ...userWithoutPassword } = validUser;

            const token = jwt.sign(
                { id: validUser._id, email: validUser.email },
                process.env.JWT_SECRET
            );
            res.cookie("access_token", token, { httpOnly: true })
                .status(200)
                .json(userWithoutPassword);

            // console.log({ message: "Google user signed in successfully!" });
        }
    } catch (err) {
        next(err);
    }
}
