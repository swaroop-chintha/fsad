import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import loginBg from "../assets/login_bg.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await login(email, password);
        setIsSubmitting(false);

        if (result.success) {
            showToast("Successfully logged in!", "success");
            if (result.role === "ADMIN") {
                navigate("/teacher");
            } else {
                navigate("/student");
            }
        } else {
            showToast(result.message || "Failed to login", "error");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background elements (grid, blobs) */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>

            {/* Main Content Wrapper */}
            <div className="z-10 flex flex-col items-center w-full max-w-6xl md:flex-row relative">

                {/* Left side: Illustration */}
                <div className="hidden md:flex flex-1 justify-center items-center p-8 relative z-0 animate-float">
                    <img
                        src={loginBg}
                        alt="Education 3D Illustration"
                        className="w-full max-w-[600px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </div>

                {/* Right side: Login Card */}
                <div className="w-full max-w-md p-8 md:p-10 glass-card rounded-[2.5rem] z-10 relative flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                    {/* Logo inside card */}
                    <div className="flex items-center space-x-3 mb-8 hover:scale-105 transition-transform cursor-default">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-500/30">
                            <span className="text-white font-black text-3xl">E</span>
                        </div>
                        <span className="text-3xl font-extrabold text-slate-800 tracking-tight">EduSub</span>
                    </div>

                    <div className="text-center mb-8 w-full">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
                            Welcome Back!
                        </h2>
                        <p className="text-slate-500 font-medium text-sm">Sign in to continue your learning journey</p>
                    </div>

                    <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300">
                                    <Mail size={20} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white/50 hover:bg-white text-slate-900 placeholder-slate-400 font-medium text-[15px] transition-all outline-none shadow-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300">
                                    <Lock size={20} strokeWidth={2.5} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white/50 hover:bg-white text-slate-900 placeholder-slate-400 font-medium text-[15px] transition-all outline-none shadow-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 bg-white/50" />
                                <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-500/25 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 duration-200 mt-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed transform-none hover:transform-none' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="text-sm text-center mt-6 text-slate-500 font-medium">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all ml-1">
                                Create an account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
