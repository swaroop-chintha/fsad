import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import studentBg from '../assets/student_bg.png';

const StudentLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative transition-colors duration-300">
            {/* Background Image with Transparency Overlay */}
            <div
                className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-10"
                style={{
                    backgroundImage: `url(${studentBg})`
                }}
            />

            <div className="relative z-10">
                <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
                <Topbar />
                <div className={`transition-all duration-300 p-8 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StudentLayout;
