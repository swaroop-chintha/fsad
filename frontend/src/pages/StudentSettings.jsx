import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Lock, Bell, Sun, Moon, Monitor } from 'lucide-react';

const StudentSettings = () => {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h1>

            {/* Profile Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <User size={20} className="text-indigo-600 dark:text-indigo-400" /> Profile Information
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input type="text" value={user?.name || ''} readOnly className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input type="email" value={user?.email || ''} readOnly className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold">{user?.role}</span>
                    </div>
                </div>
            </div>

            {/* Appearance / Theme */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Monitor size={20} className="text-indigo-600 dark:text-indigo-400" /> Appearance
                    </h2>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Choose your preferred theme for the dashboard.</p>
                    <div className="flex gap-4">
                        {/* Light Mode Card */}
                        <button
                            onClick={() => isDark && toggleTheme()}
                            className={`flex-1 p-5 rounded-2xl border-2 transition-all duration-300 group ${
                                !isDark
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10'
                                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                    !isDark
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-400 group-hover:text-indigo-500'
                                }`}>
                                    <Sun size={24} />
                                </div>
                                <span className={`text-sm font-bold ${
                                    !isDark ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'
                                }`}>Light Mode</span>
                                {!isDark && (
                                    <span className="text-xs bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-medium">Active</span>
                                )}
                            </div>
                        </button>

                        {/* Dark Mode Card */}
                        <button
                            onClick={() => !isDark && toggleTheme()}
                            className={`flex-1 p-5 rounded-2xl border-2 transition-all duration-300 group ${
                                isDark
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10'
                                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                    isDark
                                        ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                                        : 'bg-gray-100 dark:bg-gray-600 text-gray-400 group-hover:text-indigo-500'
                                }`}>
                                    <Moon size={24} />
                                </div>
                                <span className={`text-sm font-bold ${
                                    isDark ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                                }`}>Dark Mode</span>
                                {isDark && (
                                    <span className="text-xs bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-medium">Active</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Lock size={20} className="text-indigo-600 dark:text-indigo-400" /> Security
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Change Password</button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Bell size={20} className="text-indigo-600 dark:text-indigo-400" /> Notifications
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Email notifications for new assignments</span>
                        <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSettings;
