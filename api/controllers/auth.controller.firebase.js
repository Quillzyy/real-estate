import { addDoc, setDoc, getDocs, query, where, or } from "firebase/firestore";
import { usersCollection } from "../utils/firebase.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import {
    hashPassword,
    comparePassword,
    generateAndHashPassword,
    generateUsername,
} from "../utils/cryptography.js";

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

        const newUser = await addDoc(usersCollection, {
            username,
            email,
            password: encodePassword,
        });
        console.log({ message: "User created successfully!" });
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        next(err);
    }
}
