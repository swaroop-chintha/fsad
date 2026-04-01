import React from 'react';
import { Search, Bell, MessageSquare, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Topbar = () => {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-8 ml-64 transition-colors duration-300">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search here..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-gray-600 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all outline-none"
                />
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-6">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="relative text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <MessageSquare size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="relative text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-gray-700">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800 dark:text-white">{user?.name || 'Student'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Student'}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border-2 border-white dark:border-gray-700 shadow-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
