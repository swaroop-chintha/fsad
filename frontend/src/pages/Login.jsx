import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import loginBg from "../assets/login_bg.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login(email, password);
        if (result.success) {
            if (result.role === "ADMIN") {
                navigate("/teacher");
            } else {
                navigate("/student");
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col md:flex-row items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background elements (grid, stars placeholder, etc.) */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Main Content Wrapper */}
            <div className="z-10 flex flex-col items-center w-full max-w-6xl md:flex-row relative">


                {/* Left side: Illustration */}
                <div className="hidden md:flex flex-1 justify-center items-center p-8 relative z-0">
                    <img
                        src={loginBg}
                        alt="Education 3D Illustration"
                        className="w-full max-w-[650px] object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700"
                    />
                </div>

                {/* Right side: Login Card */}
                <div className="w-full max-w-[440px] p-8 md:p-10 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white z-10 relative flex flex-col items-center">
                    {/* Logo inside card */}
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-[linear-gradient(135deg,#7a73ff,#5b4eff)] flex items-center justify-center rounded-xl shadow-lg shadow-indigo-500/30">
                            <span className="text-white font-bold text-2xl">E</span>
                        </div>
                        <span className="text-3xl font-extrabold text-[#1f2937] tracking-tight">EduSub</span>
                    </div>

                    <div className="text-center mb-8 w-full">
                        <h2 className="text-[32px] font-bold text-[#1f2937] mb-2 tracking-tight leading-tight">
                            Welcome Back!
                        </h2>
                        <p className="text-gray-500 font-medium text-[15px]">Login to continue</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6366f1]/60 group-focus-within:text-[#6366f1] transition-colors">
                                    <Mail size={22} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-[15px] border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-[#6366f1] bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-semibold text-[15px] transition-all outline-none"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6366f1]/60 group-focus-within:text-[#6366f1] transition-colors">
                                    <Lock size={22} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-4 py-[15px] border-2 border-gray-100 rounded-2xl focus:ring-0 focus:border-[#6366f1] bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-semibold text-[15px] transition-all outline-none"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-1">
                            <a href="#" className="text-[13px] font-bold text-[#6366f1] hover:text-[#4f46e5] hover:underline transition-all">
                                Forgot password?
                            </a>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mb-4 text-center font-semibold bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">{error}</div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-[15px] px-4 rounded-2xl shadow-lg shadow-indigo-500/25 text-[16px] font-bold text-white bg-gradient-to-r from-[#7a73ff] to-[#5b4eff] hover:from-[#6b62ff] hover:to-[#4a3cf5] focus:outline-none focus:ring-4 focus:ring-[#6366f1]/30 focus:ring-offset-2 transition-all transform hover:-translate-y-1 active:scale-95 duration-200 mt-2"
                        >
                            Log In
                        </button>

                        <div className="text-[14px] text-center mt-8 text-gray-500 font-medium">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-bold text-[#6366f1] hover:text-[#4f46e5] hover:underline transition-all ml-1">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Some decorative background blobs/blur like in the image */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse transition-all duration-[5000ms]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse transition-all duration-[6000ms]"></div>
            <div className="absolute -bottom-10 left-1/2 w-[600px] h-[600px] bg-yellow-200/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse transition-all duration-[7000ms]"></div>
        </div>
    );
};

export default Login;
