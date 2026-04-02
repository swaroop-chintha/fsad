import React from 'react';
import { LayoutDashboard, BookOpen, FileText, CheckSquare, LogOut, Library, Settings, HelpCircle } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, logout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'Courses', icon: Library },
        { id: 'assignments', label: 'Assignments', icon: BookOpen },
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help', icon: HelpCircle },
    ];

    return (
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen flex flex-col fixed left-0 top-0 z-10 transition-colors duration-300 border-r border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-gray-800 dark:text-white uppercase tracking-wider">EduSub</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                                }`}
                        >
                            <Icon className={`h-5 w-5 ${activeTab === item.id ? 'animate-pulse' : ''}`} />
                            <span className="font-semibold">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-medium"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
