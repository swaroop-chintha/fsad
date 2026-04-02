import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

// You could optionally use loginBg here, but let's use a nice CSS composition for variety
const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (password.length < 6) {
            showToast("Password must be at least 6 characters.", "error");
            return;
        }

        setIsSubmitting(true);
        const result = await register(name, email, password, role);
        setIsSubmitting(false);

        if (result.success) {
            showToast("Account created successfully! Welcome to EduSub.", "success");
            if (result.role === "ADMIN") {
                navigate("/teacher");
            } else {
                navigate("/student");
            }
        } else {
            showToast(result.message || "Registration failed. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col md:flex-row items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>

            {/* Main Content Wrapper */}
            <div className="z-10 flex flex-col-reverse items-center justify-center w-full max-w-5xl md:flex-row relative gap-8 lg:gap-16">

                {/* Left side: Register Card */}
                <div className="w-full max-w-[450px] p-8 md:p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white dark:border-gray-700 rounded-[2.5rem] z-10 relative flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                    
                    <div className="mb-8 w-full">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
                            Create Account
                        </h2>
                        <p className="text-slate-500 dark:text-gray-400 font-medium text-sm">Join EduSub and start learning today.</p>
                    </div>

                    <form className="space-y-5 w-full" onSubmit={handleSubmit}>
                        
                        {/* Name Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-300">
                                <User size={20} strokeWidth={2.5} />
                            </div>
                            <input
                                type="text"
                                required
                                className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 font-medium text-[15px] transition-all outline-none shadow-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-300">
                                <Mail size={20} strokeWidth={2.5} />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 font-medium text-[15px] transition-all outline-none shadow-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        {/* Password Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-300">
                                <Lock size={20} strokeWidth={2.5} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 font-medium text-[15px] transition-all outline-none shadow-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none transition-colors duration-300"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Role Select Field */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors duration-300">
                                <ShieldCheck size={20} strokeWidth={2.5} />
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="block w-full pl-12 pr-10 py-3.5 border border-slate-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 font-medium text-[15px] transition-all outline-none shadow-sm appearance-none cursor-pointer"
                                disabled={isSubmitting}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="ADMIN">Teacher</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-500/25 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 duration-200 mt-4 ${isSubmitting ? 'opacity-80 cursor-not-allowed transform-none hover:transform-none' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>

                        <div className="text-sm text-center mt-6 text-slate-500 dark:text-gray-400 font-medium">
                            Already have an account?{" "}
                            <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline transition-all ml-1 w-max">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Right side: Modern CTA / Graphic */}
                <div className="hidden md:flex flex-col flex-1 justify-center items-start p-8 relative z-0 animate-float text-slate-800 dark:text-white">
                    <div className="flex items-center space-x-3 mb-8 hover:scale-105 transition-transform cursor-default">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-500/30">
                            <span className="text-white font-black text-4xl">E</span>
                        </div>
                        <span className="text-4xl font-extrabold tracking-tight">EduSub</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
                        Unlock your <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">
                            Learning Potential
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-gray-400 max-w-lg mb-8 leading-relaxed font-medium">
                        Join your institution's private educational portal. Get access to comprehensive courses, reliable submissions tracking, and fast feedback.
                    </p>
                    <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-8 border-t border-slate-200/50 dark:border-gray-700/50 pt-8 w-64">
                        <ShieldCheck size={18} className="text-indigo-400" /> Secure Campus Portal 
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
