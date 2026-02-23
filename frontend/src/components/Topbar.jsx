import React from 'react';
import { Search, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
    const { user } = useAuth();

    return (
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 ml-64">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search here..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                />
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-6">
                <button className="relative text-gray-400 hover:text-indigo-600 transition-colors">
                    <MessageSquare size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="relative text-gray-400 hover:text-indigo-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800">{user?.name || 'Student'}</p>
                        <p className="text-xs text-gray-500">{user?.role || 'Student'}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
