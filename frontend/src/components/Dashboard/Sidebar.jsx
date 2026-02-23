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
        <div className="w-64 bg-white shadow-lg h-screen flex flex-col fixed left-0 top-0 z-10">
            <div className="p-6 border-b flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-gray-800">EduSub</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeTab === item.id
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
