import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default:
                "https://pixabay.com/get/g21994317b68881a1287c74cdbfa697e01b6a136449e14870bb2880383860840d78ca5610a1e38ecdc929220f380e16c8a06a8104dbaf42caf627e48dc6ef1fc25afc86a0e03bceeec92f7ba866750d01_640.png",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
