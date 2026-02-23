import React from 'react';
import { LayoutDashboard, BookOpen, FileText, HelpCircle, Settings, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
        { icon: BookOpen, label: 'Courses', path: '/student/courses' }, // Placeholder paths
        { icon: FileText, label: 'Chapter', path: '/student/chapters' },
        { icon: HelpCircle, label: 'Help', path: '/student/help' },
        { icon: Settings, label: 'Settings', path: '/student/settings' },
    ];

    return (
        <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col justify-between py-6 px-4">
            <div>
                {/* Logo */}
                <div className="flex items-center gap-2 px-4 mb-10">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg transform rotate-12 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full opacity-50"></div>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">EduSub.</span>
                </div>

                {/* Nav Items */}
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bottom Items */}
            <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-200">
                    <MessageSquare size={20} />
                    <span className="font-medium">FAQ</span>
                </button>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
