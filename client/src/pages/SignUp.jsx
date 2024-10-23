import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }
    async function handleSubmit(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                setError("Error: " + data.message);
                setLoading(false);
                return;
            }
            setLoading(false);
            navigate("/sign-in");
        } catch (error) {
            setError("Error: " + error.message);
            setLoading(false);
        }
    }
    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    className="border p-3 rounded-lg"
                    id="username"
                    onChange={handleChange}
                ></input>
                <input
                    type="email"
                    placeholder="email"
                    className="border p-3 rounded-lg"
                    id="email"
                    onChange={handleChange}
                ></input>
                <input
                    type="password"
                    placeholder="password"
                    className="border p-3 rounded-lg"
                    id="password"
                    onChange={handleChange}
                ></input>
                <button
                    disabled={
                        loading ||
                        formData.email === "" ||
                        formData.password === "" ||
                        formData.username === ""
                    }
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                >
                    {loading ? "Loading..." : "Sign Up"}
                </button>
            </form>
            <div className="flex flex-row gap-2 mt-5">
                <p>Have an account?</p>
                <Link to={"/sign-in"}>
                    <span className="text-blue-700">Sign in</span>
                </Link>
            </div>
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
    );
}

export default SignUp;
