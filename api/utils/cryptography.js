import { randomBytes, scryptSync } from "crypto";

function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const saltPassword = scryptSync(password, salt, 64).toString("hex") + salt;
    return Buffer.from(saltPassword).toString("base64");
}

function comparePassword(localPassword, dbPassword) {
    const decodePassword = Buffer.from(dbPassword, "base64").toString();
    const salt = decodePassword.slice(-32);
    const decodeSaltPassword = decodePassword.slice(0, -32);
    const saltPassword = scryptSync(localPassword, salt, 64).toString("hex");

    return decodeSaltPassword === saltPassword;
}

function generateAndHashPassword() {
    const generatedPassword = randomBytes(16).toString("hex");
    const encodePassword = hashPassword(generatedPassword);
    return encodePassword;
}

function generateUsername(username) {
    return (
        username.split(" ").join("").toLowerCase() +
        Math.random().toString(36).substring(7)
    );
}

export {
    hashPassword,
    comparePassword,
    generateAndHashPassword,
    generateUsername,
};
