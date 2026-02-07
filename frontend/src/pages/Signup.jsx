import { useState, useContext } from "react";
import { signup } from "../api/authService";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";

import { FaRegUser } from "react-icons/fa6";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

export default function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await signup(formData);
            login(response.access_token); // JWT from backend
            navigate("/maindashboard");
        } catch (err) {
            setError(err.response?.data?.detail || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full h-screen p-4">
            <img src={Logo} alt="Logo" className="w-40" />

            <h1 className="text-[#696969] text-2xl font-bold">
                Sign Up
            </h1>

            <p className="text-[#696969] text-lg font-semibold">
                PulseAI, smart and analytical AI system
            </p>

            {error && <p className="text-red-500">{error}</p>}

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 items-center w-full p-4"
            >
                <div className="flex items-center bg-[#F2F2F2] border-2 border-[#dfdfdf] gap-2 text-[#696969] w-md rounded-md p-3">
                    <FaRegUser />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-transparent focus:outline-none"
                    />
                </div>

                <div className="flex items-center bg-[#F2F2F2] border-2 border-[#dfdfdf] gap-2 text-[#696969] w-md rounded-md p-3">
                    <HiOutlineMail />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-transparent focus:outline-none"
                    />
                </div>

                <div className="flex items-center bg-[#F2F2F2] border-2 border-[#dfdfdf] gap-2 text-[#696969] w-md rounded-md p-3">
                    <HiOutlineLockClosed />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-transparent focus:outline-none"
                    />
                </div>

                <div className="flex gap-1 text-[#696969]">
                    <p>Already have an account?</p>
                    <Link to="/login" className="text-[#E013CC] font-bold">
                        Login
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#E013CC] text-white hover:bg-black w-md h-9 rounded-md duration-300"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}
