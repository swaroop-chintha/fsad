import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell } from 'lucide-react';

const StudentSettings = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <User size={20} className="text-indigo-600" /> parseProfile Information
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" value={user.name} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" value={user.email} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">{user.role}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Lock size={20} className="text-indigo-600" /> Security
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <button className="text-indigo-600 font-medium hover:underline">Change Password</button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Bell size={20} className="text-indigo-600" /> Notifications
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700">Email notifications for new assignments</span>
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
