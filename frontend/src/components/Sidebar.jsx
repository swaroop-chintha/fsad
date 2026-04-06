import React from 'react';
import { LayoutDashboard, BookOpen, FileText, HelpCircle, Settings, LogOut, MessageSquare, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
        { icon: BookOpen, label: 'Courses', path: '/student/courses' },
        { icon: FileText, label: 'Chapter', path: '/student/chapters' },
        { icon: HelpCircle, label: 'Help', path: '/student/help' },
        { icon: Settings, label: 'Settings', path: '/student/settings' },
    ];

    return (
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 border-r border-gray-100 dark:border-gray-700 flex flex-col justify-between py-6 px-4 transition-all duration-300`}>
            <div>
                {/* Header / Logo */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-10`}>
                    <div className={`flex items-center gap-2 ${isCollapsed ? 'hidden' : 'px-4'}`}>
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg transform rotate-12 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full opacity-50"></div>
                        </div>
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">EduSub.</span>
                    </div>
                    <button onClick={onToggle} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 focus:outline-none bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all flex-shrink-0">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="space-y-1 overflow-hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            title={isCollapsed ? item.label : undefined}
                            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                                }`}
                        >
                            <item.icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} flex-shrink-0`} />
                            {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bottom Items */}
            <div className="space-y-1 overflow-hidden">
                <button
                    title={isCollapsed ? "FAQ" : undefined}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all duration-200`}
                >
                    <MessageSquare className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} flex-shrink-0`} />
                    {!isCollapsed && <span className="font-medium whitespace-nowrap">FAQ</span>}
                </button>
                <button
                    onClick={logout}
                    title={isCollapsed ? "Logout" : undefined}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-all duration-200`}
                >
                    <LogOut className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'} flex-shrink-0`} />
                    {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
