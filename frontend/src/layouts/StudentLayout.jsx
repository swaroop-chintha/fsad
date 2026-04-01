import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import studentBg from '../assets/student_bg.png';

const StudentLayout = () => {
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
                <Sidebar />
                <Topbar />
                <div className="ml-64 p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StudentLayout;
