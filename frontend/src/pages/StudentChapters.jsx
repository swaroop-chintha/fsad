import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Book, PlayCircle } from 'lucide-react';

const StudentChapters = () => {
    // For now, this can mimic Courses but focusing on "Learning Content"
    // In a real app, this might fetch modules/chapters specific to the active course.
    // Let's just list courses as "Modules" for demonstration of the page existence.
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const res = await api.get('/api/courses');
                setModules(res.data);
            } catch (e) { console.error(e) }
        };
        fetchModules();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Chapters</h1>

            <div className="space-y-4">
                {modules.map(module => (
                    <div key={module.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Book size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{module.title}</h3>
                            <p className="text-gray-500 text-sm">Chapter 1: Introduction & Basics</p>
                            <div className="mt-2 w-full max-w-md bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-1/3 rounded-full"></div>
                            </div>
                        </div>
                        <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                            <PlayCircle size={24} />
                        </button>
                    </div>
                ))}
                {modules.length === 0 && <p className="text-gray-500">No chapters available.</p>}
            </div>
        </div>
    );
};

export default StudentChapters;
