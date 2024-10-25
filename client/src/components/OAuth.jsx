import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleGoogleOAuth() {
        try {
            // dispatch(signInStart());
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const loginResult = await signInWithPopup(auth, provider);
            // console.log(loginResult);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: loginResult.user.displayName,
                    email: loginResult.user.email,
                    photo: loginResult.user.photoURL,
                }),
            });

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            console.error(error);
            // dispatch(signInFailure(error.message));
        }
    }

    return (
        <button
            onClick={handleGoogleOAuth}
            type="button"
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
            Continue with Google
        </button>
    );
}

export default OAuth;
